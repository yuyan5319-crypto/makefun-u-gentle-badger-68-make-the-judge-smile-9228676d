// Make the Judge Smile — make.fun bounty entry
// Writes a single line (<=200 chars) about a small good thing that
// happened today to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "The noodle-shop auntie slipped an extra egg into my bowl because " +
  "'you look thin today', and I ate it standing in the rain, grinning " +
  "like I'd won something.";

// The gate requires UTF-8 text of 1 to 200 characters, not only whitespace.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry line must be 1-200 characters, got ${LINE.length}`);
}
if (!LINE.trim()) {
  throw new Error("entry line must not be only whitespace");
}
if (!/^[\x20-\x7E\u00A0-\uFFFF]*$/.test(LINE)) {
  throw new Error("entry line contains unexpected control characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", { encoding: "utf8", mode: 0o644 });
chmodSync(outPath, 0o644); // world-readable regardless of the caller's umask

// Read back what we wrote and confirm it matches, byte for byte.
const written = readFileSync(outPath, "utf8");
if (written !== LINE + "\n") {
  throw new Error("read-back mismatch: entry.txt does not match the line");
}
console.log(`Wrote ${LINE.length} characters to ${outPath}`);
