<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:87CEEB,100:764ba2&height=200&section=header&text=JobBridge&fontSize=80&fontColor=white&fontAlignY=38&desc=AI-Powered%20Job%20Discovery%20and%20Recruitment%20Platform&descAlignY=60&descSize=18" />

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-009688?style=for-the-badge)](https://job-bridge-one.vercel.app/)

<br/>


![React](https://img.shields.io/badge/React.js-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat-square&logo=python&logoColor=white)
![Alembic](https://img.shields.io/badge/Alembic-6BA81E?style=flat-square)
![Gemini](https://img.shields.io/badge/Google_Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

</div>

---

## 🎯 What is JobBridge?

JobBridge is an **AI-powered job discovery and recruitment platform** that connects candidates with matching career opportunities and gives HR teams a direct, skill-based way to find talent.

Candidates upload a resume, **Google Gemini** extracts skills and experience, and JobBridge searches the web for matching company career pages. The community then tracks response rates on each listing, so everyone benefits from shared outcomes. On the other side, HR teams search candidates by skill and reach out directly, with a hard cap of 3 messages per candidate to keep outreach respectful.

> ⚡ AI Resume Parsing  ·  🌐 Community-Sourced Career Feed  ·  🤝 Direct HR-to-Candidate Outreach

---

## ✨ What can you do with it?

| Feature | What it does |
|---|---|
| 📄 **AI Resume Parsing** | Upload a PDF/DOCX resume and let Gemini extract skills, experience, education, and technologies |
| 🌐 **Career Feed** | Combines your target role + extracted skills to surface matching company career pages |
| 📊 **Community Response Tracking** | See applied/callback/interview counts and response rate, sourced from the community |
| 📝 **Outcome Feedback** | Log what happened on each application — applied, got response, interview, rejected, no response |
| 🔍 **HR Candidate Search** | HR teams search candidates by skill or role and view parsed resume insights |
| 💬 **Capped Outreach** | HR can message candidates directly, hard-capped at 3 messages per candidate (enforced server-side) |
| 🔐 **Role-Based Auth** | Separate candidate/HR signup & login with JWT access + refresh tokens |
| 📱 **Responsive UI** | Built with React + Tailwind for a clean experience across devices |

---

## 🛠️ Built With

| Part | Tools Used |
|---|---|
| **Frontend** | React.js (Vite), Redux Toolkit, RTK Query, Tailwind CSS |
| **Backend** | FastAPI, SQLAlchemy, Alembic, Python |
| **AI Services** | Google Gemini API |
| **Web Search** | DuckDuckGo HTML endpoint (career page discovery, no API key required) |
| **Database** | PostgreSQL |
| **Authentication** | JWT (access + refresh tokens) |
| **Deployment** | Docker / docker-compose |

---

## 📁 Folder Structure

```bash
jobbridge/
├── backend/          # FastAPI app, models, routes, services, Alembic migrations
├── frontend/         # React app (candidate + HR experiences)
└── docker-compose.yml
```

---

## ⚙️ How JobBridge Works

```text
Candidate uploads Resume (PDF/DOCX)
          ↓
Text extracted (pypdf / python-docx)
          ↓
Gemini parses skills, experience, education, technologies
          ↓
Candidate sets target role
          ↓
JobBridge searches the web for matching career pages
          ↓
Community-sourced response rates shown per listing
          ↓
Candidate logs outcomes (applied, response, interview, etc.)
          ↓
HR searches candidates by skill and reaches out directly
```

This creates a feedback loop where community data makes the career feed smarter over time, while HR gets a direct, skill-first path to candidates.

---

## 🏗️ Architecture

JobBridge follows a **Three-Tier Architecture**:

### 1️⃣ Presentation Layer
- React.js (Vite) frontend
- Redux Toolkit + RTK Query for state and data fetching
- Tailwind CSS for responsive styling

### 2️⃣ Business Logic Layer
- FastAPI backend
- Resume text extraction & Gemini-powered structured parsing
- Career feed generation (role + skills → web search → caching)
- Feedback aggregation and HR messaging rules

### 3️⃣ Database Layer
- PostgreSQL via SQLAlchemy
- Alembic-managed migrations
- Candidate profiles, resumes, career feed cache, feedback, HR messages

---

## 🔍 Key Flows Implemented

- **Auth** — separate candidate/HR signup & login, JWT access + refresh tokens, role-based route protection on both API and frontend.
- **Resume pipeline** — upload PDF/DOCX → text extraction (`pypdf`/`python-docx`) → Gemini structured extraction (skills, experience, education, technologies) → stored on the candidate's profile.
- **Career feed** — combines the candidate's target role + extracted skills, searches the web for matching career pages, caches results per role, and shows community-sourced applied/callback/interview counts and response rate.
- **Feedback system** — candidates log outcomes (applied, got response, interview scheduled, rejected, no response, custom) per career page.
- **HR dashboard** — search candidates by skill/role, view parsed resume insights, download resumes, and message candidates (hard-capped at 3 messages per candidate, enforced server-side).

---

## 🔮 Future Enhancements

* ☁️ Move resume storage from local disk to S3/GCS (swap the `open()`/`FileResponse` calls in `candidate.py` and `hr.py`)
* 🚫 Hard token revocation via a JWT `jti` blocklist with a TTL matching the refresh token's life
* 📈 Advanced analytics on career-feed response rates
* 🔔 Notification system for new HR outreach
* 🎯 Smarter career-page ranking beyond DuckDuckGo's curated fallback list

---

## 🙋‍♂️ Developer

<div align="center">

### **Aishwary Mittal 🚀**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/aishwary-mittal-87575928a)

[![Email](https://img.shields.io/badge/Email-Say%20Hi-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:aishwarymittal1504@gmail.com)

</div>

---

<div align="center">

### ⭐ If you found JobBridge helpful, consider giving it a star!

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:87CEEB,100:764ba2&height=100&section=footer"/>

</div>
