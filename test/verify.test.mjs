import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { snapshotDigest, parseCsv, canonicalize, COLS } from "../src/canon.mjs";

const dir = fileURLToPath(new URL("../examples/season1/", import.meta.url));
const bin = fileURLToPath(new URL("../bin/verify-digest.mjs", import.meta.url));
const csv = readFileSync(dir + "season-1.csv", "utf8");
const meta = JSON.parse(readFileSync(dir + "season-1-meta.json", "utf8"));
const PUBLISHED = meta.digest; // Season 1 digest as announced on 2026-09-18

const col = (name) => COLS.indexOf(name);

/** Replace one cell of the first data row. */
function editCell(text, name, value) {
  const lines = text.split("\n");
  const cells = lines[1].split(",");
  cells[col(name)] = value;
  lines[1] = cells.join(",");
  return lines.join("\n");
}

test("Season 1 snapshot reproduces the published digest", () => {
  assert.equal(snapshotDigest(csv, meta), PUBLISHED);
  assert.equal(parseCsv(csv).length, 99);
});

test("changing any covered field changes the digest", () => {
  for (const name of ["rank", "passport_no", "profile_id", "wallet_solana", "points"]) {
    const original = csv.split("\n")[1].split(",")[col(name)];
    const changed = editCell(csv, name, original === "1" ? "2" : "1");
    assert.notEqual(snapshotDigest(changed, meta), PUBLISHED, `${name} must be covered`);
  }
});

test("changing a wallet address changes the digest", () => {
  const changed = editCell(csv, "wallet_solana", "11111111111111111111111111111111");
  assert.notEqual(snapshotDigest(changed, meta), PUBLISHED);
});

test("removing a row changes the digest", () => {
  const lines = csv.split("\n");
  lines.splice(5, 1);
  assert.notEqual(snapshotDigest(lines.join("\n"), meta), PUBLISHED);
});

test("adding a row changes the digest", () => {
  const lines = csv.trimEnd().split("\n");
  const extra = lines[1].split(",");
  extra[col("rank")] = "1000";
  extra[col("profile_id")] = "00000000-0000-0000-0000-000000000000";
  const changed = [...lines, extra.join(",")].join("\n") + "\n";
  assert.notEqual(snapshotDigest(changed, meta), PUBLISHED);
});

test("changing a weight or the point total changes the digest", () => {
  const w = structuredClone(meta);
  w.weights.xp += 1;
  assert.notEqual(snapshotDigest(csv, w), PUBLISHED);
  const t = structuredClone(meta);
  t.totalPoints += 1;
  assert.notEqual(snapshotDigest(csv, t), PUBLISHED);
});

test("row order in the file does not matter, rank does", () => {
  const [header, ...rows] = csv.trimEnd().split("\n");
  const shuffled = [header, ...rows.reverse()].join("\n") + "\n";
  assert.equal(snapshotDigest(shuffled, meta), PUBLISHED);
});

test("line endings (CRLF) do not matter", () => {
  assert.equal(snapshotDigest(csv.replace(/\n/g, "\r\n"), meta), PUBLISHED);
});

test("documented limitation: reference columns are NOT covered", () => {
  // xp, xp_luck, ... are informational and intentionally outside the digest.
  // This test pins that behaviour so docs and code cannot drift apart.
  const changed = editCell(csv, "xp", "999999");
  assert.equal(snapshotDigest(changed, meta), PUBLISHED);
});

test("canonical text starts with the version and ends with a newline", () => {
  const canon = canonicalize(meta, parseCsv(csv));
  assert.ok(canon.startsWith("gremlin-airdrop-v5\n"));
  assert.ok(canon.endsWith("\n"));
});

test("bad input is rejected", () => {
  assert.throws(() => parseCsv(""), /empty/);
  assert.throws(() => parseCsv("a,b\n1,2"), /header/);
  assert.throws(() => canonicalize({ label: "x" }, []), /totalPoints/);
});

test("CLI: exit 0 on match, 1 on mismatch, 2 on bad input", () => {
  const run = (...args) => spawnSync(process.execPath, [bin, ...args], { encoding: "utf8" });
  const base = ["--csv", dir + "season-1.csv", "--meta", dir + "season-1-meta.json"];
  assert.equal(run(...base, "--expect", PUBLISHED).status, 0);
  assert.equal(run(...base, "--expect", "sha256:" + "0".repeat(64)).status, 1);
  assert.equal(run("--csv", "nope.csv", "--meta", "nope.json").status, 2);
  assert.equal(run().status, 2);
});
