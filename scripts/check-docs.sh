#!/usr/bin/env bash

set -euo pipefail

required_files=(
  "docs/README.md"
  "docs/ARCHITECTURE.md"
  "docs/QUALITY.md"
  "docs/DEPLOY.md"
  "docs/MVP.md"
  "docs/V1.1-BACKLOG.md"
  "docs/HARNESS.md"
  "docs/SYSTEM-OF-RECORD.md"
  "README.md"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required documentation file: $file"
    exit 1
  fi
done

if ! grep -q "docs/HARNESS.md" README.md; then
  echo "README.md must reference docs/HARNESS.md"
  exit 1
fi

if ! grep -q "docs/SYSTEM-OF-RECORD.md" README.md; then
  echo "README.md must reference docs/SYSTEM-OF-RECORD.md"
  exit 1
fi

if ! grep -q "HARNESS.md" docs/README.md; then
  echo "docs/README.md must reference HARNESS.md"
  exit 1
fi

if ! grep -q "SYSTEM-OF-RECORD.md" docs/README.md; then
  echo "docs/README.md must reference SYSTEM-OF-RECORD.md"
  exit 1
fi

if ! grep -q "HARNESS.md" docs/QUALITY.md; then
  echo "docs/QUALITY.md must reference HARNESS.md"
  exit 1
fi

echo "Docs checks passed."
