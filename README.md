# Milo — Your Personal AI

A private personal AI agent frontend — one user, one agent (**Novi**), one persistent memory, one calm workspace.

> "Your personal AI, always one step ahead." — simple on the surface, intelligent underneath.

## Status

Frontend-only build (Phase 1–4 of the master plan). The app runs fully standalone in **demo mode** with a
localStorage-backed data store; the same hooks already call real REST endpoints when the backend arrives.

## Stack (matches SmartOps-Pay engineering conventions)

| Concern | Choice |
|---|---|
| Build | Vite 8 |
| UI | React 19, MUI 9 + Emotion, react-icons |
| Data | TanStack Query 5, Axios, Formik, date-fns |
| Routing | react-router-dom 7 (`createBrowserRouter` + guards) |
| Feedback | react-toastify |

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run lint       # eslint
```

Demo sign-in: any email + any password (see the note on the login screen).

## Architecture

```
src/
├── main.jsx                 # entry: QueryClient + ThemeProvider
├── App.jsx                  # router, guards, ToastContainer, lazy pages
├── theme.js                 # MUI theme (Milo palette + Manrope, dark mode)
├── App.css                  # design tokens, fonts, calm animations
├── Api/
│   ├── ApiClient.jsx        # axios instance + auth/refresh interceptors
│   └── Api.jsx              # every useQuery/useMutation hook, demo↔real branch
├── common/
│   ├── Layout.jsx           # shell: sidebar, navbar, drawer, bottom nav
│   ├── Navbar.jsx           # title, notifications bell, profile menu
│   ├── Sidebar.jsx          # AI identity + navigation
│   ├── BottomNav.jsx        # mobile bottom navigation
│   ├── MenuList.jsx         # nav config
│   ├── AppIcon.jsx          # icon map
│   ├── Gaurd.jsx            # AuthGaurd / LogGaurd
│   └── custom/              # Formik-aware CustomInput / CustomSelect / CustomModal
├── models/AllModels.jsx     # shared modals (LogoutModal, ConfirmDialog)
├── components/              # MiloLogo, AuthLayout, AgentAvatar, ChatMessage, ChatInput,
│                            # ConversationList, TaskItem, TaskForm, GoalCard, GoalForm,
│                            # MemoryItem, MemoryForm, NotificationItem, EmptyState, PageHeader
├── pages/
│   ├── auth/                # Login (email/mobile), Register (name, mobile, email, timezone)
│   ├── home/Today.jsx       # greeting, priority summary, Novi briefing, tasks, upcoming,
│   │                        # goals, Milo noticed, quick actions, Ask Milo
│   ├── chat/Chat.jsx        # streaming chat, history, message actions
│   ├── tasks/Tasks.jsx      # create/edit/complete/delete, priorities, due dates
│   ├── goals/Goals.jsx      # goals, progress, steps
│   ├── memory/Memory.jsx    # search, categories, edit/forget
│   ├── settings/Settings.jsx# Account / Milo / Notifications / Privacy / Appearance / actions
│   └── NotFound.jsx
└── utils/
    ├── demoStore.js         # localStorage data layer + seed data
    ├── demoAi.js            # demo responder: intents, tasks, memory, planning
    ├── markdown.jsx         # tiny dependency-free markdown renderer
    ├── date.js              # date-fns helpers
    └── constants.js         # priorities, categories, avatars
```

## Demo mode vs. real backend

`src/Api/Api.jsx` reads `VITE_DEMO_MODE` (default `true`). In demo mode every hook reads/writes
`src/utils/demoStore.js` (localStorage); with the flag off, the same hooks call the real endpoints
(`/auth`, `/agent`, `/chat`, `/tasks`, `/goals`, `/memory`, `/notifications`) through `ApiClient.jsx`.

```bash
# .env.local
VITE_BASEURL=http://localhost:3001/api
VITE_DEMO_MODE=false
```

The demo AI is explicitly honest: it says it's a demo, and it can already create tasks from
natural language ("remind me to call Rahul next Tuesday"), save/forget memories, list tasks, and plan the day.

## Design

Independent visual identity — warm neutrals, one calm clay accent, Manrope type, generous whitespace.
Rectangular cards (8–16px radii, thin borders), no ovals or pill containers, dark mode (light/system/dark).
Responsive: sidebar on desktop, drawer + bottom nav on mobile, `prefers-reduced-motion` respected,
keyboard shortcuts (`/` focuses chat, Enter sends, Shift+Enter newline).

## What's marked "Coming soon"

Calendar, email, integrations (Google/Notion/Todoist/Slack/GitHub), browser notifications,
knowledge uploads, multi-agent orchestration, and autonomous mode. The permission model and
integration abstraction are already in place so they can slot in cleanly.
