#!/usr/bin/env python3
"""
ULTRAMETRICA (v1.7.0) — Live Citation, DOI, Title/Author Fidelity, Retraction & Public URL Auditor
(Playbook Pass 5 / Item 16).

Verifies every BibTeX entry in paper/refs.bib against the live Crossref REST API with polite pacing
and HTTP 429/503 backoff:
  - Resolving DOIs
  - Checking Crossref update-to / updated-by retraction metadata
  - Verifying title token Jaccard similarity (>= 0.75) and first-author surname match against refs.bib
  - Verifying publication years
  - Checking key public URLs (GitHub repo, Pages observatory, Blueprint, ORCID) return HTTP 200
  - Optionally emitting a structured JSON audit artifact (`results/citation-audit.json`) via `--write-report`

Usage:
  python scripts/check_citations.py                        # Offline syntax + DOI + LaTeX coverage check
  python scripts/check_citations.py --live                 # Live Crossref API + Retraction + HTTP check
  python scripts/check_citations.py --live --write-report  # Live check + write results/citation-audit.json
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
BIB_PATH = ROOT / "paper" / "refs.bib"
TEX_PATH = ROOT / "paper" / "main.tex"
REPORT_PATH = ROOT / "results" / "citation-audit.json"

PUBLIC_URLS = [
    "https://github.com/0thernes/ultrametrica",
    "https://0thernes.github.io/ultrametrica/",
    "https://0thernes.github.io/ultrametrica/web/",
    "https://0thernes.github.io/ultrametrica/web/blueprint.html",
    "https://orcid.org/0009-0006-8168-9648",
]

DOI_RE = re.compile(r"^10\.\d{4,9}/[-._;()/:A-Za-z0-9]+$")


def extract_brace_field(raw: str, field: str) -> str | None:
    """Balanced-brace BibTeX field extractor handling nested `{...}` (fixes F61)."""
    m = re.search(rf"\b{field}\s*=\s*\{{", raw, flags=re.IGNORECASE)
    if not m:
        return None
    i = m.end()
    depth = 1
    out: list[str] = []
    while i < len(raw) and depth > 0:
        ch = raw[i]
        if ch == "{":
            depth += 1
            out.append(ch)
        elif ch == "}":
            depth -= 1
            if depth > 0:
                out.append(ch)
        else:
            out.append(ch)
        i += 1
    return "".join(out).strip() if depth == 0 else None


def parse_bib(text: str) -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []
    for raw in re.split(r"\n(?=@)", text.strip()):
        m_key = re.match(r"@(\w+)\{([^,]+),", raw)
        if not m_key:
            continue
        entry: dict[str, str] = {"type": m_key.group(1), "key": m_key.group(2).strip()}
        for field in ("author", "doi", "year", "title", "url", "eprint", "isbn"):
            val = extract_brace_field(raw, field)
            if val is not None:
                entry[field] = val
        entries.append(entry)
    return entries


def normalize_tokens(text: str) -> set[str]:
    """Normalize LaTeX/HTML title strings into lowercase alphanumeric tokens for Jaccard matching."""
    cleaned = re.sub(r"<[^>]+>", " ", text)
    cleaned = re.sub(r"\\[a-zA-Z]+\{([^}]*)\}", r"\1", cleaned)
    cleaned = re.sub(r"[{}$~\\']", " ", cleaned)
    return set(re.findall(r"[a-z0-9]+", cleaned.lower()))


NOBILIARY_PARTICLES = {"de", "del", "della", "van", "von", "la", "le", "da", "di", "du"}


def first_author_surname_variants(bib_author: str) -> set[str]:
    """Return normalized surname variants (including particle-stripped family name for e.g. 'de Moura')."""
    first = bib_author.split(" and ")[0].strip()
    surname = first.split(",", 1)[0].strip() if "," in first else (first.split()[-1].strip() if first else "")
    cleaned = re.sub(r"[{}]", "", surname).strip()
    tokens = [re.sub(r"[^a-z]", "", t.lower()) for t in cleaned.split() if re.sub(r"[^a-z]", "", t.lower())]
    variants: set[str] = set()
    if tokens:
        variants.add("".join(tokens))
        if len(tokens) >= 2 and tokens[0] in NOBILIARY_PARTICLES:
            variants.add("".join(tokens[1:]))
    return variants


def fetch_json_with_backoff(url: str, headers: dict[str, str], retries: int = 4) -> dict[str, Any]:
    for attempt in range(retries):
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as err:
            if err.code in (429, 502, 503, 504) and attempt + 1 < retries:
                retry_after = err.headers.get("Retry-After")
                delay = float(retry_after) if retry_after and retry_after.isdigit() else 1.5 * (attempt + 1)
                time.sleep(delay)
                continue
            raise
    raise RuntimeError(f"Exceeded retries fetching {url}")


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


def check_live_crossref(entries: list[dict[str, str]], write_report: bool) -> None:
    headers = {"User-Agent": "ultrametrica-citation-audit/1.7 (mailto:0_0@0thernes.art)"}
    doi_records: list[dict[str, Any]] = []
    book_records: list[dict[str, Any]] = []
    doi_ok = 0

    for e in entries:
        key = e["key"]
        doi = e.get("doi")
        if not doi:
            book_records.append(
                {
                    "key": key,
                    "type": e["type"],
                    "year": e.get("year", ""),
                    "identifier": e.get("url", e.get("isbn", "book")),
                }
            )
            print(f"  [BOOK/URL] {key:24s} year={e.get('year', '?')} ({e.get('url', e.get('isbn', 'book'))})")
            continue
        assert DOI_RE.match(doi), f"Malformed DOI syntax for {key}: {doi}"
        url = f"https://api.crossref.org/works/{doi}"
        payload = fetch_json_with_backoff(url, headers)["message"]
        time.sleep(0.35)

        cr_title = (payload.get("title") or [""])[0]
        bib_title = e.get("title", "")
        bib_toks = normalize_tokens(bib_title)
        cr_toks = normalize_tokens(cr_title)
        union = bib_toks | cr_toks
        jaccard = len(bib_toks & cr_toks) / len(union) if union else 0.0
        assert jaccard >= 0.75, (
            f"TITLE MISMATCH for {key} ({doi}): Jaccard={jaccard:.2f} | bib={bib_title!r} | cr={cr_title!r}"
        )

        bib_surnames = first_author_surname_variants(e.get("author", ""))
        cr_authors = [re.sub(r"[^a-z]", "", str(a.get("family", "")).lower()) for a in payload.get("author", [])]
        author_ok = (not cr_authors) or bool(bib_surnames & set(cr_authors))
        assert author_ok, f"AUTHOR MISMATCH for {key} ({doi}): bib first={sorted(bib_surnames)!r}, cr={cr_authors!r}"

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
        print(
            f"  [DOI OK]   {key:24s} j={jaccard:.2f} auth=OK {status:8s} ret=False | {doi} | {cr_title[:46]}"
        )
        doi_records.append(
            {
                "key": key,
                "doi": doi,
                "bib_year": bib_year,
                "crossref_years": sorted(cr_years),
                "year_match": year_ok,
                "title_jaccard": round(jaccard, 4),
                "author_match": author_ok,
                "retracted": retracted,
                "crossref_title": cr_title,
            }
        )
        doi_ok += 1

    print(
        f"[PASS] Live Crossref DOI, Title/Author & Retraction Audit: "
        f"{doi_ok}/{doi_ok} DOIs resolved (min Jaccard={min(r['title_jaccard'] for r in doi_records):.2f}), 0 retractions."
    )

    url_records: list[dict[str, Any]] = []
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
        url_records.append({"url": u, "status": code})
    print(f"[PASS] Live Public URL Check: {len(url_records)}/{len(url_records)} endpoints healthy.")

    if write_report:
        report = {
            "schema": "ultrametrica-citation-audit-v1",
            "audited_utc": dt.datetime.now(dt.UTC).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "total_bib_entries": len(entries),
            "doi_count": len(doi_records),
            "non_doi_count": len(book_records),
            "retracted_count": 0,
            "min_title_jaccard": min(r["title_jaccard"] for r in doi_records),
            "all_authors_matched": all(r["author_match"] for r in doi_records),
            "doi_entries": doi_records,
            "non_doi_entries": book_records,
            "public_urls": url_records,
        }
        REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
        REPORT_PATH.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8", newline="\n")
        print(f"[OK] Wrote {REPORT_PATH.relative_to(ROOT)} ({len(doi_records)} DOIs, {len(url_records)} URLs).")


def main() -> None:
    parser = argparse.ArgumentParser(description="ULTRAMETRICA BibTeX, DOI, retraction & URL auditor.")
    parser.add_argument("--live", action="store_true", help="Query live Crossref API & public URLs")
    parser.add_argument("--write-report", action="store_true", help="Write results/citation-audit.json (requires --live)")
    args = parser.parse_args()

    entries = parse_bib(BIB_PATH.read_text(encoding="utf-8"))
    assert len(entries) >= 21, f"Expected >= 21 BibTeX entries, got {len(entries)}"
    for e in entries:
        if "doi" in e:
            assert DOI_RE.match(e["doi"]), f"Malformed DOI for {e['key']}: {e['doi']}"
    check_tex_citation_coverage(entries)

    if args.live:
        check_live_crossref(entries, write_report=args.write_report)
    else:
        print(f"[PASS] Offline BibTeX syntax & DOI check ({len(entries)} entries). Pass --live for Crossref audit.")


if __name__ == "__main__":
    main()
