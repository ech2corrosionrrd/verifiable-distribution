# verifiable-distribution

> Deterministic, publicly verifiable reward snapshots for Solana communities. MIT licensed. Non-custodial: no private keys are requested or stored.

[![CI](https://github.com/ech2corrosionrrd/verifiable-distribution/actions/workflows/ci.yml/badge.svg)](https://github.com/ech2corrosionrrd/verifiable-distribution/actions) [![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE) ![status](https://img.shields.io/badge/status-alpha-orange)

How do you prove to a community that a reward snapshot was not changed after it was announced? You publish the snapshot, announce a digest, and let anyone recompute it with a tiny, dependency-free verifier.

## Status

| Capability | Status |
|---|---|
| Deterministic canonical format (`gremlin-airdrop-v5`) | working |
| Public `sha256` digest | working |
| Standalone verifier CLI (no dependencies) | working |
| Tamper tests (any covered field, row added/removed, weights) | working |
| Snapshot builder from your own data | planned (M2) |
| Merkle tree generator | planned (M2) |
| On-chain Solana claim adapter (SPL / Core assets) | planned (M2) |
| Devnet end-to-end example | planned (M2) |

This is an early alpha extracted from a production pipeline (Gremlin Passport Season 1). It has not been independently audited.

## Quick start: verify the Season 1 snapshot yourself

Requires Node.js 20 or newer. No `npm install` needed.

```bash
git clone https://github.com/ech2corrosionrrd/verifiable-distribution
cd verifiable-distribution
node bin/verify-digest.mjs \
  --csv examples/season1/season-1.csv \
  --meta examples/season1/season-1-meta.json \
  --expect sha256:27fc2894f494f598bca5542462c9ba58932711c4538703311ecf8eb9b67670ec
```

Expected output:

```
rows:   99
digest: sha256:27fc2894f494f598bca5542462c9ba58932711c4538703311ecf8eb9b67670ec
OK: digest matches the published digest
```

Now try tampering: copy `season-1.csv`, change one `points` value or one wallet address, and run the command on the copy. It exits with code 1 and prints `MISMATCH`.

Run the tests with `npm test`.

## Don't trust the hash in this README

The README and the files live on the same server, so checking a file against a hash from the same place is circular. Take the digest from the original announcement (the Passport Season 1 announcement in the community's Discord/X) and compare.

## What the digest covers

Covered: `rank`, `passport_no`, `profile_id`, `wallet_solana`, `points`, `allocation`, the snapshot header (`label`, `totalPool`, `totalPoints`, `weights`) and the row count.

Not covered: the informational columns (`xp`, `xp_luck`, `xp_achievement`, `achievements`, `genesis`, `quests_done`, `member_days`, `wallet_status`).

The digest proves the file is unchanged since the digest was announced. It does not prove the inputs were honest. See [docs/snapshot-format.md](docs/snapshot-format.md) for the exact format.

## About the Season 1 example

Season 1 of Gremlin Passport was frozen on 2026-09-18 with 99 profiles. **No tokens were distributed.** There is no pool and no token; the `allocation` column is empty. The snapshot records the final standings, and any future distribution would be computed from this file. 67 of the 99 rows have no linked Solana wallet (`NO_WALLET`).

The example CSV contains profile IDs and public Solana addresses, as published by Gremlin Passport. Do not add personal data to snapshots you publish.

## Roadmap

- M2: generic snapshot builder, Merkle tree generator, on-chain claim adapter, devnet example, Passport Season 2 snapshot
- M3: pilots with external communities
- M4: independent security review
- M5: public dashboard, EN/UA docs, maintenance plan

## Contributing, security, license

See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Licensed under the [MIT License](LICENSE).

## About

Built by the w3ir team (Ukraine / Poland). Contact: w3ir@pm.me
