#!/usr/bin/env python3
"""
Post-process RenderCV markdown for the web résumé.

RenderCV emits one # for the document title and for each section (Summary,
Experience, …), and ## for each employer/education entry. For a sane outline we
want:

  ## — section labels (Summary, Experience, Education, Skills)
  ### — each role or school line (**Company**, title)

The document title and contact list are omitted here; the web sidebar renders
those from resumeProfile frontmatter.

Reads stdin, writes stdout.
"""
from __future__ import annotations

import re
import sys

ROLE_SKILLS_LINE = re.compile(r"^Skills used: (.+)$")
TYPST_VSPACE_LINE = re.compile(r"^#v\(.+\)$")
CONTACT_LINE = re.compile(r"^- (Email|Location|Website|GitHub|LinkedIn|X|Phone): ")
DOC_TITLE = re.compile(r"^# .+'s CV$")


def role_skills_html(skills_csv: str) -> str:
    tags = "".join(
        f'<span class="resume-role-skills__tag">{part.strip()}</span>'
        for part in skills_csv.split(",")
        if part.strip()
    )
    return f'<p class="resume-role-skills">{tags}</p>'


def harmonize(md: str) -> str:
    lines = md.splitlines()
    out: list[str] = []
    skip_header = True
    for line in lines:
        if skip_header:
            if line == "# Summary":
                skip_header = False
                out.append("## Summary")
                continue
            if not line.strip() or DOC_TITLE.match(line) or CONTACT_LINE.match(line):
                continue
            if line.startswith("# "):
                continue
            skip_header = False

        if line == "# Summary":
            out.append("## Summary")
        elif line == "# Experience":
            out.append("## Experience")
        elif line == "# Education":
            out.append("## Education")
        elif line == "# Skills":
            out.append("## Skills")
        elif line.startswith("## **"):
            out.append("#" + line)
        else:
            skills_match = ROLE_SKILLS_LINE.match(line)
            if skills_match and skills_match.group(1).strip():
                out.append(role_skills_html(skills_match.group(1)))
            elif line in ("Skills", "Skills used:") or TYPST_VSPACE_LINE.match(line):
                continue
            else:
                out.append(line)
    trailing = md.endswith("\n")
    text = "\n".join(out)
    # RenderCV moderncv emits " -- " between title/company and location; on the web it
    # reads like a broken em dash. Use a middle dot instead.
    text = text.replace(" -- ", " · ")
    # De-emphasize city/region on role and education headings (web CSS only).
    text = re.sub(
        r"^(### .+?) · (.+)$",
        r'\1 · <span class="resume-exp-location">\2</span>',
        text,
        flags=re.MULTILINE,
    )
    return text + ("\n" if trailing else "")


def main() -> None:
    data = sys.stdin.read()
    sys.stdout.write(harmonize(data))


if __name__ == "__main__":
    main()
