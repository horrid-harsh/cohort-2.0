# Requiem 🖤

> Your personal knowledge management system. Save anything from the web — Requiem organizes, connects and resurfaces it automatically.

Inspired by the game **Resident Evil Requiem**. The name fits perfectly — a requiem for forgotten saves, resurrecting them back to life.

---

## What is Requiem?

A full-stack web app where users save URLs from the internet and the system automatically organizes them using AI. Think Notion + Pocket + Obsidian — but with AI automation so you don't have to manually organize anything.

**Core flow:**
```
User saves URL → scraper fetches metadata → AI suggests tags → organized in dashboard
```

---

## Tech Stack

### Backend
- **Runtime:** Node.js with ES Modules (`"type": "module"`)
- **Framework:** Express.js v5
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (access token 15m + refresh token 7d) stored in httpOnly cookies
- **Scraping:** Axios + Cheerio (metadata from URLs)
- **AI:** Mistral AI (`mistral-small-latest`) for auto tag suggestions
- **Security:** Helmet, CORS, express-rate-limit, bcryptjs

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **State:** Zustand (auth) + React Query / TanStack Query v5 (server state)
- **Styling:** SCSS Modules (feature-based architecture)
- **HTTP:** Axios with request/response interceptors

---

## Project Structure

```
requiem/
├── backend/
│   ├── server.js                    ← entry point
│   ├── .env
│   └── src/
│       ├── app.js                   ← Express setup
│       ├── config/
│       │   └── db.js                ← MongoDB connection
│       ├── models/
│       │   ├── User.model.js
│       │   ├── Save.model.js        ← core model
│       │   ├── Collection.model.js
│       │   └── Tag.model.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── saves.controller.js
│       │   ├── collections.controller.js
│       │   └── tags.controller.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── saves.routes.js
│       │   ├── collections.routes.js
│       │   └── tags.routes.js
│       ├── middlewares/
│       │   ├── auth.middleware.js   ← JWT verify
│       │   └── error.middleware.js  ← global error handler
│       ├── services/
│       │   ├── scraper.service.js   ← URL metadata fetching
│       │   ├── ai.service.js        ← Mistral tag suggestions
│       │   └── autoTag.service.js   ← finds/creates tags + attaches to save
│       └── utils/
│           ├── ApiResponse.js       ← standard response format
│           ├── ApiError.js          ← custom error class
│           └── asyncHandler.js      ← eliminates try/catch boilerplate
│
├── frontend/
│   ├── .env
│   └── src/
│       ├── app/
│       │   ├── App.jsx              ← root with QueryClientProvider
│       │   ├── Router.jsx           ← all routes + protected/public wrappers
│       │   └── QueryClient.js       ← React Query config
│       ├── features/                ← feature-based architecture
│       │   ├── auth/
│       │   │   ├── components/      ← LoginForm, RegisterForm
│       │   │   ├── hooks/           ← useAuth.js (useLogin, useRegister, useLogout)
│       │   │   ├── services/        ← auth.service.js (API calls)
│       │   │   └── store/           ← auth.store.js (Zustand)
│       │   ├── saves/
│       │   │   ├── components/
│       │   │   │   ├── SaveCard.jsx        ← card with hover actions
│       │   │   │   ├── SaveCardMenu.jsx    ← cascading hover submenu
│       │   │   │   ├── SaveGrid.jsx        ← grid with filters + skeleton
│       │   │   │   └── SaveModal.jsx       ← add new save modal
│       │   │   ├── hooks/           ← useSaves.js
│       │   │   └── services/        ← saves.service.js
│       │   ├── collections/
│       │   │   ├── hooks/           ← useCollections.js
│       │   │   └── services/        ← collections.service.js
│       │   └── tags/
│       │       ├── hooks/           ← useTags.js
│       │       └── services/        ← tags.service.js
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Sidebar.jsx      ← nav + collections + tags + user
│       │   │   ├── Topbar.jsx       ← search + New dropdown
│       │   │   ├── PageWrapper.jsx  ← sidebar + main layout shell
│       │   │   └── AuthLayout.jsx   ← auth pages layout
│       │   └── ui/
│       │       ├── ConfirmDialog.jsx        ← reusable confirm modal
│       │       ├── MobileBlock.jsx          ← mobile not supported screen
│       │       ├── CreateCollectionModal.jsx
│       │       └── CreateTagModal.jsx
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx    ← all saves
│       │   ├── FavoritesPage.jsx
│       │   ├── ArchivePage.jsx
│       │   ├── CollectionPage.jsx   ← saves in a collection + delete
│       │   ├── TagPage.jsx          ← saves with a tag + delete
│       │   └── SaveDetailPage.jsx   ← full management view
│       ├── hooks/
│       │   ├── useMediaQuery.js     ← mobile detection
│       │   └── useDebounce.js       ← debounce for search
│       ├── utils/
│       │   └── axios.instance.js    ← axios with interceptors
│       └── styles/
│           ├── abstracts/
│           │   ├── _variables.scss  ← all design tokens
│           │   └── _mixins.scss     ← reusable SCSS patterns
│           ├── base/
│           │   └── _reset.scss
│           └── main.scss
│
└── extension/                       ← Phase 5 (not started)
```

---

## Environment Variables

### Backend `.env`
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net
NODE_ENV=development

ACCESS_TOKEN_SECRET=your_secret_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_secret_here
REFRESH_TOKEN_EXPIRY=7d

MISTRAL_API_KEY=your_mistral_key_here
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## API Routes

### Auth
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout        ← protected
GET    /api/v1/auth/me            ← protected
```

### Saves
```
GET    /api/v1/saves              ← protected, query params: type, search, isFavorite, isArchived, tag, page, limit
POST   /api/v1/saves              ← protected
GET    /api/v1/saves/:id          ← protected
PATCH  /api/v1/saves/:id          ← protected
DELETE /api/v1/saves/:id          ← protected
```

### Collections
```
GET    /api/v1/collections               ← protected
POST   /api/v1/collections               ← protected
GET    /api/v1/collections/:id           ← protected
PATCH  /api/v1/collections/:id           ← protected
DELETE /api/v1/collections/:id           ← protected
PATCH  /api/v1/collections/:id/saves/:saveId  ← add save
DELETE /api/v1/collections/:id/saves/:saveId  ← remove save
```

### Tags
```
GET    /api/v1/tags                      ← protected
POST   /api/v1/tags                      ← protected
PATCH  /api/v1/tags/:id                  ← protected
DELETE /api/v1/tags/:id                  ← protected
PATCH  /api/v1/tags/:id/saves/:saveId    ← add tag to save
DELETE /api/v1/tags/:id/saves/:saveId    ← remove tag from save
```

---

## Key Concepts & Patterns Used

### Backend Patterns
- **ApiResponse / ApiError / asyncHandler** — production-grade response/error handling
- **JWT dual token** — short-lived access token (15m) + long-lived refresh token (7d)
- **Mongoose pre-save hooks** — auto hash password before saving
- **Compound indexes** — `{ user: 1, createdAt: -1 }` for fast queries
- **`select: false`** — password and embedding fields never returned by default

### Frontend Patterns
- **Feature-based architecture** — each feature has its own components/hooks/services
- **Zustand with persist** — auth state survives page refresh via localStorage
- **React Query queryKeys** — `["saves", type, search, isFavorite, isArchived]` — each unique combination has its own cache
- **Axios interceptors** — auto-attach token on every request, auto-logout on 401
- **useDebounce** — prevents API call on every keystroke in search
- **SCSS Modules** — scoped styles, no class name conflicts

---

## Features Built

### Phase 1 — Core MERN ✅
- User auth (register, login, logout, JWT)
- Save CRUD with pagination and filters
- Collections CRUD
- Tags CRUD
- Protected routes

### Phase 2 — Scraper ✅
- Auto-fetch title, description, thumbnail, favicon, siteName from any URL
- Type detection (article, video, tweet, pdf, image, link)
- Resilient — returns empty metadata on failure, never crashes

### Phase 3 — AI ✅ (partial)
- Auto tag suggestions using Mistral AI (`mistral-small-latest`)
- Runs in background after save — response is instant
- Creates new tags if they don't exist, reuses existing ones
- `isAiGenerated: true` flag on auto-created tags

### Frontend ✅
- Dark theme (pure black `#000000`, dot grid background)
- Split auth layout
- Dashboard with card grid + skeleton loading
- Debounced search
- Filter chips by content type
- Sidebar with collections + tags + save counts
- SaveCard with cascading hover submenu (viewport-aware)
- Save detail page (note, highlights, tags, collections, info)
- Create collection/tag from UI (topbar `+ New` dropdown)
- Delete collection/tag from page header
- ConfirmDialog (no browser popups)
- Mobile block screen

---

## What's Remaining

### Phase 3 — AI (continued)
- [ ] Semantic search using Mistral embeddings
- [ ] Vector storage (pgvector or Pinecone)
- [ ] "Related saves" suggestions
- [ ] Memory resurfacing ("2 months ago you saved this")

### Phase 4 — Graph View
- [ ] D3.js knowledge graph
- [ ] Nodes = saves, edges = shared tags/topics
- [ ] Interactive zoom/pan

### Phase 5 — Browser Extension
- [ ] Chrome extension manifest
- [ ] One-click save from any page
- [ ] Sends URL to backend API
- [ ] Auth token stored in extension

### Nice to Have
- [ ] Bulk actions (select multiple saves)
- [ ] Public collection sharing
- [ ] Export saves (JSON/CSV)
- [ ] Pagination UI (currently loads 20 at a time)
- [ ] Edit collection/tag (rename, change color)

---

## Running Locally

```bash
# Backend
cd backend
npm install
npm run dev   # runs on http://localhost:8000

# Frontend
cd frontend
npm install
npm run dev   # runs on http://localhost:5173
```

---

## Git Commit History (summary)
```
feat: initialize requiem backend with auth system
feat: add saves CRUD with pagination, filters and search
feat: add collections CRUD with save management
feat: add tags CRUD with save association
feat: add URL scraper to auto-fetch metadata on save
feat: frontend foundation — routing, auth store, axios, SCSS setup
feat: auth pages with split screen layout and mobile block
feat: dashboard layout with sidebar, collections and tags
feat: dashboard with topbar, save modal, card grid and search
feat: complete dashboard — favorites, archive, collection and tag pages
feat: save card menu with add to collection, add tag and archive
fix: use ConfirmDialog and prevent card menu viewport overflow
fix: sync tag and collection UI updates instantly
feat: cascading hover submenu for add to collection and add tag
fix: eliminate submenu hover gap with overlap bridge
feat: create collection and tag from UI via topbar New dropdown
feat: add delete collection and tag from page header menu
feat: save detail page with editable note, highlights, tags and collections
feat: AI auto-tagging with Gemini on save creation (switched to Mistral)
```

---

## Notes for Next Session

1. **Mistral is being used** instead of Gemini — `@mistralai/mistralai` package
2. **`autoTagSave(save, userId)`** is called without `await` in `createSave` controller — intentional, runs in background
3. **Highlights** are stored as array of `{ text, createdAt }` inside the Save model
4. **Embedding field** in Save model is already prepared (`type: [Number], select: false`) — ready for semantic search
5. **`saves.controller.js` filter** already supports `tag` query param for TagPage
6. The frontend **theme** is pure black `#000000` with dot grid background pattern
7. **SCSS uses `@use` not `@import`** — must use `as *` for variables/mixins
8. **All models export as `ModelName + Model`** — e.g. `SaveModel`, `UserModel`, `TagModel`, `CollectionModel`

---

*Built with 🖤 — Requiem lives.*
