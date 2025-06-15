#!/usr/bin/env tsx

import { populateFacultyFromCSV } from "../src/lib/populate-faculty";

async function main() {
  try {
    await populateFacultyFromCSV();
    console.log("✅ Faculty data populated successfully");
  } catch (error) {
    console.error("❌ Failed to populate faculty data:", error);
    process.exit(1);
  }
}

void main(); 