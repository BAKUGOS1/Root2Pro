---
id: git.making-commits
title: Making Commits
track: git-github
stage: practice
---

# Making Commits

A **commit** in Git is a snapshot of your staged changes at a specific point in time. It behaves like a permanent checkpoint or "save point" in your project history.

## Creating a Commit

Once your changes are added to the staging area via `git add`, you can commit them using:
```bash
git commit -m "Your descriptive commit message"
```

## Writing Good Commit Messages

A good commit message should explain **what** changed and **why**.
* **Good:** `git commit -m "feat: add user login form structure"`
* **Bad:** `git commit -m "updates"` or `git commit -m "fix bug"`

## Inspecting History

To see the list of commits in your repository:
```bash
git log
```
For a shorter, cleaner view:
```bash
git log --oneline
```

## Practice Exercise

1. Make sure you have staged changes (run `git status` to verify).
2. Commit them using `git commit -m "chore: add my first structured notes"`.
3. Check `git log --oneline` to see your commit represented in the branch timeline.
