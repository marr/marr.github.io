#!/usr/bin/env python3
"""
Inject ephemeral skills_block fields from skills before RenderCV render.

RenderCV omits empty SKILLS placeholders awkwardly ("Skills" orphan text).
When skills is set, skills_block carries PDF spacing + label; otherwise omitted.
"""
from __future__ import annotations

import sys
from pathlib import Path

from ruamel.yaml import YAML


def format_skills_block(skills: str) -> str:
    cleaned = skills.strip()
    return f"#v(0.25cm)\nSkills used: {cleaned}"


def preprocess(data: dict) -> dict:
    experience = data.get("cv", {}).get("sections", {}).get("experience", [])
    if not isinstance(experience, list):
        return data

    for entry in experience:
        if not isinstance(entry, dict):
            continue
        entry.pop("skills_block", None)
        skills = entry.get("skills")
        if isinstance(skills, str) and skills.strip():
            entry["skills_block"] = format_skills_block(skills)
    return data


def main() -> None:
    if len(sys.argv) != 3:
        print("usage: preprocess_cv_yaml.py INPUT.yaml OUTPUT.yaml", file=sys.stderr)
        sys.exit(2)

    yaml = YAML()
    yaml.preserve_quotes = True
    source = Path(sys.argv[1])
    dest = Path(sys.argv[2])
    data = yaml.load(source.read_text())
    yaml.dump(preprocess(data), dest)


if __name__ == "__main__":
    main()
