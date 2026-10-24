import { createHash } from "node:crypto";

/** Canon version string, the first line of the canonical text. */
export const CANON_VERSION = "gremlin-airdrop-v5";

/** CSV columns, in order. The header must match exactly. */
export const COLS = [
  "rank",
  "passport_no",
  "profile_id",
  "allocation",
  "points",
  "wallet_status",
  "wallet_solana",
  "xp",
  "xp_luck",
  "xp_achievement",
  "achievements",
  "genesis",
  "quests_done",
  "member_days",
];

/** Weight keys, serialized in this (alphabetical) order. */
export const WEIGHT_KEYS = [
  "achievements",
  "days",
  "genesis",
  "quests",
  "xp",
  "xpAchievement",
  "xpLuck",
];

/**
 * Parse a snapshot CSV. Fields must not contain commas or quotes
 * (true for the Season 1 format).
 */
export function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) throw new Error("CSV is empty");
  if (lines[0] !== COLS.join(",")) {
    throw new Error(`unexpected CSV header:\n  ${lines[0]}`);
  }
  return lines.slice(1).map((line, i) => {
    const cells = line.split(",");
    if (cells.length !== COLS.length) {
      throw new Error(`row ${i + 2}: ${cells.length} columns instead of ${COLS.length}`);
    }
    const at = (col) => cells[COLS.indexOf(col)];
    const rank = Number(at("rank"));
    if (!Number.isInteger(rank)) throw new Error(`row ${i + 2}: rank is not an integer`);
    return {
      rank,
      profile_id: at("profile_id"),
      passport_no: at("passport_no"),
      wallet_solana: at("wallet_solana"),
      points: at("points"),
      allocation: at("allocation"),
    };
  });
}

/** Build the canonical text from the snapshot header and parsed rows. */
export function canonicalize(meta, rows) {
  for (const key of ["label", "totalPoints", "weights"]) {
    if (meta[key] === undefined) throw new Error(`meta is missing "${key}"`);
  }
  for (const key of WEIGHT_KEYS) {
    if (meta.weights[key] === undefined) throw new Error(`meta.weights is missing "${key}"`);
  }
  // Fixed key order, otherwise the JSON would differ character by character.
  const weights = JSON.stringify(
    Object.fromEntries(WEIGHT_KEYS.map((k) => [k, meta.weights[k]])),
  );
  const sorted = [...rows].sort((a, b) => a.rank - b.rank);
  return (
    [
      CANON_VERSION,
      `label\t${meta.label}`,
      `total_pool\t${meta.totalPool ?? ""}`,
      `total_points\t${meta.totalPoints}`,
      `weights\t${weights}`,
      `count\t${sorted.length}`,
      "--",
      ...sorted.map((r) =>
        [r.rank, r.profile_id, r.passport_no, r.wallet_solana, r.points, r.allocation].join("\t"),
      ),
    ].join("\n") + "\n"
  );
}

/** `sha256:<hex>` of the canonical text. */
export function digestCanonical(canonical) {
  return "sha256:" + createHash("sha256").update(canonical, "utf8").digest("hex");
}

/** Digest of a snapshot given as CSV text and a meta object. */
export function snapshotDigest(csvText, meta) {
  return digestCanonical(canonicalize(meta, parseCsv(csvText)));
}
