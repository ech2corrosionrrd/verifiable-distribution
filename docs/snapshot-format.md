# Snapshot format: `gremlin-airdrop-v5`

This document specifies how the digest is computed, so that anyone can reimplement a verifier without using this code.

## Inputs

1. **CSV** with this exact header (comma-separated, no quoting; fields must not contain commas):

   ```
   rank,passport_no,profile_id,allocation,points,wallet_status,wallet_solana,xp,xp_luck,xp_achievement,achievements,genesis,quests_done,member_days
   ```

2. **Meta JSON** with:
   - `label` (string)
   - `totalPool` (number or `null`)
   - `totalPoints` (number)
   - `weights`: `achievements`, `days`, `genesis`, `quests`, `xp`, `xpAchievement`, `xpLuck`

   Other meta fields (for example `digest`, `digestVersion`) are ignored.

## Canonical text

Lines are joined with `\n` and the text ends with a final `\n`. Encoding is UTF-8.

```
gremlin-airdrop-v5
label<TAB><label>
total_pool<TAB><totalPool, or empty string if null>
total_points<TAB><totalPoints>
weights<TAB><JSON of the weights, keys in alphabetical order, no spaces>
count<TAB><number of rows>
--
<rank><TAB><profile_id><TAB><passport_no><TAB><wallet_solana><TAB><points><TAB><allocation>
...
```

Rows are sorted by `rank` ascending (numeric). File order does not matter. `allocation` is an empty string when there is no allocation.

## Digest

```
sha256:<hex of SHA-256 over the canonical text, UTF-8>
```

## What the digest covers, and what it does not

Covered: `rank`, `passport_no`, `profile_id`, `wallet_solana`, `points`, `allocation`, and the header (`label`, `totalPool`, `totalPoints`, `weights`, row count).

**Not covered:** `wallet_status`, `xp`, `xp_luck`, `xp_achievement`, `achievements`, `genesis`, `quests_done`, `member_days`. They are informational: they show where the points came from but are not hashed. A test pins this behavior (`test/verify.test.mjs`).

The digest proves the published file is unchanged since the digest was announced. It does **not** prove the inputs were honest or that the scoring rules were fair. Announce the digest in a channel the operator cannot silently edit, and do not trust a digest shown only on the same server as the file.

## Versioning

The first line of the canonical text is the version. A future format gets a new version string; verifiers for old versions stay available so old digests remain verifiable.
