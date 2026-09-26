# Portfolio redesign

Bento / Apple-style portfolio (Coffee palette), built from a copy of `Portfolio_2`.

## Run it

```bash
npm install
npm run dev      # local preview
npm run build    # production build in dist/
```

## How it works

- Layout: `src/components/bento/` (`index.tsx` + `bento.css`).
- Data loading + error handling: `src/components/gitprofile.tsx`.
- Everything you edit lives in `profile.config.ts`.

### Live from GitHub

- Name, bio, avatar and public repo count come from your GitHub profile.
- **GitHub Projects tile = your own repos that you have starred**, most recently starred first
  (`projects.limit`, default 4). Star one of your repos to feature it, unstar it to hide it.
  Descriptions, topics, language, stars and "updated" time come from GitHub.
  With 1-3 projects they show as full-width rows; with 4+ as a 2x2 grid.

### From profile.config.ts

- `status` — the pill on the profile tile ("Open to internships").
- `currentlyWorkingOn` — the "Currently working on" items (placeholders — replace them).
- `skills`, `educations`, `certifications`, `social` (LinkedIn, email), `resume.fileUrl`.

## Removed (not used by the new design)

- Old card components, theme switcher, blog / publications / experience / external-projects sections.
- Tailwind CSS, daisyUI, react-icons, and the broken `@portfolio/blog-js` package.
