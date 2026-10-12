import importlib.util
from pathlib import Path
import tempfile
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


if __name__ == "__main__":
    unittest.main()
