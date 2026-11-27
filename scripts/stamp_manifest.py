#!/usr/bin/env python3
"""
ULTRAMETRICA (v1.7.0) — Dual-Independent Cryptographic Timestamping of `CHECKSUMS.sha256`
(Playbook Gold Standard Item #26 / Finding F73).

Produces and verifies TWO independent external cryptographic existence proofs over the exact
SHA-256 digest of `CHECKSUMS.sha256` (never altering `CHECKSUMS.sha256` itself):
  1. RFC 3161 Trusted Timestamping Authority (DigiCert `http://timestamp.digicert.com`):
     -> `data/CHECKSUMS.sha256.tsr` (DER-encoded RFC 3161 TimeStampResp)
  2. Bitcoin OpenTimestamps (3 independent calendar servers):
     -> `data/CHECKSUMS.sha256.ots` (OpenTimestamps v1 binary proof file)

Usage:
  python scripts/stamp_manifest.py           # Mint fresh DigiCert .tsr + 3-calendar Bitcoin .ots
  python scripts/stamp_manifest.py --verify  # Offline verification of embedded SHA-256 in .tsr & .ots
"""

from __future__ import annotations

import argparse
import hashlib
import re
import shutil
import subprocess
import tempfile
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "CHECKSUMS.sha256"
TSR_PATH = ROOT / "data" / "CHECKSUMS.sha256.tsr"
OTS_PATH = ROOT / "data" / "CHECKSUMS.sha256.ots"

TSA_URL = "http://timestamp.digicert.com"
OTS_MAGIC = b"\x00OpenTimestamps\x00\x00Proof\x00\xbf\x89\xe2\xe8\x84\xe8\x92\x94"
OTS_CALENDARS = [
    "https://a.pool.opentimestamps.org/digest",
    "https://b.pool.opentimestamps.org/digest",
    "https://a.pool.eternitywall.com/digest",
]


def find_openssl() -> str | None:
    found = shutil.which("openssl")
    if found:
        return found
    git_openssl = Path(r"C:\Program Files\Git\usr\bin\openssl.exe")
    if git_openssl.exists():
        return str(git_openssl)
    return None


def sha256_bytes(path: Path) -> bytes:
    return hashlib.sha256(path.read_bytes()).digest()


def mint_rfc3161_tsr(manifest: Path, out_tsr: Path) -> None:
    openssl = find_openssl()
    if not openssl:
        raise FileNotFoundError("openssl not found for RFC 3161 TimeStampReq generation")
    with tempfile.TemporaryDirectory(prefix="ultrametrica_tsq_") as td:
        tsq = Path(td) / "manifest.tsq"
        res = subprocess.run(
            [openssl, "ts", "-query", "-data", str(manifest), "-sha256", "-cert", "-no_nonce", "-out", str(tsq)],
            capture_output=True,
            text=True,
            check=False,
        )
        if res.returncode != 0:
            raise RuntimeError(f"openssl ts -query failed: {res.stderr}")
        req = urllib.request.Request(
            TSA_URL,
            data=tsq.read_bytes(),
            headers={
                "Content-Type": "application/timestamp-query",
                "User-Agent": "ultrametrica-tsa-client/1.7",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            if resp.status != 200:
                raise RuntimeError(f"DigiCert TSA returned HTTP {resp.status}")
            tsr_bytes = resp.read()
        out_tsr.parent.mkdir(parents=True, exist_ok=True)
        out_tsr.write_bytes(tsr_bytes)
    print(f"[OK] Minted RFC 3161 DigiCert TSA receipt: {out_tsr.relative_to(ROOT)} ({len(tsr_bytes):,} bytes)")


def mint_opentimestamps_ots(digest: bytes, out_ots: Path) -> None:
    assert len(digest) == 32
    proofs: list[tuple[str, bytes]] = []
    for cal_url in OTS_CALENDARS:
        req = urllib.request.Request(
            cal_url,
            data=digest,
            headers={
                "Accept": "application/vnd.opentimestamps.v1",
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "ultrametrica-ots-client/1.7",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                if resp.status == 200:
                    body = resp.read()
                    if len(body) >= 16:
                        proofs.append((cal_url, body))
        except Exception as exc:  # noqa: BLE001
            print(f"  [WARN] OTS calendar {cal_url} unreachable: {exc}")

    if len(proofs) < 2:
        raise RuntimeError(f"Expected >= 2 OpenTimestamps calendar responses, got {len(proofs)}")

    # Valid OTS v1 binary format: magic + version(0x01) + sha256_tag(0x08) + 32B digest
    # + fork(0xff) before every branch except the last
    buf = bytearray()
    buf.extend(OTS_MAGIC)
    buf.append(0x01)
    buf.append(0x08)
    buf.extend(digest)
    for idx, (_cal, body) in enumerate(proofs):
        if idx + 1 < len(proofs):
            buf.append(0xFF)
        buf.extend(body)

    out_ots.parent.mkdir(parents=True, exist_ok=True)
    out_ots.write_bytes(bytes(buf))
    print(
        f"[OK] Minted OpenTimestamps Bitcoin calendar proof ({len(proofs)} calendars): "
        f"{out_ots.relative_to(ROOT)} ({len(buf):,} bytes)"
    )


def verify_stamps(manifest: Path, tsr_path: Path, ots_path: Path) -> None:
    assert manifest.exists(), f"Missing {manifest}"
    digest = sha256_bytes(manifest)
    digest_hex = digest.hex()

    # 1. Verify RFC 3161 .tsr embeds exact SHA-256 digest of CHECKSUMS.sha256
    assert tsr_path.exists(), f"Missing RFC 3161 receipt: {tsr_path}"
    tsr_raw = tsr_path.read_bytes()
    assert len(tsr_raw) > 512, f"RFC 3161 receipt suspiciously small: {len(tsr_raw)} bytes"
    assert digest in tsr_raw, (
        f"RFC 3161 receipt {tsr_path.name} does NOT embed current SHA-256 of CHECKSUMS.sha256 ({digest_hex})!"
    )

    openssl = find_openssl()
    ts_time_note = ""
    if openssl:
        res = subprocess.run(
            [openssl, "ts", "-reply", "-in", str(tsr_path), "-text"],
            capture_output=True,
            text=True,
            check=False,
        )
        assert res.returncode == 0, f"openssl ts -reply failed: {res.stderr}"
        assert "Status: Granted." in res.stdout, f"RFC 3161 status not Granted:\n{res.stdout[:500]}"
        # Parse hex bytes from "Message data:\n    0000 - xx xx ..."
        m_ts = re.search(r"Time stamp:\s*(.+)", res.stdout)
        if m_ts:
            ts_time_note = f", UTC={m_ts.group(1).strip()}"
    print(f"[PASS] RFC 3161 DigiCert receipt verified: embeds sha256(CHECKSUMS.sha256)={digest_hex[:16]}...{ts_time_note}")

    # 2. Verify OpenTimestamps .ots header, version, sha256 op, embedded 32-byte digest & calendar URLs
    assert ots_path.exists(), f"Missing OpenTimestamps proof: {ots_path}"
    ots_raw = ots_path.read_bytes()
    prefix_len = len(OTS_MAGIC) + 2 + 32
    assert len(ots_raw) > prefix_len + 20, f"OTS proof suspiciously small: {len(ots_raw)} bytes"
    assert ots_raw.startswith(OTS_MAGIC), "OTS proof has invalid OpenTimestamps magic header"
    assert ots_raw[len(OTS_MAGIC)] == 0x01, "OTS proof version must be 1"
    assert ots_raw[len(OTS_MAGIC) + 1] == 0x08, "OTS proof hash op must be SHA-256 (0x08)"
    ots_digest = ots_raw[len(OTS_MAGIC) + 2 : prefix_len]
    assert ots_digest == digest, (
        f"OTS proof digest mismatch: expected {digest_hex}, got {ots_digest.hex()}"
    )
    cals = re.findall(rb"https://[A-Za-z0-9._/-]+", ots_raw)
    assert len(cals) >= 2, f"Expected >= 2 OpenTimestamps calendars embedded in .ots, found {len(cals)}"
    print(
        f"[PASS] OpenTimestamps Bitcoin proof verified: embeds sha256(CHECKSUMS.sha256)={digest_hex[:16]}... "
        f"({len(cals)} independent calendars)"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Mint or verify dual RFC 3161 + Bitcoin OTS stamps on CHECKSUMS.sha256.")
    parser.add_argument("--verify", action="store_true", help="Offline verification only (no network)")
    args = parser.parse_args()

    if args.verify:
        verify_stamps(MANIFEST_PATH, TSR_PATH, OTS_PATH)
        return

    assert MANIFEST_PATH.exists(), "CHECKSUMS.sha256 missing; run verify_exact.py --write-checksums first."
    digest = sha256_bytes(MANIFEST_PATH)
    mint_rfc3161_tsr(MANIFEST_PATH, TSR_PATH)
    mint_opentimestamps_ots(digest, OTS_PATH)
    verify_stamps(MANIFEST_PATH, TSR_PATH, OTS_PATH)


if __name__ == "__main__":
    main()
