"""Check the actual tag workflow, without dispatching or publishing it."""
from pathlib import Path
import re
import unittest


def check_release_order(source):
    # This workflow has one job with six-space step entries. Check full step
    # bodies, including multiline commands and setup inputs, in their real order.
    if len(re.findall(r"(?m)^    steps:\s*$", source)) != 1:
        raise AssertionError("Release job layout changed; update the check")
    steps = re.split(r"(?m)^      - ", source)[1:]
    if not steps:
        raise AssertionError("Release workflow layout changed; update the check")
    checked_out = False
    node_ready = False
    for step in steps:
        if "actions/checkout@" in step:
            checked_out = True
        if re.search(r"scripts/|package\.json|package-lock\.json|cache: npm", step):
            if not checked_out:
                raise AssertionError("Repository files are used before checkout")
        if "actions/setup-node@" in step:
            node_ready = True
        if re.search(r"(?:run:|\n\s+)\s*(?:node|npm|npx)\s", step):
            if not node_ready:
                raise AssertionError("Node commands are used before Node setup")
    if not checked_out or not node_ready:
        raise AssertionError("Required release setup is missing")


class ReleaseLayoutTests(unittest.TestCase):
    def setUp(self):
        self.source = (Path(__file__).resolve().parent.parent /
                       ".github/workflows/release.yml").read_text()

    def test_actual_tag_workflow_checks_out_before_repository_commands(self):
        check_release_order(self.source)

    def test_original_before_checkout_regression_is_rejected(self):
        # Derive blocks from the real file so action-version or display-name
        # updates do not invalidate the regression fixture.
        starts = [match.start() for match in re.finditer(r"(?m)^      - ", self.source)]
        blocks = [self.source[start:end] for start, end in
                  zip(starts, starts[1:] + [len(self.source)])]
        checkout = next(block for block in blocks if "actions/checkout@" in block)
        recovery = next(block for block in blocks
                        if "python3 scripts/test_release_assets.py" in block)
        regressed = self.source.replace(recovery, "", 1)
        regressed = regressed.replace(checkout, recovery + checkout, 1)
        with self.assertRaisesRegex(AssertionError, "before checkout"):
            check_release_order(regressed)

    def test_node_setup_regression_is_rejected(self):
        regressed = self.source.replace("actions/setup-node@", "missing-node-setup@")
        with self.assertRaisesRegex(AssertionError, "before Node setup"):
            check_release_order(regressed)


if __name__ == "__main__":
    unittest.main()
