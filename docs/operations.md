# Operations, Archival Backups, Offsite Mirrors & Rollback (`docs/operations.md`)

> Build Standard `A35` & `A36`. Operational runbook for hosting, preserving, auditing, and safely rolling back **ULTRAMETRICA**.

## 1. Deployment Topology

ULTRAMETRICA has **zero backend database and zero server-side state**:
- **Public Live Demo:** Static ES-module observatory deployed automatically from `main` to **GitHub Pages** (`https://0thernes.github.io/ultrametrica/`) via [`.github/workflows/pages.yml`](../.github/workflows/pages.yml).
- **Local Development / Research Server:** `node server.mjs` (default `http://127.0.0.1:4173`, health probe `GET /healthz`, structured logs via `LOG_FORMAT=json`).
- **Release Artifacts:** Every `v*` git tag runs [`.github/workflows/release.yml`](../.github/workflows/release.yml), publishing the frozen PDF (`dist/Donahue_2026_Ultrametrica.pdf`), standalone arXiv bundle (`dist/arxiv_submission.tar.gz`), Lean 4 audit transcript (`results/lean4-audit.txt`), `SHA256SUMS`, and GitHub build-provenance attestation.

---

## 2. Backups, Cold Archives & Offsite Mirroring

Three independent durability layers protect every frozen release:

1. **Primary GitHub Remote + Local ReFS Dev Drive:**
   - Primary remote: `https://github.com/0thernes/ultrametrica`
   - Local canonical workstation clone: `Z:\[Vibe Coded (AI)]\ANTIGRAVITY\ultrametrica`
2. **Master Research Archive Submodule Pin (`0thernes/0thernes-research-archive`):**
   - Entry `0TH-BUILD-003` pins the exact release commit SHA as a git submodule, archives a byte-identical copy of `Donahue_2026_Ultrametrica.pdf` and `arxiv_submission.tar.gz`, and verifies SHA-256 checksums automatically in Archive Audit CI.
3. **Offsite Git Bundle & Software Heritage Cold Preservation:**
   - Create a self-contained single-file cold backup bundle (all refs, tags, full history) at any time:
     ```bash
     git bundle create ../ultrametrica-v1.4.0.bundle --all
     git bundle verify ../ultrametrica-v1.4.0.bundle
     ```
   - Trigger immutable offsite archival on **Software Heritage** (`https://archive.softwareheritage.org/save/` -> Origin URL `https://github.com/0thernes/ultrametrica`) after each tagged release, recording the SWHID in `0thernes-research-archive`.

### Restoring from a Git Bundle

```bash
git clone ultrametrica-v1.4.0.bundle ultrametrica-restored
cd ultrametrica-restored
python scripts/verify_exact.py --check-checksums
```

---

## 3. Monitoring & Failure Recovery

- **Health Check:** Poll `GET http://127.0.0.1:4173/healthz` -> expects HTTP `200` and `{"status":"ok", ...}`.
- **Error Diagnostics:** Start with `LOG_FORMAT=json node server.mjs`; any `500` I/O error emits a structured JSON record with `reqId`, `error`, and `stack` to `stderr` while keeping the HTTP listener alive (verified by `test/server.mjs` B21 failure injection).
- **CI Failure Triage:** GitHub Actions runs 5 independent jobs (`node-and-python` on Ubuntu/macOS/Windows, `report-only-static`, `lean4-six-kernel-audit`, `latex-paper-and-arxiv`, `pages`). Blocking failures identify exact broken invariants; never silence or bypass a failing mathematical or Lean check.

---

## 4. Safe Rollback Procedure (`A36`)

Because all releases are tagged on linear `main` history (Hard Rule R2 — never force-push `main` to rewrite public tags):

```bash
# 1. Inspect the previous known-good release tag (e.g., v1.3.0)
just rollback v1.3.0

# 2. Create a clean forward revert commit restoring the exact tree of v1.3.0
git revert --no-commit v1.3.0..HEAD
git commit -m "revert: restore verified v1.3.0 state"
git push origin main
```

GitHub Pages automatically redeploys the reverted `main` commit within ~60 seconds, and CI re-verifies every test, Lean proof, and checksum before the restored state is considered live.
