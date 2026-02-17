#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const registryPath = path.join(repoRoot, 'docs/agents/memory-registry.yaml');
const errors = [];

function fail(message) {
  errors.push(message);
}

function parseYamlList(content) {
  const entries = [];
  let current = null;
  const lines = content.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (trimmed.length === 0 || trimmed.startsWith('#')) {
      continue;
    }

    if (line.startsWith('- ')) {
      if (current !== null) {
        entries.push(current);
      }
      current = {};
      parseKeyValue(line.slice(2), current, index + 1);
      continue;
    }

    if (line.startsWith('  ')) {
      if (current === null) {
        throw new Error(`Invalid YAML structure at line ${index + 1}: key/value before first list item`);
      }
      parseKeyValue(trimmed, current, index + 1);
      continue;
    }

    throw new Error(`Invalid YAML structure at line ${index + 1}: "${rawLine}"`);
  }

  if (current !== null) {
    entries.push(current);
  }

  return entries;
}

function parseKeyValue(fragment, target, lineNumber) {
  const colonIndex = fragment.indexOf(':');
  if (colonIndex <= 0) {
    throw new Error(`Invalid key/value pair at line ${lineNumber}: "${fragment}"`);
  }

  const key = fragment.slice(0, colonIndex).trim();
  const rawValue = fragment.slice(colonIndex + 1).trim();
  target[key] = parseValue(rawValue);
}

function parseValue(rawValue) {
  if (
    (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
    (rawValue.startsWith("'") && rawValue.endsWith("'"))
  ) {
    return rawValue.slice(1, -1);
  }

  if (/^\d+$/.test(rawValue)) {
    return Number.parseInt(rawValue, 10);
  }

  return rawValue;
}

if (!existsSync(registryPath)) {
  fail('Missing memory registry: docs/agents/memory-registry.yaml');
} else {
  const content = readFileSync(registryPath, 'utf8');
  let entries = [];

  try {
    entries = parseYamlList(content);
  } catch (error) {
    fail(error.message);
  }

  if (entries.length === 0) {
    fail('Memory registry must include at least one entry.');
  }

  const requiredFields = ['id', 'statement', 'source_path', 'verified_at', 'owner', 'expiry_days'];
  const seenIds = new Set();
  const now = new Date();

  for (const entry of entries) {
    for (const field of requiredFields) {
      if (!(field in entry)) {
        fail(`Memory entry is missing required field "${field}": ${JSON.stringify(entry)}`);
      }
    }

    if (typeof entry.id !== 'string' || entry.id.trim() === '') {
      fail(`Memory entry has invalid id: ${JSON.stringify(entry)}`);
    } else if (seenIds.has(entry.id)) {
      fail(`Duplicate memory id detected: ${entry.id}`);
    } else {
      seenIds.add(entry.id);
    }

    if (typeof entry.source_path !== 'string' || entry.source_path.trim() === '') {
      fail(`Memory entry "${entry.id}" has invalid source_path`);
    } else if (!existsSync(path.join(repoRoot, entry.source_path))) {
      fail(`Memory entry "${entry.id}" references missing source_path: ${entry.source_path}`);
    }

    if (typeof entry.expiry_days !== 'number' || entry.expiry_days <= 0) {
      fail(`Memory entry "${entry.id}" must use a positive integer expiry_days`);
    }

    if (typeof entry.verified_at !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.verified_at)) {
      fail(`Memory entry "${entry.id}" must use verified_at in YYYY-MM-DD format`);
      continue;
    }

    const verifiedDate = new Date(`${entry.verified_at}T00:00:00Z`);
    if (Number.isNaN(verifiedDate.getTime())) {
      fail(`Memory entry "${entry.id}" has invalid verified_at date: ${entry.verified_at}`);
      continue;
    }

    if (verifiedDate.getTime() > now.getTime()) {
      fail(`Memory entry "${entry.id}" has verified_at in the future: ${entry.verified_at}`);
      continue;
    }

    const expiryDate = new Date(verifiedDate.getTime() + entry.expiry_days * 24 * 60 * 60 * 1000);
    if (now.getTime() > expiryDate.getTime()) {
      fail(
        [
          `Memory entry "${entry.id}" is stale (verified_at=${entry.verified_at}, expiry_days=${entry.expiry_days}).`,
          'Refresh verified_at or archive/remove the entry if it is no longer active.',
        ].join(' '),
      );
    }
  }
}

if (errors.length > 0) {
  console.error('Memory registry checks failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Memory registry checks passed.');
