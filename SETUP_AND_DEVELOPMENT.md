# 🚀 Setup & Development Guide

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- Groq API key (get from [groq.com](https://groq.com/))

---

## 🔙 Backend Setup

### 1. Navigate to Backend
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
# Create .env file
cat > .env << EOF
GROQ_API_KEY=your_groq_api_key_here
GUARDIAN_API_KEY=your_guardian_key_here
NEWSDATA_API_KEY=your_newsdata_key_here
EOF
```

### 5. Run Backend
```bash
python -m uvicorn api:app --reload --port 8000
```

**Backend runs on**: `http://localhost:8000`

### Backend API Documentation
Once running, visit: `http://localhost:8000/docs` (Swagger UI)

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend
```bash
cd frontend/ai-lumina-vision
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:8000
EOF
```

### 4. Run Frontend
```bash
npm run dev
```

**Frontend runs on**: `http://localhost:5173`

---

## 🌐 Access the Application

1. Open browser: `http://localhost:5173`
2. Select your role (Institute Owner, Founder, Backend Developer, etc.)
3. View the Morning Pulse Report
4. Explore all features:
   - Dashboard overview
   - Morning Pulse Report
   - Competitor Radar
   - Trend Forecasts
   - 7-Day Action Plans
   - AI Chatbot

---

## 📁 Project Structure

### Backend Files
```
backend/
├── api.py                    # FastAPI endpoints
├── scraper.py               # News scraping
├── cleaner.py               # Deduplication
├── ranker.py                # Article ranking
├── groq_processor.py         # AI analysis
├── competitor_tracker.py     # Competitor monitoring
├── pdf_report.py             # PDF generation
├── chatbot.py                # AI chatbot
├── video_generator.py        # Video briefing
├── whatsapp_sender.py        # WhatsApp integration
├── scheduler.py              # Email scheduling
├── mailer.py                 # Email service
├── parser.py                 # Data parsing
├── requirements.txt          # Dependencies
└── .env                      # Environment variables
```

### Frontend Files
```
frontend/ai-lumina-vision/src/
├── routes/                   # Dashboard pages
│   ├── __root.tsx           # Root layout
│   ├── index.tsx            # Home page
│   ├── dashboard.tsx        # Dashboard layout
│   ├── dashboard.index.tsx  # Overview
│   ├── dashboard.reports.tsx # Morning Pulse
│   ├── dashboard.competitors.tsx # Competitor Radar
│   ├── dashboard.trends.tsx # Trends
│   ├── dashboard.recommendations.tsx # Action Plans
│   ├── dashboard.settings.tsx # Settings
│   └── dashboard.chatbot.tsx # Chatbot
├── components/              # UI components
├── context/                 # State management
├── lib/                     # API client & utils
└── styles/                  # CSS
```

---

## 🔌 API Endpoints

### Reports
- `GET /report?role=Institute Owner` - Get morning pulse report
- `GET /download-report?role=Institute Owner` - Download PDF
- `GET /action-plan?role=Institute Owner` - Get 7-day action plan

### Competitor Intelligence
- `GET /competitor-alerts?role=Institute Owner` - Competitor moves
- `GET /competitor-summary?role=Institute Owner` - Competitor summary

### Trends
- `GET /trends-forecast?role=Institute Owner` - Trend forecasts

### Chat & Communication
- `POST /chat` - AI chatbot
- `POST /send-email` - Send report via email
- `POST /send-whatsapp` - Send report via WhatsApp

### Video & Media
- `GET /generate-video?role=Institute Owner` - Generate video
- `GET /serve-video/{filename}` - Stream video

### Cache Management
- `GET /cache-status` - Check cache
- `POST /clear-cache` - Clear cache

### Health
- `GET /health` - Health check

---

## 🛠️ Development Commands

### Backend
```bash
# Run with auto-reload
python -m uvicorn api:app --reload --port 8000

# Run tests (if available)
pytest

# Format code
black .

# Lint code
flake8 .
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Required
GROQ_API_KEY=your_groq_api_key

# Optional (for additional features)
GUARDIAN_API_KEY=your_guardian_key
NEWSDATA_API_KEY=your_newsdata_key
```

### Frontend (.env)
```env
# Required
VITE_API_URL=http://localhost:8000

# Optional
VITE_DEBUG=false
```

---

## 🚢 Deployment

### Backend Deployment (Docker)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use**
```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Groq API errors**
- Verify API key in .env
- Check Groq API status
- Ensure rate limits not exceeded

**Import errors**
- Ensure all files are in backend/ root
- Check Python path: `python -c "import sys; print(sys.path)"`

### Frontend Issues

**Port 5173 already in use**
```bash
npm run dev -- --port 5174
```

**API connection errors**
- Verify backend is running on port 8000
- Check VITE_API_URL in .env
- Check browser console for CORS errors

**Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Performance Tips

### Backend
- Use caching (2-hour TTL)
- Batch API requests
- Use connection pooling
- Monitor Groq API usage

### Frontend
- Use React.memo for expensive components
- Lazy load routes
- Optimize images
- Use production build for deployment

---

## 🔍 Debugging

### Backend Debugging
```python
# Add logging
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.debug("Debug message")

# Use debugger
import pdb; pdb.set_trace()
```

### Frontend Debugging
```typescript
// Console logging
console.log("Debug:", data);

// React DevTools
// Install React DevTools browser extension

// Network tab
// Check browser DevTools Network tab for API calls
```

---

## 📚 Additional Resources

- [README.md](README.md) - Project overview
- [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) - Folder organization
- [GITIGNORE_SETUP.md](GITIGNORE_SETUP.md) - Git configuration
- [Groq API Docs](https://console.groq.com/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [TanStack Router Docs](https://tanstack.com/router/latest)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and test
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## ✅ Checklist Before Deployment

- [ ] Backend .env configured with API keys
- [ ] Frontend .env configured with API URL
- [ ] All dependencies installed
- [ ] No console errors
- [ ] All features tested
- [ ] .gitignore properly configured
- [ ] No secrets committed
- [ ] Build succeeds without errors
- [ ] Performance acceptable
- [ ] Documentation updated

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Review README.md
3. Check FOLDER_STRUCTURE.md
4. Open an issue on GitHub

---

**Last Updated**: April 26, 2026
**Status**: ✅ Production Ready
