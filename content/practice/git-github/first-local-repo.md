---
id: git.first-local-repo
title: First Local Repo
track: git-github
stage: practice
---

# Practice: First Local Repo

Create your first local Git repository.

```bash
mkdir my-notes
cd my-notes
git init
echo "My first note" > notes.md
git add notes.md
git commit -m "Add first note"
```

## Check

Run `git log --oneline` and confirm your commit exists.
