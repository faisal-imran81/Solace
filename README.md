<div align="center">

# 🧠 Solace

### AI-powered Mental Wellness Companion

> Solace is a global mental health platform that connects people to AI-powered emotional support, mood tracking, journaling, and an anonymous community — **anytime, anywhere, judgement-free.**

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-00C7B7?style=for-the-badge&logo=vercel&logoColor=white&labelColor=0d0d0d)](https://solace-web-fm4f-gamma.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white&labelColor=0d0d0d)](https://github.com/faisal-imran81/Solace)
[![Backend API](https://img.shields.io/badge/API-Railway-8B5CF6?style=for-the-badge&logo=railway&logoColor=white&labelColor=0d0d0d)](https://web-production-cbf5d.up.railway.app)

<br/>

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-FF6600?style=flat-square&logo=groq&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_7-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)

</div>

---

## 🌟 Why Solace?

Mental health care is a **privilege** — expensive, inaccessible, and often surrounded by stigma. In many parts of the world, a therapist is hours away or entirely out of reach. Solace exists to close that gap.

- 🌍 **Accessible** — anyone with a browser gets immediate emotional support, free of charge.
- 🔒 **Private** — anonymous by design, no judgement, no shame.
- ⚡ **Instant** — a supportive voice, available 24/7, in seconds.
- 💜 **Safe** — crisis detection built in, connecting you to real human helplines when it matters most.

> Solace isn't a replacement for professional care — it's a compassionate first step, and a constant companion along the way.

---

## 📸 Screenshots

| Landing Page | AI Chat |
|:---:|:---:|
| `[Screenshot: Landing Page]` | `[Screenshot: AI Chat]` |

| Mood Tracker | Journal & Reflection |
|:---:|:---:|
| `[Screenshot: Mood Tracker]` | `[Screenshot: AI Journal]` |

| Wellness Dashboard | Sign In |
|:---:|:---:|
| `[Screenshot: Dashboard]` | `[Screenshot: Auth]` |

---

## ✨ Features

### 🌐 3D Animated Landing Page
A cinematic first impression — a Three.js **brain orb**, Framer Motion scroll animations, glassmorphism panels, and gradient glow that sets the calm tone for the entire product.

### 💬 AI Chat with Real-Time Streaming
- **LLaMA 3.1 (8B)** served through Groq — streaming responses delivered token-by-token over **SSE**.
- Chat history **sidebar** with pin 📌, share 🔗, and delete 🗑️.
- Warm, supportive, conversational AI persona.

### 🆘 Crisis Detection
Keyword-based detection that instantly surfaces a **mental health crisis banner** with direct links to **988 (US)** and **befrienders.org** — because safety always comes first.

### 📊 Mood Tracker
Log how you feel daily with a tap — five emoji states from 😔 to 😄, visualized in an animated **7-day bar chart** with hover tooltips.

### 📝 AI Journal
- Distraction-free **rich editor** with word count and read-time.
- **AI sentiment analysis** (Positive / Neutral / Difficult) powered by Groq.
- **AI reflection prompts** that help you process, not just record.
- Pin, search, and delete to curate your private space.

### 🏠 Wellness Dashboard
- Animated **Wellness Score** ring with a satisfying count-up.
- Mood trend chart, daily **AI affirmation**, recent entries & sessions.
- **4-7-8 breathing exercise** widget to calm anxiety in minutes.
- Quick actions to jump into chat, journaling, or mood logging.

### 🔐 Authentication
Clerk-powered sign-in/sign-up, protected routes, and automatic user sync to the database — so every user gets their own private, isolated workspace.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Three.js / React Three Fiber |
| **UI** | Glassmorphism design system · shadcn/ui primitives · lucide-react icons |
| **Backend** | FastAPI (Python) · Groq API (LLaMA 3.1 8b Instant) |
| **Database** | PostgreSQL (Supabase) · Prisma v7 ORM · Driver adapters (`@prisma/adapter-pg`) |
| **Auth** | Clerk |
| **Realtime** | SSE streaming from FastAPI to Next.js |
| **Monorepo** | Turborepo · pnpm workspaces |
| **Deployment** | Vercel (frontend) · Railway (backend) |

---

## 🚀 Local Development

### Prerequisites
- **Node.js** 18+ and **pnpm** 9+
- **Python** 3.10+ with `venv`
- A Supabase PostgreSQL database
- A [Groq API key](https://console.groq.com)
- A [Clerk application](https://dashboard.clerk.com)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/faisal-imran81/Solace.git
cd Solace
```

### 2️⃣ Install dependencies

```bash
pnpm install
```

### 3️⃣ Configure environment variables

```bash
# Frontend
cp apps/web/.env.example apps/web/.env.local

# Backend
cp apps/api/.env.example apps/api/.env
```

Fill in the values (see the [table below](#-environment-variables)).

### 4️⃣ Run Prisma migrations

```bash
cd apps/web
pnpm exec prisma migrate dev
```

This creates the tables, generates the Prisma client, and seeds your local database.

### 5️⃣ Start the backend (FastAPI)

```bash
cd apps/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 6️⃣ Start the frontend (Next.js)

```bash
cd apps/web
pnpm dev
```

Open **[http://localhost:3000](http://localhost:3000)** and you're in. 🎉

> 💡 **Tip:** run both with Turborepo from the repo root: `pnpm dev`

---

## 🔑 Environment Variables

### Frontend — `apps/web/.env.local`

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key from your Clerk dashboard | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key (server-side) | ✅ |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Path to your sign-in route (`/sign-in`) | ✅ |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Path to your sign-up route (`/sign-up`) | ✅ |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Where users land after signing in (e.g. `/chat`) | ✅ |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Where new users land after signing up | ✅ |
| `DATABASE_URL` | Supabase PostgreSQL connection string | ✅ |
| `DIRECT_URL` | Direct (non-pooled) connection string for Prisma migrations | ✅ |
| `NEXT_PUBLIC_API_URL` | Deployed FastAPI base URL (e.g. `https://web-production-cbf5d.up.railway.app`) — falls back to `http://localhost:8000` locally | ⚠️ |

### Backend — `apps/api/.env`

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | API key from [console.groq.com](https://console.groq.com) | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Used for Clerk token verification (optional) | ⚠️ |
| `CLERK_SECRET_KEY` | Used for Clerk token verification (optional) | ⚠️ |

---

## 📂 Project Structure

```
solace/
├── apps/
│   ├── web/                        # Next.js 16 frontend
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # User, MoodEntry, Journal, ChatSession, Message
│   │   │   └── migrations/
│   │   └── src/
│   │       ├── app/
│   │       │   ├── page.tsx        # 3D landing page
│   │       │   ├── chat/           # AI chat + streaming
│   │       │   ├── journal/        # AI journal + reflection
│   │       │   ├── mood/           # Mood tracker
│   │       │   ├── dashboard/      # Wellness dashboard
│   │       │   ├── sign-in/        # Clerk auth
│   │       │   ├── sign-up/
│   │       │   └── api/            # Next.js route handlers (Prisma CRUD)
│   │       ├── components/         # Landing & shared components
│   │       └── lib/                # prisma client, user sync, utils
│   └── api/                        # FastAPI backend
│       └── app/
│           ├── main.py             # App + CORS + routers
│           └── api/routes/
│               ├── chat.py         # Groq streaming (SSE)
│               └── journal.py      # Sentiment + reflection
├── packages/
│   ├── ui/                         # Shared UI components
│   ├── eslint-config/              # Shared ESLint config
│   └── typescript-config/          # Shared TS configs
├── package.json                    # Turborepo root
├── pnpm-workspace.yaml
└── turbo.json
```

---

## ☁️ Deployment

### Frontend → Vercel

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com).
2. Set the **Root Directory** to `apps/web`.
3. Add all frontend env variables from the table above.
4. In **Project Settings → Environment Variables**, set `NEXT_PUBLIC_API_URL` to your Railway backend URL.
5. Deploy — Vercel runs `prisma generate && next build` automatically. 🎉

> 🔐 **Note:** If you've configured Vercel's **Protected Branches**, the Vercel build preview URL uses `*.vercel.app`. Whitelist it in the backend CORS config (`apps/api/app/main.py`).

### Backend → Railway

1. Create a new project in [Railway](https://railway.app) and connect the `apps/api` directory.
2. Railway auto-detects FastAPI — set the start command to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
3. Add `GROQ_API_KEY` and any Clerk keys as Railway variables.
4. Deploy, then copy the generated URL (e.g. `https://web-production-cbf5d.up.railway.app`) into your Vercel `NEXT_PUBLIC_API_URL`.

> 🌐 **CORS:** Ensure your production frontend origin(s) are listed in `allow_origins` inside `apps/api/app/main.py`.

---

## 🤝 Contributing

Contributions are what make this community special. Here's how to get involved:

1. 🍴 **Fork** the repository
2. 🌿 Create a branch — `git checkout -b feature/amazing-idea`
3. ✍️ **Commit** your changes — `git commit -m "feat: add something amazing"`
4. 📤 **Push** — `git push origin feature/amazing-idea`
5. 🔁 Open a **Pull Request**

Every PR is welcome — features, bug fixes, docs, or ideas. Please keep the tone **compassionate**; this project is about people.

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

<div align="center">

### Built with ❤️ for mental health accessibility

> If you're struggling, you're not alone. In the US, call or text **988**. Worldwide, reach out at [befrienders.org](https://www.befrienders.org).

[![Live Demo](https://img.shields.io/badge/Try_Solace_Live-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white)](https://solace-web-fm4f-gamma.vercel.app)

</div>
