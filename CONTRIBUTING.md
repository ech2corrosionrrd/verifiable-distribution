# Contributing


Thanks for your interest in improving this project. It is open source (MIT) and built for the Solana community, so issues, ideas and pull requests are welcome.

## Ways to contribute

- Report bugs or unexpected behavior.
- Suggest improvements or new use cases.
- Improve documentation and translations (English and Ukrainian).
- Fix bugs or add tests.
- Try the tools in a real pilot and share feedback.

For security problems, **do not open a public issue**. See [SECURITY.md](SECURITY.md).

## Before you start

- Check existing issues and pull requests to avoid duplicates.
- For larger changes, open an issue first to discuss the approach.
- Be respectful: see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Development setup

```bash
git clone https://github.com/ech2corrosionrrd/verifiable-distribution
cd verifiable-distribution
npm test
```

Requirements: Node.js 20 or newer. Use devnet for any on-chain experiments. Never use real mainnet keys while developing or testing.

## Pull request guidelines

1. Fork the repository and create a branch from `main` (e.g. `fix/short-description`).
2. Keep changes focused: one topic per pull request.
3. Add or update tests. Changes to snapshot, digest or verification logic **must** include a test, including a test that verification fails when any row is altered.
4. Run the test suite and linter before pushing.
5. Update documentation when behavior changes.
6. Write a clear description: what changed, why, and how you tested it.

## Commit messages

Use short, imperative messages (e.g. `Fix digest ordering for unicode wallet labels`). Reference issues where relevant (`Fixes #12`).

## Rules for sensitive data

- Never commit private keys, seed phrases, `.env` files, RPC API keys or personal data.
- Use public addresses and example data only.
- Determinism matters: do not add timestamps, random values or locale-dependent ordering to hashed content.

## Licensing

By contributing, you agree that your contributions are licensed under the project's [MIT License](LICENSE).

## Questions

Open a discussion or an issue, or write to w3ir@pm.me.
