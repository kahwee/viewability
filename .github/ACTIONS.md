# GitHub Actions maintenance

This guide describes the checked-in workflows. Follow each linked YAML file for branch filters, job dependencies, permissions, and release conditions.

## Workflows

| Workflow | Events | Jobs |
| --- | --- | --- |
| [ci.yml](workflows/ci.yml) | `push`, `pull_request` | `quality`, `node-compatibility`, `browser` |
| [release.yml](workflows/release.yml) | `push` | `release` |

## Parallel steps

Independent checks use GitHub Actions [native parallel steps](https://github.blog/changelog/2026-06-25-actions-steps-can-now-be-run-in-parallel/). The following groups run concurrently within a job:

- [ci.yml](workflows/ci.yml), job `quality`: `Check code style`; `Type check`; `Tests with coverage`; `Audit production dependencies`.
- [release.yml](workflows/release.yml), job `release`: `Check code style`; `Type check`; `Tests with coverage`; `Audit production dependencies`.

Steps after a group wait for it to finish. Keep prerequisites before the group and dependent build, package, or deployment work afterward. Do not run commands that overwrite the same build directory or coverage output together. Parallel steps share the job workspace; they do not provide separate machines.

## Action versions

Versions below match the current workflow and composite-action references. SHA-pinned actions remain pinned; compare their commit with the upstream stable release when updating.

| Action | Reference |
| --- | --- |
| [actions/cache](https://github.com/actions/cache) | `v6.1.0` |
| [actions/checkout](https://github.com/actions/checkout) | `v7.0.1` |
| [actions/download-artifact](https://github.com/actions/download-artifact) | `v8.0.1` |
| [actions/setup-node](https://github.com/actions/setup-node) | `v7.0.0` |
| [actions/upload-artifact](https://github.com/actions/upload-artifact) | `v7.0.1` |

## Greenkeeping

[Dependabot configuration](dependabot.yml) checks GitHub Actions weekly and groups their updates. Review the upstream release notes, runtime requirements, permissions, and changes to inputs or artifact behavior before merging. Update SHA pins to the release commit, retaining the version comment where present.

1. Update every reference to the affected action, including local composite actions under `.github/actions/`.
2. Keep frozen dependency installation and the repository’s declared toolchain versions aligned. Cache package downloads with a lockfile-based key; a cache hit does not replace installation or verification.
3. Check workflow YAML and review shell commands. Older workflow linters may not understand native `parallel`; GitHub execution must verify those groups.
4. Run the affected checks and inspect the resulting Actions run. Preserve matrix coverage, build dependencies, artifact paths, and release gates.
5. Refresh this guide when workflows, action references, or parallel groups change.

Use workflow concurrency to cancel superseded check runs where appropriate. Deployment and release cancellation have different consequences: preserve the workflow’s existing policy rather than copying check-run settings blindly. Repository permissions and job-level overrides are defined in the linked YAML files.
