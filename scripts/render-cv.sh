#!/usr/bin/env bash
# Render CV YAML to public/resume.pdf for the static site (RenderCV CLI).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if ! python3 -c "import rendercv" 2>/dev/null; then
  echo "rendercv not found; installing from requirements-cv.txt" >&2
  python3 -m pip install -r "$ROOT/requirements-cv.txt"
fi
python3 -m rendercv render "$ROOT/cv/david_marr_rendercv.yaml" \
  -o "$ROOT/.rendercv-output" \
  -pdf ../public/resume.pdf \
  -nomd -nohtml -nopng \
  -q
