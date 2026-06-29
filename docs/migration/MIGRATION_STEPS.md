# Root2Pro Migration Steps

Use this pack to replace the temporary GitHub repository state with the clean interactive platform foundation.

## Recommended local migration

```bash
git clone https://github.com/BAKUGOS1/Root2Pro.git
cd Root2Pro

# Remove temporary bootstrap files and current contents.
git rm -r . || true

# Copy the contents of this pack's root2pro/ folder into the cloned Root2Pro folder.

npm install
npm run validate

git add -A
git commit -m "chore: migrate Root2Pro to interactive platform foundation"
git push origin main
```

## After push

- Set GitHub About description: `Learn from the root. Build like a pro.`
- Add topics: `learning`, `programming`, `roadmap`, `html`, `css`, `javascript`, `python`, `react`, `sql`, `dsa`, `open-source`, `students`
- Enable Discussions.
- Disable Wiki.
- Create release `v0.2.0-migration`.
