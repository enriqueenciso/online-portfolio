#!/bin/bash
set -eo pipefail

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

# jq filter to extract streaming text from assistant messages
stream_text='select(.type == "assistant").message.content[]? | select(.type == "text").text // empty | gsub("\n"; "\r\n") | . + "\r\n\n"'

# jq filter to extract final result
final_result='select(.type == "result").result // empty'

promptfile=$(mktemp)
outfile=$(mktemp)
trap "rm -f '$promptfile' '$outfile'" EXIT

for ((i=1; i<=$1; i++)); do
  commits=$(git log -n 5 --format="%H%n%ad%n%B---" --date=short 2>/dev/null || echo "No commits found")
  issues=$(gh issue list --state open --json number,title,body,comments)
  prompt=$(cat ralph/prompt.md)

  printf "Previous commits:\n%s\n\nIssues:\n%s\n\n%s\n" "$commits" "$issues" "$prompt" > "$promptfile"

  docker sandbox run -i claude . -- \
    --verbose \
    --print \
    --output-format stream-json \
  < "$promptfile" \
  | grep --line-buffered '^{' \
  | tee "$outfile" \
  | jq --unbuffered -rj "$stream_text"

  result=$(jq -r "$final_result" "$outfile")

  if [[ "$result" == *"<promise>NO MORE TASKS</promise>"* ]]; then
    echo "Ralph complete after $i iterations."
    exit 0
  fi
done
