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

  let parsedUrl;
  try {
    parsedUrl = new URL(parsed.url.trim());
  } catch {
    fail(`"url" is not a valid URL: ${parsed.url}`);
  }

  const host = parsedUrl.hostname.toLowerCase();
  if (parsedUrl.protocol !== "https:" || (host !== "x.com" && host !== "twitter.com")) {
    fail(`"url" must be an https://x.com (or twitter.com) link, got: ${parsed.url}`);
  }

  if (!/^\/[^/]+\/status\/\d+\/?$/.test(parsedUrl.pathname)) {
    fail(`"url" must be an X status link (https://x.com/<handle>/status/<id>), got: ${parsed.url}`);
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

  // Verify the copy is byte-identical by re-reading it and comparing
  // against the source bytes we already hold.
  let copied;
  try {
    copied = readFileSync(targetPath);
  } catch (err) {
    fail(`cannot re-read copied POST.json at ${targetPath}: ${err.message}`);
  }
  if (!raw.equals(copied)) {
    fail(`copied POST.json at ${targetPath} differs from ${sourcePath}`);
  }
}

main();
