---
id: git.branching-basics
title: Branching Basics
track: git-github
stage: root
---

# Branching Basics

Branches allow you to work on new features, fix bugs, or experiment without affecting the main codebase.

## What is a Branch?

A **branch** in Git is simply a lightweight, movable pointer to a specific commit. The default branch in most repositories is named `main` or `master`.

## Key Commands

To list all branches in your repository:
```bash
git branch
```

To create a new branch:
```bash
git branch <branch-name>
```

To switch to a branch:
```bash
git checkout <branch-name>
# Or in modern Git:
git switch <branch-name>
```

To create and switch to a branch in one command:
```bash
git checkout -b <branch-name>
# Or in modern Git:
git switch -c <branch-name>
```

## Merging Changes

Once you are done working in your feature branch, you merge it back into `main`:
1. Switch back to main: `git switch main`
2. Merge the feature: `git merge <branch-name>`
