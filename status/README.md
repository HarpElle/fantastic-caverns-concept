# status/ — the shared status and plan record for this repo

Any tool (Claude Code, Codex, Cursor, Grok Build, Antigravity) and Jason read
and update this folder. It is the one place to learn what is live, what is in
flight, what is blocked, and what comes next. Repo docs elsewhere explain how
the product works; this folder says where the work stands.

## Files

| File | Purpose | Who writes |
| --- | --- | --- |
| `CURRENT.md` | State right now: what is live, what is in flight (PRs, branches, local WIP), blockers, decisions waiting on Jason | Any agent, at the end of every work session that changed state |
| `PLAN.md` | The product plan: current needs, upcoming work in order, future intentions | Any agent when scope changes; Jason owns the intentions |
| `LOG.md` | Append-only entries, newest first: who did what, when, and where the evidence is | Any agent, every session |
| `status.json` | Machine-readable mirror of CURRENT.md and PLAN.md for admin.harpelle.com and Team Kernel | The same agent that edits the Markdown, in the same commit |

## Rules

1. **Read `CURRENT.md` before starting work here.** If it disagrees with the
   code or GitHub, the code and GitHub win; fix the file.
2. **Update in the same commit or PR as the work.** A PR that changes what is
   live or in flight also changes `CURRENT.md`, `status.json`, and adds a
   `LOG.md` entry. Docs-only commits use `[skip ci]` in the subject.
3. **Stamp every edit** with the date and the tool that made it
   (`Updated: YYYY-MM-DD by <tool>`). Never leave a stale stamp.
4. **Never invent status.** "Unknown" is a valid value. A blocker names who
   or what is blocking. A decision for Jason is phrased as a question with a
   recommended answer.
5. **Keep `LOG.md` append-only.** Correct an earlier entry with a new entry
   that says what changed; do not rewrite history.
6. **`status.json` mirrors the Markdown, never the reverse.** Schema
   `harpelle-status/1`; keep keys stable so collectors keep working.
7. **Owner decisions are Jason's.** Agents propose; only Jason moves an item
   out of "Decisions for Jason".

## status.json keys

`schema`, `repo`, `name`, `kind`, `stage` (live | beta | developing | paused |
dormant | retired | internal | automated), `health` (healthy | attention |
blocked | idle), `summary`, `updatedAt`, `updatedBy`, `current[]`,
`inFlight[{ref,title,state}]`, `blockers[]`, `decisions[]`, `next[]`,
`later[]`, `intentions`, `links[{label,url}]`.

## Waiting on something outside this repo (added 2026-09-05)

Work that is parked on an external condition (a library release, a store review, a
third-party approval, a date, another repo's PR) is recorded so a portfolio pass can
re-check it and give the green light when the condition is met. Put it in two places:

- `CURRENT.md` under a heading **Waiting on** as one bullet per item:
  `- <what is parked> · until <condition> · check: <command or URL> · since <date> · owner <who>`
- `status.json` under `waits[]` with the same fields:

```json
"waits": [
  {
    "item": "PR #42 TypeScript 7 bump (web)",
    "condition": "typescript-eslint publishes a peer range that admits typescript 7",
    "check": "npm view @typescript-eslint/parser peerDependencies.typescript",
    "expect": "range includes 7.0.x",
    "since": "2026-09-04",
    "owner": "any agent",
    "lastChecked": "2026-09-05",
    "lastResult": "still waiting: >=4.8.4 <6.1.0"
  }
]
```

Rules for waits: `check` must be something a script or a person can run without
credentials or judgment where possible (an npm view, a `gh pr view`, a public URL,
a date). An agent that touches the repo re-runs each `check`, updates `lastChecked`
and `lastResult`, and when the condition is met either finishes the work or moves
the item to "Decisions for Jason" with a recommendation. The executive hub reads
`waits[]` and lists them on its "Waiting on" panel with a green light when
`lastResult` starts with `met`.

## Decision hygiene (added 2026-09-05)

`decisions[]` is a queue, not a history. When Jason answers, the agent removes the
item from `decisions[]` and `CURRENT.md`, records the answer in `LOG.md`, and acts
on it. Items that a merged PR or a shipped build has made moot are removed the same
way. A decision older than 30 days without an answer is restated with the current
recommendation or dropped. Do not annotate answered items in place.
