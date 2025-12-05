# 🎃 Kiroween Hackathon Submission

A haunting showcase of three distinct challenges brought to life through code, AI, and spooky design.

---

## 🧟 Frankenstein: Technology Chimera

**The Challenge:** Stitch together a chimera of technologies into one app. Bring together seemingly incompatible elements to build something unexpectedly powerful.

**My Creation:** We've merged Python FastAPI backends with React/TypeScript frontends, integrated OpenAI's GPT models with custom logic engines, and combined real-time AI processing with polished UI/UX. The result? Two distinct applications that seamlessly blend:
- 🐍 Python + FastAPI (Backend)
- ⚛️ React + TypeScript/JSX (Frontend)
- 🤖 OpenAI GPT-4 (AI Intelligence)
- 🎨 TailwindCSS + Custom Animations (Spooky UI)
- ☁️ Railway + Netlify (Cloud Deployment)

---

## 💀 Skeleton Crew: Versatile Foundation

**The Challenge:** Build a skeleton code template lean enough to be clear but flexible enough to support various use cases. Show its versatility with two distinct applications from your foundation.

**Our Foundation:** The `Skeleton` directory contains our reusable template featuring:
- Modular FastAPI architecture with routers and core utilities
- Environment-based configuration
- OpenAI integration patterns
- Encryption utilities for secure API key management
- Clean separation of concerns

**Two Distinct Applications Built From One Skeleton:**

### 🧠 [Logic Hinter](https://app1kiro.netlify.app/)
An AI-powered logic puzzle assistant that helps you solve complex reasoning challenges. Get hints, validate solutions, and sharpen your logical thinking skills with a spooky twist.

**Features:**
- Interactive logic puzzle solver
- Progressive hint system
- Real-time AI feedback
- Haunting purple-themed interface

### 📚 [Study Hinter](https://app2kiro.netlify.app/)
An intelligent study companion that generates personalized quiz questions and provides adaptive learning guidance. Transform any topic into an engaging learning experience.

**Features:**
- AI-generated quiz questions
- Adaptive difficulty levels
- Instant feedback and explanations
- Eerie green-themed design

---

## 👻 Costume Contest: Haunting UI/UX

**The Challenge:** Build any app but show us a haunting user interface that's polished and unforgettable. Bring in spooky design elements that enhance your app's function.

**Our Spooky Design Elements:**
- 🌙 Dark, atmospheric color schemes (purple for Logic, green for Study)
- ✨ Smooth fade-in animations and transitions
- 🕸️ Glowing effects and shadow layers
- 💀 Themed emoji and iconography
- 🎭 Polished, professional layouts with Halloween flair
- 🌫️ Gradient backgrounds that evoke mystery

Both applications feature carefully crafted interfaces that don't just look spooky—they enhance usability through thoughtful design choices, smooth interactions, and clear visual hierarchy.

---

## 🚀 Live Demos

Experience the apps yourself:

- **Logic Hinter:** [https://app1kiro.netlify.app/](https://app1kiro.netlify.app/)
- **Study Hinter:** [https://app2kiro.netlify.app/](https://app2kiro.netlify.app/)

---

## 🛠️ Technical Architecture

```
├── Skeleton/              # Reusable template foundation
│   ├── app/
│   │   ├── core/         # Shared utilities
│   │   ├── routers/      # API route templates
│   │   └── main.py       # FastAPI application
│   └── scripts/          # Utility scripts
│
├── app1-LogicHinter/     # Logic puzzle application
│   ├── backend/          # Python FastAPI
│   └── frontend/         # React + TypeScript
│
└── app2-StudyHinter/     # Study quiz application
    ├── backend/          # Python FastAPI
    └── frontend/         # React + JSX
```

---

## 🎯 What Makes This Special

1. **True Versatility:** One skeleton, two completely different applications with distinct purposes
2. **AI-Powered:** Leveraging GPT-4 for intelligent, context-aware responses
3. **Production-Ready:** Deployed and accessible with proper CI/CD pipelines
4. **Design Excellence:** Spooky aesthetics that enhance rather than distract
5. **Clean Code:** Modular, maintainable, and well-documented

---

## 🧪 Local Development

Each application can be run independently:

### Backend Setup
```bash
cd app1-LogicHinter/backend  # or app2-StudyHinter/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd app1-LogicHinter/frontend  # or app2-StudyHinter/frontend
npm install
npm run dev
```

---

## 🏆 Hackathon Categories Completed

- ✅ **Frankenstein:** Multi-technology integration
- ✅ **Skeleton Crew:** Reusable template with two applications
- ✅ **Costume Contest:** Polished, haunting UI/UX

---

**Built with 💀 for Kiroween Hackathon**
