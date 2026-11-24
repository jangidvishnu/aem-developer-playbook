# Shell and terminals (Windows)

- Repo path has a space (`C:\My Projects\…`) — always quote paths.
- **Bash tool** (Git Bash) for git/npm chains; heredocs work. **PowerShell tool** (5.1, no `&&`) only for
  Windows-only commands. Multi-line commit/PR bodies: write `.git/COMMIT_MSG_TMP.txt` / `.git/PR_BODY_TMP.md`, use
  `git commit -F` / `gh pr create --body-file`, delete after.
- Keep repo-local `git config core.autocrlf false` — CRLF checkouts fail Prettier `lint`.
- No Python here. One dev server only, port **3456**; stop it when done. `verify`/`ui-smoke` and WMI/`gh` calls can
  take minutes — give a long `timeout` rather than re-running.
- Orphan server/smoke cleanup (PowerShell):

```powershell
Get-CimInstance Win32_Process -Filter "name='node.exe'" |
  Where-Object { $_.CommandLine -match 'serve\\build\\main|run-ui-smoke|ui-smoke-search|run ui-smoke' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
```
