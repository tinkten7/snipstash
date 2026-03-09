# SnipStash — Your Code Snippet Library

A developer's personal code snippet manager with **MongoDB weighted text search**, syntax highlighting, and a design-forward dark interface.

## The Problem

Developers lose 30+ minutes daily searching for reusable code across Slack threads, Stack Overflow bookmarks, old repos, and scattered notes. There's no single, fast, personal place to store and retrieve code snippets.

## The Solution

SnipStash gives developers a searchable personal library with **intelligent relevance ranking**. When you search, titles matter 10x more than raw code — so your snippets surface by *what they do*, not random variable names.

## Key Features

- **Weighted Text Search** — MongoDB `$text` index with custom weights: title (10x), tags (8x), description (5x), code (1x)
- **Syntax Highlighting** — Highlight.js with 18+ language support
- **Tag Management** — Color-coded pastel tags with one-click filtering
- **One-Click Copy** — Copy to clipboard with visual feedback and usage tracking
- **Favorites** — Star important snippets for quick access
- **Language Filtering** — Browse by JavaScript, Python, Go, Rust, and more
- **Keyboard Shortcuts** — `Cmd+K` to focus search, `Esc` to close modals

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT + bcrypt |
| Search | MongoDB weighted text index |
| Syntax | Highlight.js |
| Design | Custom "Midnight Mint" design system |

## Design System — "Midnight Mint"

Dark mode with pastel accents. No purple gradients, no generic AI aesthetics.

- **Backgrounds**: Deep charcoal layers (#0b0d13 → #171a26 → #1e2233)
- **Primary accent**: Soft mint (#7dd3c0) — calming, distinctive
- **Secondary**: Warm peach (#f0a68c), sky blue (#8cc8f0), lavender (#b8a9f0)
- **Typography**: Plus Jakarta Sans (display) + JetBrains Mono (code)
- **Tags**: 7-color pastel rotation with glow backgrounds

## Setup

```bash
# Install dependencies
npm run install-all

# Configure environment
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI

# Seed demo data (optional)
cd server && node seed.js

# Run development
npm run dev
```

## Deployment

**Frontend (Vercel):**
```bash
cd client
vercel deploy
```
Set `VITE_API_URL` environment variable to your backend URL.

**Backend (Render):**
Deploy the `/server` directory with:
- Build command: `npm install`
- Start command: `node server.js`
- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `PORT`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/snippets` | List all snippets |
| GET | `/api/snippets/search?q=` | Weighted text search |
| POST | `/api/snippets` | Create snippet |
| PUT | `/api/snippets/:id` | Update snippet |
| PATCH | `/api/snippets/:id/favorite` | Toggle favorite |
| PATCH | `/api/snippets/:id/copy` | Track copy event |
| GET | `/api/snippets/meta/tags` | Get all tags with counts |
| GET | `/api/snippets/meta/stats` | Dashboard statistics |

## Search Weights Explained

```
Title       ████████████████████ 10x  — "What does this snippet do?"
Tags        ████████████████     8x  — "What category is it?"
Description ██████████           5x  — "How does it work?"
Code        ██                   1x  — "What's in the code?"
```

This means searching "debounce" finds your "React useDebounce Hook" snippet first (title match, 10x) rather than a random file that happens to contain `debounce` in a comment (code match, 1x).

---

Built by Srikar Tenneti
