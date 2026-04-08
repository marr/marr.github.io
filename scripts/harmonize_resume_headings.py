#!/usr/bin/env python3
"""
Post-process RenderCV markdown for the web résumé.

RenderCV emits one # for the document title and for each section (Summary,
Experience, …), and ## for each employer/education entry. For a sane outline we
want:

  #  — page title only (David Marr's CV)
  ## — section labels (Summary, Experience, Education, Skills)
  ### — each role or school line (**Company**, title)

Reads stdin, writes stdout.
"""
from __future__ import annotations

import sys


def harmonize(md: str) -> str:
    lines = md.splitlines()
    out: list[str] = []
    for line in lines:
        if line == "# Summary":
            out.append("## Summary")
        elif line == "# Experience":
            out.append("## Experience")
        elif line == "# Education":
            # Web CSS targets Education via h2:nth-of-type(3) (Summary, Experience, Education, Skills).
            out.append("## Education")
        elif line == "# Skills":
            out.append("## Skills")
        elif line.startswith("## **"):
            out.append("#" + line)
        else:
            out.append(line)
    trailing = md.endswith("\n")
    text = "\n".join(out)
    return text + ("\n" if trailing else "")


def main() -> None:
    data = sys.stdin.read()
    sys.stdout.write(harmonize(data))


if __name__ == "__main__":
    main()
