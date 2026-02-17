#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const errors = [];

const contractPath = path.join(repoRoot, 'docs/contracts/docs-contract.json');

function fail(message) {
  errors.push(message);
}

function readText(filePath) {
  return readFileSync(path.join(repoRoot, filePath), 'utf8');
}

function normalizeCommand(command) {
  return command.replace(/\$\(MAKE\)/g, 'make').replace(/\s+/g, ' ').trim();
}

function listMarkdownFiles(dirPath) {
  const absoluteDir = path.join(repoRoot, dirPath);
  if (!existsSync(absoluteDir)) {
    return [];
  }

  const entries = readdirSync(absoluteDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(relativePath));
      continue;
    }

    if (entry.isFile() && relativePath.endsWith('.md')) {
      files.push(relativePath);
    }
  }

  return files;
}

function extractHarnessSharedSequence(harnessContent) {
  const lines = harnessContent.split(/\r?\n/);
  const sequence = [];
  let inSection = false;

  for (const line of lines) {
    if (line.includes('`make check` and `make check-docker` both include:')) {
      inSection = true;
      continue;
    }

    if (!inSection) {
      continue;
    }

    if (line.startsWith('## ')) {
      break;
    }

    if (sequence.length > 0 && line.trim().length === 0) {
      break;
    }

    if (line.startsWith('`make docs-check` includes:')) {
      break;
    }

    const match = line.match(/^\d+\.\s+`([^`]+)`/);
    if (match) {
      sequence.push(match[1].trim());
    }
  }

  return sequence;
}

function extractMakeTargetCommands(makefileContent, targetName) {
  const lines = makefileContent.split(/\r?\n/);
  const commands = [];
  let inTarget = false;

  for (const line of lines) {
    if (!inTarget && line.startsWith(`${targetName}:`)) {
      inTarget = true;
      continue;
    }

    if (!inTarget) {
      continue;
    }

    if (/^[A-Za-z0-9_.-]+:/.test(line)) {
      break;
    }

    if (/^\s/.test(line)) {
      const trimmed = line.trim();
      if (trimmed.length > 0) {
        commands.push(trimmed);
      }
    }
  }

  return commands;
}

function commandLineMatchesExpected(line, expected) {
  const normalizedLine = normalizeCommand(line);
  const normalizedExpected = normalizeCommand(expected);

  if (normalizedExpected === 'make docs-check') {
    return (
      normalizedLine.startsWith('make docs-check') ||
      normalizedLine.includes('./scripts/check-docs.sh')
    );
  }

  return normalizedLine.includes(normalizedExpected);
}

function ensureDocsReadmeCoverage(indexContent, docPath) {
  const docsRelativePath = docPath.replace(/^docs\//, '');
  if (indexContent.includes(docsRelativePath) || indexContent.includes(docPath)) {
    return;
  }

  fail(`docs/README.md is missing a link to ${docPath}`);
}

if (!existsSync(contractPath)) {
  fail(`Missing docs contract: ${path.relative(repoRoot, contractPath)}`);
} else {
  const contract = JSON.parse(readText('docs/contracts/docs-contract.json'));

  for (const filePath of contract.requiredFiles) {
    if (!existsSync(path.join(repoRoot, filePath))) {
      fail(`Missing required documentation file: ${filePath}`);
    }
  }

  for (const linkRule of contract.requiredLinks) {
    if (!existsSync(path.join(repoRoot, linkRule.file))) {
      fail(`Cannot validate links in missing file: ${linkRule.file}`);
      continue;
    }

    const content = readText(linkRule.file);
    for (const requiredLink of linkRule.mustInclude) {
      if (!content.includes(requiredLink)) {
        fail(`${linkRule.file} must reference ${requiredLink}`);
      }
    }
  }

  if (existsSync(path.join(repoRoot, 'docs/README.md'))) {
    const docsIndex = readText('docs/README.md');
    for (const coreDoc of contract.docsReadmeCoverage.coreDocs) {
      ensureDocsReadmeCoverage(docsIndex, coreDoc);
    }

    const decisions = readdirSync(path.join(repoRoot, contract.docsReadmeCoverage.decisionsDir))
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => path.join(contract.docsReadmeCoverage.decisionsDir, fileName))
      .sort();

    for (const decisionDoc of decisions) {
      ensureDocsReadmeCoverage(docsIndex, decisionDoc);
    }

    const knowledgeDocs = readdirSync(path.join(repoRoot, contract.docsReadmeCoverage.knowledgeDir))
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => path.join(contract.docsReadmeCoverage.knowledgeDir, fileName))
      .sort();

    for (const knowledgeDoc of knowledgeDocs) {
      ensureDocsReadmeCoverage(docsIndex, knowledgeDoc);
    }
  }

  for (const mirrorFile of contract.mirrorDocs.files) {
    const absolutePath = path.join(repoRoot, mirrorFile);
    if (!existsSync(absolutePath)) {
      continue;
    }

    const lines = readText(mirrorFile).split(/\r?\n/);
    const scanRange = lines.slice(0, contract.mirrorDocs.maxScanLines).join('\n');

    if (!scanRange.includes(contract.mirrorDocs.bannerPhrase)) {
      fail(
        `${mirrorFile} must include "${contract.mirrorDocs.bannerPhrase}" within the first ${contract.mirrorDocs.maxScanLines} lines`,
      );
    }
  }

  const harnessContent = readText(contract.qualityGate.harnessPath);
  const harnessSequence = extractHarnessSharedSequence(harnessContent);
  const expectedSequence = contract.qualityGate.sharedSequence;

  if (harnessSequence.length === 0) {
    fail(`${contract.qualityGate.harnessPath} is missing the shared check sequence list`);
  } else if (JSON.stringify(harnessSequence) !== JSON.stringify(expectedSequence)) {
    fail(
      [
        'Shared command sequence drift between docs contract and harness.',
        `Expected: ${expectedSequence.join(' -> ')}`,
        `Actual: ${harnessSequence.join(' -> ')}`,
      ].join('\n'),
    );
  }

  const makefileContent = readText(contract.qualityGate.makefilePath);
  const checkCommands = extractMakeTargetCommands(makefileContent, 'check').map(normalizeCommand);
  const normalizedExpected = expectedSequence.map(normalizeCommand);

  if (JSON.stringify(checkCommands) !== JSON.stringify(normalizedExpected)) {
    fail(
      [
        'Makefile check target drift from shared command contract.',
        `Expected: ${normalizedExpected.join(' -> ')}`,
        `Actual: ${checkCommands.join(' -> ')}`,
      ].join('\n'),
    );
  }

  const checkDockerCommands = extractMakeTargetCommands(makefileContent, 'check-docker');
  let dockerCursor = 0;

  for (const expectedCommand of expectedSequence) {
    let found = false;

    for (; dockerCursor < checkDockerCommands.length; dockerCursor += 1) {
      if (commandLineMatchesExpected(checkDockerCommands[dockerCursor], expectedCommand)) {
        found = true;
        dockerCursor += 1;
        break;
      }
    }

    if (!found) {
      fail(`Makefile check-docker target is missing expected command in order: ${expectedCommand}`);
      break;
    }
  }

  const markdownDocs = listMarkdownFiles('docs');
  const ignoredFiles = new Set(contract.duplicateCommandGuard.ignoreFiles);
  const commandTokens = contract.duplicateCommandGuard.commandTokens;
  const minimumTokenMatches = contract.duplicateCommandGuard.minimumTokenMatches;

  for (const markdownDoc of markdownDocs) {
    if (markdownDoc.startsWith('docs/archive/')) {
      continue;
    }

    if (ignoredFiles.has(markdownDoc)) {
      continue;
    }

    const content = readText(markdownDoc);
    const tokenMatchCount = commandTokens.filter((token) => content.includes(token)).length;

    if (tokenMatchCount >= minimumTokenMatches) {
      fail(
        [
          `${markdownDoc} duplicates canonical harness command steps.`,
          'Move exact step lists to docs/HARNESS.md and keep this document link-first.',
        ].join('\n'),
      );
    }
  }
}

if (errors.length > 0) {
  console.error('Docs checks failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Docs checks passed.');
