# 📁 Project Folder Structure

## Overview
Campus Cortex AI is organized with a clean, production-ready structure separating frontend and backend concerns.

---

## 🏗️ Root Directory Structure

```
campus-cortex-ai/
├── backend/                          # Python FastAPI backend
├── frontend/                         # React TypeScript frontend
├── ffmpeg/                           # FFmpeg source (external)
├── ffmpeg-8.1/                       # FFmpeg build (external)
├── scrape/                           # Scraping utilities
├── .git/                             # Git repository
├── .vscode/                          # VS Code settings
├── .gitignore                        # Global git ignore
├── README.md                         # Project documentation
├── FOLDER_STRUCTURE.md               # This file
├── PROJECT_CLEANUP_SUMMARY.md        # Cleanup report
├── GITIGNORE_SETUP.md                # .gitignore guide
├── GITIGNORE_QUICK_REFERENCE.md      # .gitignore quick ref
└── avatar.avif                       # Project avatar
```

---

## 🔙 Backend Structure

### Location: `backend/`

```
backend/
├── .gitignore                        # Backend-specific git ignore
├── requirements.txt                  # Python dependencies
├── .env                              # Environment variables (not committed)
│
├── Core API & Pipeline
├── api.py                            # FastAPI main application
├── main_pipeline.py                  # Pipeline orchestration
│
├── Data Processing
├── scraper.py                        # News scraping (10+ sources)
├── cleaner.py                        # Article deduplication
├── ranker.py                         # Article ranking & scoring
├── parser.py                         # Data parsing utilities
│
├── AI & Analysis
├── groq_processor.py                 # Groq AI analysis (PRIMARY)
├── gemini_processor.py               # Legacy Gemini (reference)
├── deepseek_processor.py             # Legacy DeepSeek (reference)
├── hybrid_ai_processor.py            # Legacy hybrid (reference)
│
├── Features & Integrations
├── competitor_tracker.py             # Competitor monitoring
├── pdf_report.py                     # PDF report generation
├── chatbot.py                        # AI chatbot interface
├── video_generator.py                # Video briefing generation
├── whatsapp_sender.py                # WhatsApp integration
├── mailer.py                         # Email service
├── scheduler.py                      # Email scheduling
│
├── Generated Files (git-ignored)
├── generated_videos/                 # Generated video files
├── served_pdfs/                      # Generated PDF files
├── Morning_Pulse_Report.json         # Generated report
├── scheduled_role.json               # Scheduled roles config
└── __pycache__/                      # Python cache (git-ignored)
```

### Backend File Descriptions

| File | Purpose |
|------|---------|
| **api.py** | FastAPI application with all endpoints, caching, and background jobs |
| **scraper.py** | Scrapes news from 10+ sources in parallel |
| **cleaner.py** | Deduplicates articles by title and link |
| **ranker.py** | Scores articles by recency, impact, source, role relevance |
| **groq_processor.py** | AI analysis using Groq API (llama-3.3-70b-versatile) |
| **competitor_tracker.py** | Tracks competitor moves and alerts |
| **pdf_report.py** | Generates PDF reports with charts and insights |
| **chatbot.py** | AI chatbot for Q&A about reports |
| **video_generator.py** | Creates video briefings using FFmpeg |
| **whatsapp_sender.py** | Sends reports via WhatsApp |
| **mailer.py** | Email service for sending reports |
| **scheduler.py** | APScheduler for automated email reports |
| **parser.py** | Utility functions for data parsing |

---

## 🎨 Frontend Structure

### Location: `frontend/ai-lumina-vision/`

```
frontend/ai-lumina-vision/
├── .gitignore                        # Frontend-specific git ignore
├── .env                              # Environment variables (not committed)
├── package.json                      # Node dependencies
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite build configuration
├── eslint.config.js                  # ESLint configuration
├── .prettierrc                        # Prettier formatting
├── components.json                   # Component library config
│
├── src/                              # Source code
│   ├── router.tsx                    # TanStack Router setup
│   ├── routeTree.gen.ts              # Auto-generated route tree
│   │
│   ├── routes/                       # Page components
│   │   ├── __root.tsx                # Root layout & providers
│   │   ├── index.tsx                 # Home page
│   │   ├── dashboard.tsx             # Dashboard layout
│   │   ├── dashboard.index.tsx       # Overview page
│   │   ├── dashboard.reports.tsx     # Morning Pulse Report
│   │   ├── dashboard.competitors.tsx # Competitor Radar
│   │   ├── dashboard.trends.tsx      # Trend Forecasts
│   │   ├── dashboard.recommendations.tsx # 7-Day Action Plans
│   │   ├── dashboard.settings.tsx    # Settings page
│   │   └── dashboard.chatbot.tsx     # AI Chatbot page
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── DashboardLayout.tsx       # Dashboard wrapper
│   │   ├── AIChatbot.tsx             # Chatbot component
│   │   ├── RoleSelector.tsx          # Role selection UI
│   │   ├── AnimatedCounter.tsx       # Animated number display
│   │   ├── HeroGlobe.tsx             # 3D globe visualization
│   │   ├── ParticleBackground.tsx    # Particle effect background
│   │   └── VideoBriefing.tsx         # Video player component
│   │
│   ├── context/                      # State management
│   │   ├── RoleContext.tsx           # Role selection state
│   │   ├── DataContext.tsx           # Report data state
│   │   ├── ThemeContext.tsx          # Theme (light/dark) state
│   │   └── ChatHistoryContext.tsx    # Chat history state
│   │
│   ├── lib/                          # Utilities & API client
│   │   ├── api.ts                    # API client functions
│   │   └── utils.ts                  # Helper utilities
│   │
│   └── styles/                       # Stylesheets
│       └── styles.css                # Global styles (Tailwind)
│
├── public/                           # Static assets
│   ├── favicon.svg                   # Favicon
│   └── icons.svg                     # Icon sprite
│
├── dist/                             # Build output (git-ignored)
│   ├── client/                       # Client bundle
│   └── server/                       # Server bundle
│
├── node_modules/                     # Dependencies (git-ignored)
├── .tanstack/                        # TanStack cache (git-ignored)
├── .wrangler/                        # Wrangler cache (git-ignored)
└── index.html                        # HTML entry point
```

### Frontend File Descriptions

| File | Purpose |
|------|---------|
| **routes/__root.tsx** | Root layout with providers (Theme, Role, Data, Chat) |
| **routes/index.tsx** | Home/landing page |
| **routes/dashboard.tsx** | Dashboard layout wrapper |
| **routes/dashboard.index.tsx** | Overview with KPIs and market signals |
| **routes/dashboard.reports.tsx** | Main Morning Pulse Report view |
| **routes/dashboard.competitors.tsx** | Competitor radar and tracking |
| **routes/dashboard.trends.tsx** | Trend forecasts and analysis |
| **routes/dashboard.recommendations.tsx** | 7-day action plans by role |
| **routes/dashboard.settings.tsx** | User settings and preferences |
| **routes/dashboard.chatbot.tsx** | AI chatbot interface |
| **components/DashboardLayout.tsx** | Dashboard navigation and layout |
| **components/AIChatbot.tsx** | Chatbot UI component |
| **components/RoleSelector.tsx** | Role selection dropdown |
| **context/RoleContext.tsx** | Role state management |
| **context/DataContext.tsx** | Report data fetching and caching |
| **context/ThemeContext.tsx** | Light/dark theme state |
| **context/ChatHistoryContext.tsx** | Chat message history |
| **lib/api.ts** | API client with all endpoints |
| **lib/utils.ts** | Helper functions |

---

## 📊 Data Flow

### Backend Data Flow
```
scraper.py (10+ sources)
    ↓
cleaner.py (deduplication)
    ↓
ranker.py (scoring)
    ↓
groq_processor.py (AI analysis)
    ↓
api.py (cache & serve)
    ↓
Frontend
```

### Frontend Data Flow
```
RoleContext (role selection)
    ↓
DataContext (fetch from API)
    ↓
Components (render data)
    ↓
User sees report
```

---

## 🔄 Import Paths

### Backend Imports
```python
# All files in backend/ can import from each other directly
from scraper import scrape_news
from groq_processor import analyze
from pdf_report import build_pdf
```

### Frontend Imports
```typescript
// Use @ alias for src/ directory
import { useRole } from "@/context/RoleContext";
import { useData } from "@/context/DataContext";
import { api } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";
```

---

## 🚀 Build & Deployment

### Backend Build
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn api:app --host 0.0.0.0 --port 8000
```

### Frontend Build
```bash
cd frontend/ai-lumina-vision
npm install
npm run build
# Output: dist/ folder
```

---

## 📝 Configuration Files

### Backend
- `.env` - API keys, database URLs
- `requirements.txt` - Python dependencies
- `.gitignore` - Git ignore rules

### Frontend
- `.env` - API URL, feature flags
- `package.json` - Node dependencies
- `tsconfig.json` - TypeScript config
- `vite.config.ts` - Build configuration
- `eslint.config.js` - Linting rules
- `.prettierrc` - Code formatting

---

## 🗑️ Git-Ignored Directories

### Backend
```
__pycache__/
*.pyc
venv/
.env
generated_videos/
served_pdfs/
Market-Intelligence---The-Morning-Pulse-AI-Engine-/
```

### Frontend
```
node_modules/
dist/
.cache/
.env
.tanstack/
.wrangler/
npm-debug.log*
```

---

## ✅ Verification Checklist

- ✅ All Python files in `backend/` root
- ✅ No duplicate files
- ✅ Frontend organized by feature (routes, components, context, lib)
- ✅ All imports use correct paths
- ✅ No circular dependencies
- ✅ .gitignore properly configured
- ✅ No generated files committed
- ✅ No node_modules committed
- ✅ No __pycache__ committed
- ✅ .env files not committed

---

## 📚 Related Documentation

- [README.md](README.md) - Project overview
- [GITIGNORE_SETUP.md](GITIGNORE_SETUP.md) - .gitignore details
- [PROJECT_CLEANUP_SUMMARY.md](PROJECT_CLEANUP_SUMMARY.md) - Cleanup report

---

**Status**: ✅ Production-Ready
**Last Updated**: April 26, 2026
