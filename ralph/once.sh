#!/bin/bash

issues=$(gh issue list --state open --json number,title,body,comments)
commits=$(git log -n 5 --format="%H%n%ad%n%B---" --date=short 2>/dev/null || echo "No commits found")
prompt=$(cat ralph/prompt.md)

contextfile="ralph/.context"
trap 'stty sane 2>/dev/null; rm -f "$contextfile"' EXIT

printf "Previous commits:\n%s\n\nIssues:\n%s\n\n%s\n" "$commits" "$issues" "$prompt" > "$contextfile"

claude.exe --permission-mode acceptEdits "Read $contextfile for full task context and proceed."
