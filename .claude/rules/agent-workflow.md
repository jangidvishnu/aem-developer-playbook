# Agent workflow and cost

- Match effort to the request: short answers and one targeted lookup for simple questions; no verify/smoke unless
  the change needs it.
- Once per heavy/light phase, if another model fits better, say once:
  `Model tip: /model <name> for this — or reply to continue.` Don't repeat every turn.
- Subagent models when one is used: `haiku` for finds/greps, `sonnet` for routine work and web research, `opus` only
  for hard debugging/architecture. Never Opus for copy tweaks.
- **Recurring owner preferences** (git, review gates, shell…): apply now, persist in the matching
  `.claude/rules/*.md` (add `paths:` frontmatter if file-specific), tell the owner which file changed. Product
  decisions go in `12_DECISIONS.md`, not rules. No one-off details or secrets.
