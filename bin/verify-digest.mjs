#!/usr/bin/env node
/**
 * Independently verify a snapshot digest from a published CSV.
 *
 * Usage:
 *   node bin/verify-digest.mjs --csv snapshot.csv --meta meta.json
 *   node bin/verify-digest.mjs --csv snapshot.csv --meta meta.json --expect sha256:abc...
 *
 * Exit codes: 0 ok (or no --expect), 1 digest mismatch, 2 bad input.
 * See docs/snapshot-format.md for the format and for what the digest covers.
 */
import { readFileSync } from "node:fs";
import { snapshotDigest, parseCsv } from "../src/canon.mjs";

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? null : process.argv[i + 1];
}

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(2);
}

const csvPath = arg("csv");
const metaPath = arg("meta");
const expected = arg("expect");
if (!csvPath || !metaPath) {
  fail("both --csv <file> and --meta <file> are required. See the header of this file.");
}

let digest;
let count;
try {
  const csv = readFileSync(csvPath, "utf8");
  const meta = JSON.parse(readFileSync(metaPath, "utf8"));
  count = parseCsv(csv).length;
  digest = snapshotDigest(csv, meta);
} catch (err) {
  fail(err.message);
}

console.log(`rows:   ${count}`);
console.log(`digest: ${digest}`);

if (expected) {
  if (digest === expected) {
    console.log("OK: digest matches the published digest");
  } else {
    console.error(`MISMATCH\n  expected: ${expected}\n  computed: ${digest}`);
    process.exit(1);
  }
}
