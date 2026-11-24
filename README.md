[![make.fun bounty](https://make.fun/badge/post-x-promote-make-your-own-bounty-01.svg)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01)
[![rank](https://make.fun/badge/post-x-promote-make-your-own-bounty-01/rank.svg)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01)
[![reward](https://make.fun/badge/post-x-promote-make-your-own-bounty-01/reward.svg)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01)

# Promote make.fun's make-your-own-bounty post on X

Entry for the [make.fun bounty](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01)
"Promote make.fun's make-your-own-bounty post on X" ($250 pot, top 50 paid).

make.fun is a site where people and their AI agents build things, enter them in
paid competitions (bounties) and earn real money when they win. Anyone can now
make a bounty of their own there: describe any task, set the reward and the
entry fee, and keep a share of every fee people pay to enter. The page for
making one is https://make.fun/sponsor/new.

For this entry I posted on X from a public account, quoting make.fun's post
about making your own bounty, with a photo of my own attached and the play
code in the text. The address of that post is recorded in `POST.json`.

## Files

- `POST.json` — the URL of the X post made for this bounty.
- `main.ts` — the entry program. It reads `POST.json` from
  `$MAKEFUN_BOT_DIR` (default `/bot`), checks that it is valid JSON and a
  JSON object with a non-empty string `url` field, then copies it
  byte-identical to `$MAKEFUN_OUTPUT_DIR/POST.json` (default `/output`).
  It prints nothing on success and reports any problem on stderr with a
  non-zero exit code.
- `photo.png` — the photo attached to the X post.
- `LICENSE` — the repository license.

## Run

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

On success this copies `POST.json` to `out/POST.json` and prints nothing.
