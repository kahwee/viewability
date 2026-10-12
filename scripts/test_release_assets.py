import importlib.util
from pathlib import Path
import tempfile
import json
import os
import subprocess
import sys
import unittest

spec = importlib.util.spec_from_file_location("assets", Path(__file__).with_name("release-assets.py"))
assets = importlib.util.module_from_spec(spec)
spec.loader.exec_module(assets)


class UploadPlanTests(unittest.TestCase):
    def test_resume_preserves_matching_files_and_uploads_only_missing(self):
        with tempfile.TemporaryDirectory() as directory:
            first = Path(directory) / "archive.tgz"
            second = Path(directory) / "checksum.sha256"
            first.write_bytes(b"checked archive")
            second.write_bytes(b"checksum")
            self.assertEqual(assets.upload_plan([first, second], {first.name: assets.digest(first)}), [second])
            self.assertEqual(assets.upload_plan([first, second], {p.name: assets.digest(p) for p in [first, second]}), [])

    def test_mismatch_stops_before_uploading_missing_files(self):
        with tempfile.TemporaryDirectory() as directory:
            first = Path(directory) / "archive.tgz"
            first.write_bytes(b"changed archive")
            with self.assertRaisesRegex(RuntimeError, "refusing replacement"):
                assets.upload_plan([first], {first.name: "sha256:original"})


class RecoveryCliTests(unittest.TestCase):
    def test_cli_preserves_assets_resumes_missing_and_rejects_api_errors(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            binary = root / "bin"
            binary.mkdir()
            folder = root / "release"
            folder.mkdir()
            archive = folder / "archive.tgz"
            archive.write_bytes(b"verified archive")
            calls = root / "calls"
            fixture = root / "fixture.json"
            gh_script = """import json, os, sys
from pathlib import Path
args=sys.argv[1:]
with Path(os.environ['CALLS']).open('a') as f:f.write(json.dumps(args)+'\\n')
fixture=json.loads(Path(os.environ['FIXTURE']).read_text())
if args[0]=='api':
 if fixture.get('error'):
  print('HTTP '+str(fixture['error']),file=sys.stderr);sys.exit(1)
 print(json.dumps({'assets':fixture['assets']}))
"""
            for name, code in [("gh", gh_script), ("git", "print('checked-source-sha')")]:
                executable = binary / name
                executable.write_text("#!" + sys.executable + "\n" + code)
                executable.chmod(0o755)
            environment = {"PATH": str(binary), "GITHUB_REPOSITORY": "fixture/repository", "CALLS": str(calls), "FIXTURE": str(fixture)}
            script = Path(__file__).with_name("release-assets.py").resolve()
            def run(response):
                fixture.write_text(json.dumps(response))
                calls.write_text("")
                result = subprocess.run([sys.executable, str(script), "v1.2.3", str(folder)], cwd=root, env=environment, capture_output=True, text=True)
                return result.returncode, [json.loads(line) for line in calls.read_text().splitlines()]
            status, requests = run({"assets": [{"name": archive.name, "digest": assets.digest(archive)}]})
            self.assertEqual(status, 0)
            self.assertFalse(any(r[:2] == ['release', 'upload'] for r in requests))
            status, requests = run({"assets": []})
            self.assertEqual(status, 0)
            self.assertEqual(sum(r[:2] == ['release', 'upload'] for r in requests), 1)
            status, requests = run({"assets": [{"name": archive.name, "digest": 'sha256:different'}]})
            self.assertEqual(status, 1)
            self.assertFalse(any(r[0] == 'release' for r in requests))
            status, requests = run({"error": 403})
            self.assertEqual(status, 1)
            self.assertFalse(any(r[0] == 'release' for r in requests))
            status, requests = run({"error": 404})
            self.assertEqual(status, 0)
            self.assertTrue(any(r[:2] == ['release', 'create'] and '--verify-tag' in r for r in requests))


if __name__ == "__main__":
    unittest.main()
