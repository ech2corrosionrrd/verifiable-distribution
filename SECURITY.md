# Security Policy


## Supported versions

This project is in **alpha**. Only the latest release on the default branch receives security fixes.

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Report privately by either:
- email: **w3ir@pm.me** (subject: `SECURITY: <short description>`), or
- GitHub's private vulnerability reporting ("Security" tab → "Report a vulnerability"), if enabled for this repository.

Please include:
- affected version or commit;
- a description of the issue and its impact;
- steps to reproduce or a proof of concept;
- any suggested fix.

## What to expect

- We aim to acknowledge your report within **5 business days**.
- We aim to share an initial assessment within **14 days**.
- We will keep you informed about progress and credit you in the fix notes if you wish.
- Please give us reasonable time to fix the issue before public disclosure. We suggest **90 days**, shorter if a fix is released earlier.

## Scope

In scope: code in this repository, including snapshot generation, digest and Merkle logic, the verifier, and any on-chain claim code.

Out of scope: third-party services, social engineering, denial-of-service testing against our hosted sites, and issues in dependencies that are already publicly reported upstream.

## Safe harbor

We will not take legal action against researchers who act in good faith, avoid privacy violations and data destruction, and follow this policy.

## Our security principles

- No private keys, seed phrases or custody. Signing happens client-side.
- Snapshots must be reproducible from published inputs.
- An independent security review of this repository is planned (grant milestone M4); its report will be published.

## No bug bounty

We do not currently run a paid bug bounty program.
