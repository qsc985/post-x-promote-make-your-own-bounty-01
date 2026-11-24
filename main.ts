// Entry program for the make.fun bounty
// post-x-promote-make-your-own-bounty-01.
//
// It takes POST.json from the bot directory, makes sure it is a well-formed
// JSON object carrying a non-empty `url` string, and copies it byte for byte
// into the output directory. Nothing is printed when everything checks out;
// any problem is reported on stderr and the process exits non-zero.
//
// Only the Node standard library is used. No network access, no clock, and
// no files outside the repository are touched.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const FILE_NAME = "POST.json";

function fail(message) {
  process.stderr.write(`error: ${message}\n`);
  process.exit(1);
}

function main() {
  const sourcePath = join(BOT_DIR, FILE_NAME);
  const targetPath = join(OUTPUT_DIR, FILE_NAME);

  let raw;
  try {
    raw = readFileSync(sourcePath);
  } catch (err) {
    fail(`cannot read ${sourcePath}: ${err.message}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw.toString("utf8"));
  } catch (err) {
    fail(`POST.json is not valid JSON: ${err.message}`);
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    fail("POST.json must be a JSON object");
  }

  if (typeof parsed.url !== "string" || parsed.url.trim() === "") {
    fail('POST.json must contain a non-empty string field "url"');
  }

  try {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  } catch (err) {
    fail(`cannot create output directory ${OUTPUT_DIR}: ${err.message}`);
  }

  try {
    copyFileSync(sourcePath, targetPath);
  } catch (err) {
    fail(`cannot copy POST.json to ${targetPath}: ${err.message}`);
  }
}

main();
