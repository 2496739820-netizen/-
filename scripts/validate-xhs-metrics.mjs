import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const snapshotUrl = new URL("../app/components/hupai-portfolio/xhs-metrics.json", import.meta.url);
const snapshot = JSON.parse(await readFile(snapshotUrl, "utf8"));

const hupaiIds = [
  "66ab4132000000002701f16e",
  "69a16f6f0000000015038c2e",
  "6a4a0ea7000000001702df31",
];
const personalIds = ["montage", "angle", "narrative-montage", "composition", "color", "sound"];

function positiveInteger(value, path) {
  assert.ok(Number.isSafeInteger(value) && value > 0, `${path} must be a positive integer`);
}

function nonNegativeInteger(value, path) {
  assert.ok(Number.isSafeInteger(value) && value >= 0, `${path} must be a non-negative integer`);
}

assert.equal(snapshot.schemaVersion, 1);
assert.match(snapshot.snapshotDate, /^\d{4}-\d{2}-\d{2}$/);
assert.ok(!Number.isNaN(Date.parse(snapshot.updatedAt)), "updatedAt must be an ISO timestamp");
assert.equal(snapshot.updatedAt.slice(0, 10), snapshot.snapshotDate);

positiveInteger(snapshot.hupai.followers, "hupai.followers");
assert.match(snapshot.hupai.likesAndSaves, /^\d+(?:\.\d+)?\s*万$/);
assert.deepEqual(Object.keys(snapshot.hupai.works).sort(), [...hupaiIds].sort());
for (const id of hupaiIds) {
  const metrics = snapshot.hupai.works[id];
  for (const field of ["likes", "saves", "comments", "shares"]) {
    positiveInteger(metrics[field], `hupai.works.${id}.${field}`);
  }
}

positiveInteger(snapshot.personal.followers, "personal.followers");
positiveInteger(snapshot.personal.publishedNotes, "personal.publishedNotes");
assert.match(snapshot.personal.likesAndSaves, /^\d+(?:\.\d+)?\s*万$/);
assert.deepEqual(Object.keys(snapshot.personal.works).sort(), [...personalIds].sort());
for (const id of personalIds) {
  const metrics = snapshot.personal.works[id];
  positiveInteger(metrics.views, `personal.works.${id}.views`);
  positiveInteger(metrics.likes, `personal.works.${id}.likes`);
  positiveInteger(metrics.saves, `personal.works.${id}.saves`);
  positiveInteger(metrics.shares, `personal.works.${id}.shares`);
  nonNegativeInteger(metrics.comments, `personal.works.${id}.comments`);
}

console.log(`Xiaohongshu snapshot valid: ${snapshot.snapshotDate}`);
