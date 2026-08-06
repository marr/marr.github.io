#!/usr/bin/env python3
"""Emit Nuxt Content frontmatter for the web résumé sidebar (from CV YAML)."""
from __future__ import annotations

import sys
from pathlib import Path

from ruamel.yaml import YAML

SOCIAL_URLS = {
    "GitHub": "https://github.com/{username}",
    "LinkedIn": "https://linkedin.com/in/{username}",
    "X": "https://x.com/{username}",
}

BOSTON_MAP_URL = (
    "https://marr.github.io/nuxt-maplibre/demo/map/markers/#marker=42.35900,-71.05789"
)

ICON_BY_LABEL = {
    "Email": "mail",
    "Location": "map-pin",
    "Website": "globe",
    "GitHub": "github",
    "LinkedIn": "linkedin",
    "X": "x",
    "Bluesky": "bluesky",
    "Phone": "phone",
}

# Web résumé sidebar only — omitted from cv.social_networks so PDF stays compact.
WEB_ONLY_LINKS: list[dict] = [
    {
        "label": "Bluesky",
        "text": "davidmarr.bsky.social",
        "href": "https://bsky.app/profile/davidmarr.bsky.social",
        "icon": "bluesky",
    },
]


def website_display(url: str) -> str:
    return url.removeprefix("https://").removeprefix("http://").rstrip("/")


def main() -> None:
    path = Path(sys.argv[1])
    yaml = YAML()
    yaml.preserve_quotes = True
    data = yaml.load(path.read_text())
    cv = data["cv"]

    links: list[dict] = [
        {
            "label": "Email",
            "text": cv["email"],
            "href": f"mailto:{cv['email']}",
            "icon": ICON_BY_LABEL["Email"],
        },
    ]

    location = cv.get("location")
    if location:
        href = BOSTON_MAP_URL if location == "Boston, MA" else None
        links.append(
            {
                "label": "Location",
                "text": location,
                "href": href,
                "icon": ICON_BY_LABEL["Location"],
                "external": bool(href),
            }
        )

    website = cv.get("website")
    if website:
        links.append(
            {
                "label": "Website",
                "text": website_display(str(website)),
                "href": str(website),
                "icon": ICON_BY_LABEL["Website"],
            }
        )

    for social in cv.get("social_networks") or []:
        network = social["network"]
        username = social["username"]
        template = SOCIAL_URLS.get(network)
        href = template.format(username=username) if template else None
        entry: dict = {
            "label": network,
            "text": username,
            "icon": ICON_BY_LABEL.get(network, "link"),
        }
        if href:
            entry["href"] = href
        links.append(entry)

    links.extend(WEB_ONLY_LINKS)

    frontmatter = {
        "title": "Résumé",
        "description": (
            "CV for David Marr — engineering leader, platforms, and AI integration."
        ),
        "seo": {
            "title": "Résumé | David Marr",
            "description": (
                "Engineering leader with 25 years experience building production software."
            ),
        },
        "resumeProfile": {
            "name": cv["name"],
            "headline": cv.get("headline", ""),
            "pdfHref": "/david-marr-resume.pdf",
            "links": links,
        },
    }

    out = YAML()
    out.default_flow_style = False
    out.dump(frontmatter, sys.stdout)


if __name__ == "__main__":
    main()
