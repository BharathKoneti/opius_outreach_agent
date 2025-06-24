#!/bin/bash

# Script to create GitHub repositories for OpiusAi console projects
# This script requires GitHub CLI (gh) to be authenticated

echo "Creating GitHub repositories for OpiusAi console projects..."

# Console repositories
REPOS=(
  "console-frontend"
  "console-backend"
  "console-cdk"
)

# Create repositories and update remotes
for repo in "${REPOS[@]}"; do
  echo "Processing $repo..."
  
  # Check if repo exists on GitHub
  if gh repo view "OpiusAi/$repo" &>/dev/null; then
    echo "  ✓ Repository OpiusAi/$repo already exists"
  else
    echo "  → Creating OpiusAi/$repo as private repository..."
    gh repo create "OpiusAi/$repo" --private --description "OpiusAi Console - ${repo}"
    echo "  ✓ Repository created"
  fi
  
  # Update local repository remote
  cd "/Users/bharathkoneti/repo/OpiusAi/console/$repo"
  
  # Check current remote
  CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null)
  EXPECTED_REMOTE="https://github.com/OpiusAi/$repo.git"
  
  if [ "$CURRENT_REMOTE" != "$EXPECTED_REMOTE" ]; then
    echo "  → Updating remote URL from $CURRENT_REMOTE to $EXPECTED_REMOTE"
    git remote set-url origin "$EXPECTED_REMOTE"
    echo "  ✓ Remote updated"
  else
    echo "  ✓ Remote already correct"
  fi
  
  # Push to remote
  echo "  → Pushing to remote..."
  if git push origin main 2>&1; then
    echo "  ✓ Successfully pushed to remote"
  else
    echo "  ⚠ Push failed - repository may need to be created first"
  fi
  
  echo ""
done

echo "Done! Summary:"
echo "================"
for repo in "${REPOS[@]}"; do
  cd "/Users/bharathkoneti/repo/OpiusAi/console/$repo"
  echo "$repo:"
  echo "  Remote: $(git remote get-url origin)"
  echo "  Status: $(git status --porcelain | wc -l) uncommitted changes"
done