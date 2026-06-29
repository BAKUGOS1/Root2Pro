---
id: git.stage-status
title: Stage & Status
track: git-github
stage: practice
---

# Staging Area & Git Status

In Git, modifications don't go directly from your editor to a commit. Instead, they pass through an intermediate step called the **staging area** (or index).

## How it works

1. **Working Directory:** Your actual project files where you make changes.
2. **Staging Area:** A staging zone where you select which modifications you want to package into your next commit.
3. **Commit History:** The permanent record of checkpoints.

## Key Commands

To inspect the state of your working directory and staging area:
```bash
git status
```

To add modified files to the staging area:
```bash
git add <filename>
```
To stage everything in the current directory:
```bash
git add .
```

To see what you have changed but not yet staged:
```bash
git diff
```

## Practice Exercise

1. Modify `notes.md` or create a new file `todo.txt`.
2. Run `git status` to see it listed under **Untracked files** or **Changes not staged**.
3. Stage it with `git add todo.txt`.
4. Run `git status` again. It should now be green and marked as **Changes to be committed**.
