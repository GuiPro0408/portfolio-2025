#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const errors = [];

const requiredTemplates = [
  'docs/agents/templates/task-brief.md',
  'docs/agents/templates/plan-spec.md',
  'docs/agents/templates/implementation-report.md',
  'docs/agents/templates/review-report.md',
];

const requiredSections = [
  'Scope',
  'Assumptions',
  'Changed Paths',
  'Test Evidence',
  'Docs Impact',
  'Risk Notes',
];

const requiredWorkflowRoles = [
  'Conductor',
  'planning-subagent',
  'implement-subagent',
  'code-review-subagent',
];

function fail(message) {
  errors.push(message);
}

for (const templatePath of requiredTemplates) {
  const absolutePath = path.join(repoRoot, templatePath);
  if (!existsSync(absolutePath)) {
    fail(`Missing required agent template: ${templatePath}`);
    continue;
  }

  const content = readFileSync(absolutePath, 'utf8');
  for (const section of requiredSections) {
    const sectionRegex = new RegExp(`^##\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'm');
    if (!sectionRegex.test(content)) {
      fail(`${templatePath} must include section heading: "## ${section}"`);
    }
  }
}

const workflowPath = path.join(repoRoot, 'docs/agents/WORKFLOW.md');
if (!existsSync(workflowPath)) {
  fail('Missing required workflow contract: docs/agents/WORKFLOW.md');
} else {
  const workflowContent = readFileSync(workflowPath, 'utf8');
  for (const role of requiredWorkflowRoles) {
    if (!workflowContent.includes(role)) {
      fail(`docs/agents/WORKFLOW.md must define role: ${role}`);
    }
  }
}

if (errors.length > 0) {
  console.error('Agent contract checks failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Agent contract checks passed.');
