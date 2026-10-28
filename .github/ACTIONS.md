# GitHub Actions

## Verification

[`ci.yml`](workflows/ci.yml) runs on `master` pushes and pull requests. The quality
job uses Node.js 24 and frozen `npm ci`. Style, types, coverage, and production
audit run in parallel; builds, package checks, consumer tests, and packing follow.

The checked build is shared with Node.js 24/26 consumer jobs and independent
Chromium, Firefox, and WebKit jobs. Preserve artifact names, `needs`, browser
system dependencies, and failure-report uploads. Do not race writes to `dist`.
Verification has read-only contents access and cancels superseded runs.

## Stable immutable pins

| Action | Release | Commit |
| --- | --- | --- |
| [actions/checkout](https://github.com/actions/checkout/releases/tag/v7.0.1) | v7.0.1 | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| [actions/setup-node](https://github.com/actions/setup-node/releases/tag/v7.1.0) | v7.1.0 | `949feb2413d6458794dcd2491c4babbbce0c15c1` |
| [actions/upload-artifact](https://github.com/actions/upload-artifact/releases/tag/v7.0.2) | v7.0.2 | `cf430e030ddbb5b0abf93d22962f4752f3646cd9` |
| [actions/download-artifact](https://github.com/actions/download-artifact/releases/tag/v8.0.2) | v8.0.2 | `9000827ccba6bdab643e8b6fd33ac0654aef8333` |
| [actions/cache](https://github.com/actions/cache/releases/tag/v6.1.0) | v6.1.0 | `55cc8345863c7cc4c66a329aec7e433d2d1c52a9` |

[Dependabot](dependabot.yml) checks Actions weekly. Verify release commits and
runner requirements, retain version comments and permissions, and read back
checks for the exact pushed SHA. No action version upgrade was needed in this
refresh; existing latest-version tags became immutable pins.

## Release boundary

[`release.yml`](workflows/release.yml) runs on `v*` tags, validates the version,
repeats source/package/browser gates, and creates immutable GitHub release
artifacts. Its existing contents-write permission and recovery guards are
unchanged. This workflow does not publish to npm.

The [npm proposal](release-proposals/publish.yml) is inactive. Activation,
registry trust, and actual publication need separate approval; see
[publishing](../docs/actions-publishing.md). Dry runs cannot verify authentication.
