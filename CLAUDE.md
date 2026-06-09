# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Express proxy + Vite middleware) at http://localhost:3000
npm run build    # Build frontend (vite) + bundle server (esbuild → dist/server.cjs)
npm run start    # Run production build
npm run lint     # TypeScript type check (no emit)
```

No test suite exists. Type check with `npm run lint` to validate.

The **Python FastAPI backend** (separate repo `Comunyapp Backend/backend`) must also be running at `http://localhost:8000` for the app to work:
```bash
# from Comunyapp Backend/backend
uvicorn main:app --reload --port 8000
```

## Environment Variables

### Frontend (`.env` — copy from `.env.example`)
- `VITE_API_URL` — URL of the Python backend exposed to the browser (e.g. `http://localhost:8000` for local dev, Railway URL for prod). When absent, `API_BASE` defaults to `""` and requests are proxied through the Express server.
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — used by the legacy Express routes (mostly unused now)
- `GEMINI_API_KEY` — Google Gemini AI key
- `APP_URL` — hosting URL (injected automatically in production)

### Python backend (its own `.env`)
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — Supabase credentials for all FastAPI routes

## Architecture

This repo is the **frontend SPA + a thin Node.js reverse proxy**. The actual API logic lives in the separate Python FastAPI backend repo.

### Dev server (`server.ts`)
`server.ts` runs Express with Vite attached as middleware (HMR included). All `/api/*` requests are reverse-proxied server-side to the Python backend at `PYTHON_BACKEND_URL` (defaults to `http://localhost:8000`). The old Express `routes/` folder is **legacy and unused** — do not add routes there.

### Production
- **Self-hosted**: Express serves the `dist/` static build and proxies `/api/*` to the Python backend.
- **Vercel**: `vercel.json` routes `/api/*` to `api/index.ts` (re-exports the Express app) and everything else to `index.html`.

### Python backend (separate repo)

FastAPI app with all active API logic. Uses a single Supabase client with the **service role key** (admin privileges). Auth is validated server-side via `supabase.auth.get_user(token)` on each protected request.

Auth levels: `—` = public · `🔑` = authenticated user · `👑` = admin · `?` = optional (user info used if present)

#### `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Create account + default profile |
| POST | `/api/auth/login` | — | Sign in, returns `{ user, token }` |
| GET | `/api/auth/me` | 🔑 | Get current user profile |
| POST | `/api/auth/avatar` | 🔑 | Upload avatar (base64 → Supabase Storage) |
| PUT | `/api/auth/profile` | 🔑 | Update name / bio |

#### `/api/posts`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/posts/` | ? | Cursor-paginated feed (`limit`, `cursor`, `tags` query params) |
| POST | `/api/posts/` | 🔑 | Create post |
| PATCH | `/api/posts/{post_id}` | 🔑 | Edit post content / image |
| DELETE | `/api/posts/{post_id}` | 🔑 | Delete post |
| POST | `/api/posts/{post_id}/pin` | 🔑 | Toggle pin on post |
| POST | `/api/posts/{post_id}/react` | 🔑 | Add/change reaction |
| GET | `/api/posts/{post_id}/reactions` | — | List reactions |
| GET | `/api/posts/{post_id}/comments` | ? | List comments |
| POST | `/api/posts/{post_id}/comments` | 🔑 | Add comment |
| POST | `/api/posts/{post_id}/comments/{comment_id}/react` | 🔑 | React to comment |
| GET | `/api/posts/{post_id}/comments/{comment_id}/reactions` | — | List comment reactions |

#### `/api/courses`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/courses/` | — | List all courses |
| POST | `/api/courses/` | 🔑 | Create course |
| POST | `/api/courses/thumbnail` | 🔑 | Upload thumbnail (base64 → Supabase Storage) |
| PUT | `/api/courses/{course_id}` | 🔑 | Update course (title, description, thumbnail, category) |
| GET | `/api/courses/{course_id}/chapters` | — | List chapters (ordered by sort_order) |
| POST | `/api/courses/{course_id}/chapters` | 🔑 | Add chapter |
| PUT | `/api/courses/{course_id}/chapters/{chapter_id}` | 🔑 | Edit chapter (title, videoUrl, duration) |

#### `/api/tags`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/tags/` | — | List all tags |
| POST | `/api/tags/` | 🔑 | Create tag |
| DELETE | `/api/tags/{tag_id}` | 🔑 | Delete tag |

#### `/api/invitations`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/invitations/` | 👑 | Generate invite link |
| GET | `/api/invitations/` | 👑 | List all invitations |
| DELETE | `/api/invitations/{invitation_id}` | 👑 | Delete invitation |
| GET | `/api/invitations/validate` | — | Validate invite token (`?token=`) |
| POST | `/api/invitations/use` | — | Mark invite token as used |

#### `/api/payments`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/payments/upload-receipt` | — | Upload receipt image (base64 → Supabase Storage), returns `{ path }` |
| POST | `/api/payments/register` | — | Register account + payment in one step (wizard flow) |
| GET | `/api/payments/` | 👑 | List all payments (admin panel) |
| GET | `/api/payments/{user_id}` | 🔑 | Get payments for a specific user |
| PATCH | `/api/payments/{payment_id}/approve` | 👑 | Approve payment (triggers `sync_subscription_status`) |
| PATCH | `/api/payments/{payment_id}/reject` | 👑 | Reject payment |
| GET | `/api/payments/{payment_id}/receipt` | 👑 | Get signed URL for receipt image |

#### `/api/levels` — Gamificación
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/levels/tiers` | — | Lista todos los rangos de nivel |
| GET | `/api/levels/me` | 🔑 | Nivel, XP y tier actual del usuario autenticado. Returns `{ user_id, level, xp_total, xp_current, xp_next, tier? }` |
| GET | `/api/levels/me/achievements` | 🔑 | Logros obtenidos por el usuario autenticado |
| GET | `/api/levels/me/xp-history` | 🔑 | Historial de XP paginado (`?limit=20&offset=0`) |
| GET | `/api/levels/{user_id}` | — | Nivel y tier de cualquier usuario (perfil ajeno) |
| POST | `/api/levels/award` | 🔑 | Procesa un logro para el usuario autenticado. Body: `{ achievement_code, metadata? }`. Llamar desde otros endpoints, no directamente desde el cliente. |

#### `/api/achievements`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/achievements/` | — | Catálogo público de todos los logros activos |

#### `/api/admin/levels` — Admin gamificación
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/levels/users` | 👑 | Lista todos los usuarios con su nivel y XP |
| POST | `/api/admin/levels/award` | 👑 | Otorga XP manualmente. Body: `{ user_id, xp_amount, reason }` |
| GET | `/api/admin/levels/tiers` | 👑 | Lista rangos de nivel |
| POST | `/api/admin/levels/tiers` | 👑 | Crea nuevo rango |
| PATCH | `/api/admin/levels/tiers/{tier_id}` | 👑 | Edita rango existente |
| POST | `/api/admin/levels/tiers/icon` | 👑 | Sube icono al bucket `level-tier-icons`. Body: `{ imageData }` → `{ url }` |

#### `/api/admin/achievements` — Admin logros
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/achievements/` | 👑 | Lista todos los logros incluyendo inactivos |
| POST | `/api/admin/achievements/` | 👑 | Crea nuevo tipo de logro |
| PATCH | `/api/admin/achievements/{achievement_id}` | 👑 | Edita logro existente |
| POST | `/api/admin/achievements/icon` | 👑 | Sube icono al bucket `achievement-icons`. Body: `{ imageData }` → `{ url }` |

### Frontend (`src/`)

React 19 SPA with `react-router-dom`, feature-based folder structure:

```
src/
  context/AuthContext.tsx        — global auth state (user, token, updateUser, login, logout)
  lib/
    api.ts                       — apiFetch(), useApiFetch() hook, API_BASE constant
    permissions.ts               — isAdmin(), needsActiveSubscription(), hasActiveSubscription()
  routes/index.tsx               — authRoutes + appRoutes arrays (react-router-dom Route definitions)
  features/
    auth/
      Login.tsx                  — login form
      Register.tsx               — 3-step payment-registration wizard (plan → payment → receipt upload)
      InviteRegister.tsx         — register via invitation link (auto-login after register)
      AccountStatus.tsx          — subscription gating screen for inactive/pending/expired accounts
    landing/                     — pre-auth landing page
    muro/                        — social feed (PostFeed, PostCard, CommentSection, CreatePost)
    classroom/                   — courses list + detail (CourseCard, CourseDetail, CreateCourseSheet)
    profile/                     — user profile page with sub-components
    admin/                       — admin dashboard (InvitationsPanel, PaymentsPanel, tabs)
  shared/layout/Layout.tsx       — nav shell (sidebar desktop + bottom nav mobile)
  types.ts                       — shared TypeScript interfaces
```

### Auth & routing flow

`App.tsx` contains three render branches:

1. **Not authenticated** (`!isAuthenticated`) → renders auth routes (landing / login / register / invite)
2. **Authenticated but subscription not active** (`needsActiveSubscription(role) && !hasActiveSubscription(subscription_status)`) → renders `<AccountStatus />` (gating screen)
3. **Authenticated + active** → renders `<Layout>` with app routes (muro, classroom, profile, admin)

JWT token stored in `localStorage` under `edu_token`, user object under `edu_user`. Both are read synchronously at mount via `useState` lazy initializers in `AuthProvider`.

`isAuthenticated` is derived from `!!user` (not from token). Always ensure `login(user, token)` is called together — never call `updateUser()` as a substitute for `login()`.

### Subscription & payments

Users have a `subscription_status` field on their `profiles` row: `inactive | active | expired`.

A Postgres trigger (`sync_subscription_status`) on the `payments` table automatically recalculates and writes `profiles.subscription_status` whenever a payment row is inserted or updated.

Payment statuses: `pending` (awaiting admin review) → `success` (approved, sets `expires_at`) or `failed` (rejected).

Roles that require an active subscription: `miembro`. Roles exempt from gating: `admin`, `superadmin`.

### Profile page

- **Real data**: level/XP (`GET /api/levels/me`) and achievements (`GET /api/levels/me/achievements`) are fetched in `Profile.tsx` on mount and passed as props to `ProfileLevelCard` and `ProfileAchievements`.
- **Mock data**: ranking, activity, and XP breakdown table remain static in `src/features/profile/data/profileMock.ts`.
- `ProfileStatsGrid` receives `badgeCount` prop with the real count of earned achievements.
- Personal data fields (`gender`, `city`, `phone`) come from the user object via `AuthContext` and are saved via `PUT /api/auth/profile`.

### Data patterns

- `API_BASE` is `import.meta.env.VITE_API_URL ?? ""`. When set, the browser calls the Python backend directly (cross-origin). When empty, requests go through the Express proxy (same-origin).
- **Always use trailing slashes** on collection endpoints: `/api/posts/`, `/api/tags/`, `/api/courses/`, `/api/payments/`, `/api/invitations/`, `/api/achievements/`, `/api/admin/achievements/`. The FastAPI routes are defined with a trailing slash — omitting it causes a 307 redirect, and the browser strips the `Authorization` header on cross-origin redirects.
- Use `useApiFetch()` hook (not bare `apiFetch`) for authenticated requests — it injects the token automatically.
- Posts use cursor-based pagination (cursor = `created_at` of last item).
- `posts_view` is a Supabase SQL view that joins posts with profiles — query it directly instead of joining in code.
- Supabase auth uses the **admin API** server-side so email confirmation is bypassed on register.
