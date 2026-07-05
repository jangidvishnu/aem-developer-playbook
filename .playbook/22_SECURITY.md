# Security

## Threat model

This is a static, client-side-only site with no backend, no authentication, and no user-submitted data storage.
The realistic threat surface is narrow but not zero:

- Third-party script/content injection (via the Tailwind CDN script tag or the Google Fonts stylesheet).
- Malicious or misleading content merged into `data/*.json` (e.g. a fabricated company claim, a phishing-style
  "careers" URL).
- Accidental inclusion of personal/sensitive information (e.g. real resume data, private recruiter contacts) in a
  repository intended for eventual public release.

## Current posture

- No user input is persisted server-side — the only client-side persistence is the theme preference in
  `localStorage`, which stores no sensitive data.
- All external resources are loaded over HTTPS from well-known CDNs (Tailwind, Google Fonts).
- No inline event handler executes user-supplied data — content today is authored by the project owner, not
  submitted by third parties.

## Rules

1. Never commit secrets, credentials, or private API keys — this is a public-facing repository by design.
2. Before making any personal career-tracking data (recruiter contacts, private notes) public, review it
   specifically for information that should stay private, and consider a separate private data file/branch
   strategy rather than assuming everything in `data/` is publishable as-is.
3. Any externally-sourced link added to `careersUrl`, `Evidence`, or `References` fields should point to the
   company's own domain or a reputable source — do not link through URL shorteners or unverified redirect services.
4. Any new external script/style dependency (beyond Tailwind and Google Fonts) requires a decision record
   (`12_DECISIONS.md`) explaining why it's needed and confirming it's loaded over HTTPS with subresource integrity
   where practical.
5. If user-generated content or a backend is ever introduced (out of current scope), this document must be revised
   before that work starts — the current posture assumes a fully static, single-author site.

## Dependency hygiene

Per `04_CODING_STANDARD.md`, dependencies are already minimized by design (no frameworks, no build step). This is
itself a security control: fewer dependencies means a smaller supply-chain attack surface. Keep it that way —
treat every proposed dependency addition as a security review item, not just a coding-standard one.

## Incident precedent

See `12_DECISIONS.md` (DR-002) for the Milestone 1 repository-integrity incident (files unexpectedly deleted by an
unidentified concurrent process). While not a security breach in the traditional sense, it is a reminder to treat
unexplained repository state changes as suspicious until understood, especially once this repository has real
outside contributors.

## Reporting

Until a formal process exists, security concerns should be raised directly with the project owner rather than
filed as a public issue, in case the concern involves an active exposure.
