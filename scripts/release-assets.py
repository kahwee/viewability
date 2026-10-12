"""Resume uploads without replacing a published asset. Uses existing gh auth."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile


def gh(*args, missing_ok=False):
    result = subprocess.run(["gh", *args], capture_output=True, text=True)
    if result.returncode:
        if missing_ok and "HTTP 404" in result.stderr:
            return None
        raise RuntimeError("GitHub request failed; no release assets were replaced")
    return result.stdout


def digest(path):
    return "sha256:" + hashlib.sha256(path.read_bytes()).hexdigest()


def upload_plan(files, existing):
    missing = []
    for path in files:
        if path.name not in existing:
            missing.append(path)
        elif existing[path.name] != digest(path):
            raise RuntimeError(f"Published asset differs: {path.name}; refusing replacement")
    return missing


def main():
    tag, folder = sys.argv[1:3]
    notes = sys.argv[3:] or ["--generate-notes"]
    repo = os.environ["GITHUB_REPOSITORY"]
    files = sorted(Path(folder).iterdir())
    if not files or not all(path.is_file() for path in files):
        raise RuntimeError("Expected a nonempty directory containing release files only")
    source = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
    target = subprocess.check_output(["git", "rev-parse", f"{tag}^{{commit}}"], text=True).strip()
    if target != source:
        raise RuntimeError("Release tag must point at the checked-out commit")
    response = gh("api", f"repos/{repo}/releases/tags/{tag}", missing_ok=True)
    if response is None:
        gh("release", "create", tag, *map(str, files), "--verify-tag", *notes)
        return
    release = json.loads(response)
    existing = {}
    with tempfile.TemporaryDirectory(prefix="release-assets-") as temp:
        for asset in release["assets"]:
            if asset["name"] not in {path.name for path in files}:
                continue
            if (asset.get("digest") or "").startswith("sha256:"):
                existing[asset["name"]] = asset["digest"]
            else:
                # Older uploads may lack server digests. Compare actual bytes.
                gh("release", "download", tag, "--pattern", asset["name"], "--dir", temp)
                existing[asset["name"]] = digest(Path(temp) / asset["name"])
        missing = upload_plan(files, existing)
        # Validate every existing file before uploading any missing files.
        for path in missing:
            gh("release", "upload", tag, str(path))
    print(f"Release assets verified: {len(files) - len(missing)} existing, {len(missing)} uploaded")


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, KeyError, ValueError, subprocess.CalledProcessError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
