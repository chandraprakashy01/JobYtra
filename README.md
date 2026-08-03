# JobYtra — AI-Powered Engineering Placement Portal

<div align="center">

![JobYtra](https://img.shields.io/badge/JobYtra-AI--Powered-2563eb?style=for-the-badge&logo=briefcase)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=for-the-badge&logo=spring-boot)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-1.5_Flash-FF6F00?style=for-the-badge&logo=google)

**A full-stack, AI-powered placement portal for engineering colleges**  
connecting Students, Companies, and Admins — live at [jobytra.vercel.app](https://jobytra.vercel.app)

</div>

---

## 🚀 Overview

JobYtra transforms the traditional college placement process into an intelligent, seamless experience. Students can discover, apply, and prepare for jobs using AI-powered tools. Companies can post openings, review applicants with AI candidate matching, and schedule interviews. Admins oversee the entire ecosystem.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA |
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Database** | PostgreSQL (hosted on Supabase) |
| **Auth** | JWT (JJWT 0.11.5) |
| **AI** | Google Gemini 1.5 Flash API |
| **PDF Processing** | Apache PDFBox 3.0.1 |
| **Email** | Spring Mail (Gmail SMTP) |
| **Deployment** | Frontend → Vercel · Backend → Render |

---

## ✨ Features

### 👨‍🎓 Student Portal
- Register and await admin approval
- Browse and filter all approved jobs & internships
- Apply to jobs with eligibility enforcement (CGPA + branch)
- Upload resume (PDF)
- Track application status (Applied → Shortlisted → Selected)
- Receive interview schedule notifications via email
- **AI Tools Hub** — 4 AI-powered career tools (see below)

### 🤖 AI-Powered Tools (Gemini 1.5 Flash)
| Tool | What It Does |
|---|---|
| **Resume Analyzer** | Upload PDF → ATS score, detected skills, missing keywords, improvement tips |
| **Resume vs Job Match** | Compare resume against job description → match score, skill gaps, learning roadmap |
| **AI Cover Letter** | Generate personalized cover letters with tone selection (Professional / Confident / Friendly) |
| **Interview Coach** | AI-generated Q&A cards with hints, expected answers, and follow-up questions |

### 🏢 Company Portal
- Register and await admin verification
- Post full-time jobs and internships with eligibility criteria
- View all applicants per job
- **AI Candidate Match** — Gemini ranks applicants by suitability score with justification
- Update application status and schedule interviews
- Invite talent from the student pool via email

### 🛡️ Admin Portal
- Approve / reject student registrations
- Verify / reject company accounts
- Approve / reject job postings
- View dashboard analytics (students, companies, jobs, placements)
- Manage all entities from a central dashboard

### 🌐 Public Pages
- Landing page with top students showcase and hiring partners
- Browse all approved jobs and internships
- FAQ, Help Center, About, Contact, Events, Host Event
- Forgot Password (temporary password via email)

---

## 📁 Project Structure

```
JobYtra/
├── backend/                          # Spring Boot application
│   ├── src/main/java/com/placement/
│   │   ├── controller/               # REST controllers
│   │   │   ├── AIResumeController.java   # AI tools endpoints
│   │   │   ├── AuthController.java       # Login, register, forgot-password
│   │   │   ├── CompanyController.java    # Company CRUD + AI match
│   │   │   ├── JobController.java        # Jobs + recommendations
│   │   │   └── StudentController.java    # Profile + resume upload
│   │   ├── model/                    # JPA entities (Student, Company, Job, Application)
│   │   ├── repository/               # Spring Data JPA repositories
│   │   ├── service/
│   │   │   ├── GeminiService.java    # Gemini API integration (all AI methods)
│   │   │   └── EmailService.java     # Email notifications
│   │   ├── security/                 # JWT, Spring Security config, DataSeeder
│   │   └── controller/dto/           # Request/Response DTOs
│   └── src/main/resources/
│       └── application.properties    # App configuration
│
└── frontend/                         # React 18 + Vite application
    └── src/
        ├── pages/
        │   ├── student/              # Dashboard, Profile, Applications, AI Tools
        │   ├── company/              # Dashboard, PostJob, Applicants, AI Match
        │   └── admin/                # Dashboard, Students, Companies, Jobs
        ├── components/               # Navbar, Footer
        ├── layouts/                  # MainLayout, DashboardLayout
        ├── services/api.js           # Axios client with JWT interceptor
        └── context/AuthContext.jsx   # Auth state management
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Java 21+** and Maven (or use `mvnw` wrapper)
- **Node.js 18+** and npm
- **PostgreSQL** database (local or [Supabase](https://supabase.com))
- **Gemini API Key** — [Get one free here](https://aistudio.google.com/app/apikey)
- **Gmail App Password** — [Generate here](https://myaccount.google.com/apppasswords) (optional, for emails)

---

### 1. Clone the Repository
```bash
git clone https://github.com/chandraprakashy01/JobYtra.git
cd JobYtra
```

---

### 2. Backend Setup

```bash
cd backend
```

Create a `.env` file in `backend/`:
```env
# Database (PostgreSQL / Supabase)
DB_URL=jdbc:postgresql://localhost:5432/placement_db
DB_USERNAME=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_here

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Email (Gmail SMTP — optional)
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_gmail_app_password
```

Run the backend:
```bash
./mvnw spring-boot:run
```
> Server starts on `http://localhost:8080`

The `DataSeeder` automatically creates an admin account and seeds sample companies, jobs, and internships on first run.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
> Client starts on `http://localhost:5173`

Ensure `src/services/api.js` points to your backend:
```js
const API_URL = 'http://localhost:8080/api';
```

---

## 🔑 Default Credentials (Dev / Seed)

| Role | Email | Password |
|---|---|---|
| Admin | `Abc@gmail.com` | `Abc@123` |
| Company (any seeded) | e.g., `google@gmail.com` | `Company@123` |
| Student | Register via UI | Requires admin approval |

---

## 🌐 API Endpoints

### Auth (`/api/auth`)
| Method | Path | Description |
|---|---|---|
| POST | `/login` | Login (student, company, or admin) |
| POST | `/student/register` | Register new student |
| POST | `/company/register` | Register new company |
| POST | `/forgot-password` | Send temporary password via email |

### Student AI Tools (`/api/student/ai`) — Requires ROLE_STUDENT
| Method | Path | Description |
|---|---|---|
| POST | `/analyze-resume` | Upload PDF → ATS score + skill analysis |
| POST | `/match-job` | Resume PDF + job description → match score |
| POST | `/cover-letter` | Resume PDF + company → personalized letter |
| POST | `/interview-prep` | Role + skills → 5 interview Q&A |

### Jobs (`/api/jobs`)
| Method | Path | Access |
|---|---|---|
| GET | `/` | Public — all approved jobs |
| GET | `/{id}` | Public — job detail |
| GET | `/recommended` | Student — AI-matched recommendations |

---

## 🚢 Deployment

| Service | Config |
|---|---|
| **Frontend** | Vercel — auto-deploys from `main` branch |
| **Backend** | Render — configured via `render.yaml` |
| **Database** | Supabase (PostgreSQL) |

**Live URL:** [https://jobytra.vercel.app](https://jobytra.vercel.app)

---

## 🔒 Security

- All API endpoints are JWT-protected except public routes
- Role-based access: `ROLE_STUDENT`, `ROLE_COMPANY`, `ROLE_ADMIN`
- PDF uploads validated (type + max 5MB)
- AI prompts sanitized against injection attacks
- CORS configured for Vercel + local dev origins

---

## 📸 Screenshots

| Landing Page | Student AI Tools Hub |
|---|---|
| Hero section with hiring partners | 4 AI-powered career tools |

| Resume Analyzer | Interview Coach |
|---|---|
| ATS score gauge + skill chips | Expandable Q&A cards with hints |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Built with ❤️ for engineering students · Powered by Google Gemini AI
</div>
