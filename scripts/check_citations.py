#!/usr/bin/env python3
"""
ULTRAMETRICA — Live Citation, DOI, Retraction & Public URL Auditor (Playbook Pass 5 / Item 16).

Verifies every BibTeX entry in paper/refs.bib against the live Crossref REST API
(resolving DOIs, checking Crossref update-to retraction metadata, and verifying publication years)
and verifies key public URLs (GitHub repo, Pages observatory, ORCID) return HTTP 200.

Usage:
  python scripts/check_citations.py             # Offline syntax + DOI format check only
  python scripts/check_citations.py --live      # Live Crossref API + Retraction + HTTP check
"""

from __future__ import annotations

import argparse
import json
import re
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BIB_PATH = ROOT / "paper" / "refs.bib"
TEX_PATH = ROOT / "paper" / "main.tex"

PUBLIC_URLS = [
    "https://github.com/0thernes/ultrametrica",
    "https://0thernes.github.io/ultrametrica/",
    "https://0thernes.github.io/ultrametrica/web/",
    "https://orcid.org/0009-0006-8168-9648",
]

DOI_RE = re.compile(r"^10\.\d{4,9}/[-._;()/:A-Za-z0-9]+$")


def parse_bib(text: str) -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []
    for raw in re.split(r"\n(?=@)", text.strip()):
        m_key = re.match(r"@(\w+)\{([^,]+),", raw)
        if not m_key:
            continue
        entry: dict[str, str] = {"type": m_key.group(1), "key": m_key.group(2).strip()}
        for field in ("doi", "year", "title", "url", "eprint", "isbn"):
            m = re.search(rf"\b{field}\s*=\s*\{{(.+?)\}}(?:,|\s*\n|\s*\}})", raw, flags=re.IGNORECASE)
            if m:
                entry[field] = m.group(1).strip()
        entries.append(entry)
    return entries


def check_tex_citation_coverage(entries: list[dict[str, str]]) -> None:
    tex = TEX_PATH.read_text(encoding="utf-8")
    bib_keys = {e["key"] for e in entries}
    cited_keys: set[str] = set()
    for grp in re.findall(r"\\cite(?:\[[^\]]*\])?\{([^}]+)\}", tex):
        for k in grp.split(","):
            tok = k.strip()
            if tok:
                cited_keys.add(tok)
    missing_in_bib = cited_keys - bib_keys
    uncited_in_tex = bib_keys - cited_keys
    assert not missing_in_bib, f"Keys cited in paper/main.tex missing from refs.bib: {sorted(missing_in_bib)}"
    assert not uncited_in_tex, f"Uncited orphan entries in paper/refs.bib: {sorted(uncited_in_tex)}"
    print(f"[PASS] BibTeX <-> LaTeX 1-to-1 coverage: all {len(bib_keys)}/{len(bib_keys)} entries cited cleanly.")


def check_live_crossref(entries: list[dict[str, str]]) -> None:
    headers = {"User-Agent": "ultrametrica-citation-audit/1.5 (mailto:0_0@0thernes.art)"}
    doi_ok = 0
    for e in entries:
        key = e["key"]
        doi = e.get("doi")
        if not doi:
            print(f"  [BOOK/URL] {key:24s} year={e.get('year', '?')} ({e.get('url', e.get('isbn', 'book'))})")
            continue
        assert DOI_RE.match(doi), f"Malformed DOI syntax for {key}: {doi}"
        url = f"https://api.crossref.org/works/{doi}"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=20) as resp:
            payload = json.loads(resp.read().decode("utf-8"))["message"]
        cr_title = (payload.get("title") or [""])[0]
        retracted = False
        for upd in payload.get("update-to", []) + payload.get("updated-by", []):
            if "retract" in str(upd.get("type", "")).lower():
                retracted = True
        assert not retracted, f"RETRACTED WORK DETECTED: {key} ({doi})"
        cr_years: set[str] = set()
        for k in ("published-print", "published-online", "issued", "created"):
            parts = payload.get(k, {}).get("date-parts", [[]])
            if parts and parts[0]:
                cr_years.add(str(parts[0][0]))
        bib_year = e.get("year", "")
        year_ok = (not cr_years) or (bib_year in cr_years)
        status = "OK" if year_ok else f"YEAR_NOTE(bib={bib_year},cr={sorted(cr_years)})"
        print(f"  [DOI OK]   {key:24s} {status:12s} ret=False | {doi} | {cr_title[:52]}")
        doi_ok += 1

    print(f"[PASS] Live Crossref DOI & Retraction Audit: {doi_ok}/{doi_ok} DOIs resolved, 0 retractions.")

    url_ok = 0
    for u in PUBLIC_URLS:
        req = urllib.request.Request(u, headers=headers, method="HEAD")
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                code = resp.status
        except urllib.error.HTTPError as err:
            if err.code == 405:
                req_get = urllib.request.Request(u, headers=headers)
                with urllib.request.urlopen(req_get, timeout=15) as resp:
                    code = resp.status
            else:
                raise
        assert 200 <= code < 400, f"Public URL check failed ({code}): {u}"
        print(f"  [HTTP {code}] {u}")
        url_ok += 1
    print(f"[PASS] Live Public URL Check: {url_ok}/{url_ok} endpoints healthy.")


def main() -> None:
    parser = argparse.ArgumentParser(description="ULTRAMETRICA BibTeX, DOI, retraction & URL auditor.")
    parser.add_argument("--live", action="store_true", help="Query live Crossref API & public URLs")
    args = parser.parse_args()

    entries = parse_bib(BIB_PATH.read_text(encoding="utf-8"))
    assert len(entries) >= 21, f"Expected >= 21 BibTeX entries, got {len(entries)}"
    for e in entries:
        if "doi" in e:
            assert DOI_RE.match(e["doi"]), f"Malformed DOI for {e['key']}: {e['doi']}"
    check_tex_citation_coverage(entries)

    if args.live:
        check_live_crossref(entries)
    else:
        print(f"[PASS] Offline BibTeX syntax & DOI check ({len(entries)} entries). Pass --live for Crossref audit.")


if __name__ == "__main__":
    main()
