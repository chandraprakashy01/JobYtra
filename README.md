# JobYtra — AI-Powered Engineering Placement Portal

<div align="center">

![JobYtra](https://img.shields.io/badge/JobYtra-AI--Powered-2563eb?style=for-the-badge&logo=briefcase)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=for-the-badge&logo=spring-boot)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-1.5_Flash-FF6F00?style=for-the-badge&logo=google)
![JWT](https://img.shields.io/badge/Auth-JWT_%2B_OAuth2-000000?style=for-the-badge&logo=jsonwebtokens)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)

**A full-stack, AI-powered placement portal for engineering colleges**  
connecting Students, Companies, and Admins — live at [jobytra.vercel.app](https://jobytra.vercel.app)

</div>

---

## 🚀 Overview

JobYtra transforms the traditional college placement process into an intelligent, seamless experience. Students can discover, apply, and prepare for jobs using AI-powered tools. Companies can post openings, review applicants with AI-powered candidate matching, and schedule interviews. Admins oversee the entire ecosystem from a central dashboard.

The platform supports three authentication methods: email/password, Google OAuth2, and GitHub OAuth2 — with OAuth2 students auto-approved since their identity is verified by the provider.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA |
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Database** | PostgreSQL (hosted on Supabase) |
| **Auth** | JWT (JJWT 0.11.5) + Google OAuth2 + GitHub OAuth2 |
| **AI** | Google Gemini 1.5 Flash API |
| **PDF Processing** | Apache PDFBox 3.0.1 |
| **Email** | Spring Mail (Gmail SMTP) |
| **Containerization** | Docker + Docker Compose |
| **Deployment** | Frontend → Vercel · Backend → Render |

---

## ✨ Features

### 👨‍🎓 Student Portal
- Register with email/password (requires admin approval) **or** sign in instantly via Google / GitHub OAuth2
- Complete profile: name, email, branch (CSE / IT / ECE / ME / CE), CGPA, skills, batch, and college ID
- Upload resume (PDF, max 5 MB)
- Browse and filter all admin-approved jobs & internships
- Apply to jobs with automatic eligibility enforcement (CGPA + branch)
- Track application status in real time: **Applied → Shortlisted → Selected**
- Receive interview schedule notifications via email
- **AI Tools Hub** — 4 AI-powered career tools (see below)

### 🤖 AI Tools Hub — Powered by Gemini 1.5 Flash

| Tool | What It Does |
|---|---|
| **Resume Analyzer** | Upload PDF → ATS score (0–100), detected skills, missing keywords, strengths, and improvement suggestions |
| **Resume vs Job Match** | Compare your resume against a job description → match score, matched skills, skill gaps, and a learning roadmap |
| **AI Cover Letter** | Generate a personalized 3-paragraph cover letter with tone selection: **Professional / Confident / Friendly** |
| **Interview Coach** | Choose role, skills, experience level, and difficulty → get 5 AI-generated Q&A cards each with a hint, expected answer, and follow-up question |

> All AI tools include **smart fallback logic** — if no Gemini API key is configured, keyword-based local matching keeps every tool functional.

### 🏢 Company Portal
- Register and await admin verification
- Post full-time jobs and internships with eligibility criteria (branch, min CGPA, salary, location, deadline)
- View the full applicant list per job posting
- **AI Candidate Match** — Gemini evaluates every applicant and returns a suitability score (0–100) with a plain-language justification
- Update application status (Applied / Shortlisted / Selected) and schedule interviews
- Invite talent from the student pool via email

### 🛡️ Admin Portal
- Approve or reject student registrations
- Verify or reject company accounts
- Approve or reject job postings
- View dashboard analytics: total students, companies, jobs, and placements
- Manage all entities from one central dashboard

### 🌐 Public Pages
- **Landing page** — hero section, top students showcase, and hiring partners
- Browse all approved jobs and internships (no login required)
- **Forgot Password** — generates a temporary password and delivers it via Gmail SMTP
- FAQ, Help Center, About, Contact, Events, Host Event, Privacy Policy, Terms of Service
- OAuth2 callback handler for seamless Google / GitHub sign-in redirects

---

## 📁 Project Structure

```
JobYtra/
├── .env.example                          # Environment variable template
├── docker-compose.yml                    # Full-stack Docker setup
├── render.yaml                           # Render.com deployment config
├── vercel.json                           # Vercel SPA routing config
│
├── backend/                              # Spring Boot application
│   └── src/main/java/com/placement/
│       ├── PlacementApplication.java     # Entry point
│       ├── controller/
│       │   ├── AIResumeController.java   # AI tools endpoints (resume, match, cover letter, interview)
│       │   ├── AdminController.java      # Admin: approve students, verify companies, approve jobs
│       │   ├── ApplicationController.java# Application CRUD + status updates
│       │   ├── AuthController.java       # Login, register (student/company), forgot-password
│       │   ├── CompanyController.java    # Company CRUD, applicants, AI candidate match, invite
│       │   ├── JobController.java        # Job CRUD, recommendations
│       │   ├── OAuth2Controller.java     # Google & GitHub OAuth2 sign-in
│       │   ├── PublicController.java     # Health check / public endpoints
│       │   ├── StudentController.java    # Student profile + resume upload
│       │   └── dto/                      # Request/Response DTOs
│       ├── model/
│       │   ├── Student.java              # id, name, email, branch, cgpa, skills, resumeUrl, batch, collegeId, oauthProvider
│       │   ├── Company.java              # id, name, email, website, about, isVerified
│       │   ├── Job.java                  # id, title, companyId, description, eligibility, salary, location, type, deadline
│       │   ├── Application.java          # id, jobId, studentId, status, appliedAt
│       │   ├── Eligibility.java          # Embedded: branches (list), minCgpa
│       │   └── Admin.java                # id, email, password
│       ├── repository/                   # Spring Data JPA repositories
│       ├── service/
│       │   ├── GeminiService.java        # All Gemini AI methods + fallback logic
│       │   └── EmailService.java         # Gmail SMTP email delivery
│       └── security/
│           ├── WebSecurityConfig.java    # CORS, JWT filter chain, public routes
│           ├── JwtUtils.java             # Token generation & validation
│           ├── AuthTokenFilter.java      # Per-request JWT extraction
│           ├── UserDetailsImpl.java      # Spring Security principal
│           ├── UserDetailsServiceImpl.java # Load user by email (student/company/admin)
│           └── DataSeeder.java           # Seeds admin + sample companies, jobs, internships
│
└── frontend/                             # React 18 + Vite application
    └── src/
        ├── App.jsx                       # Route definitions
        ├── context/AuthContext.jsx       # Auth state (JWT, role, user info)
        ├── services/api.js               # Axios client with JWT interceptor
        ├── layouts/                      # MainLayout, DashboardLayout
        ├── components/                   # Navbar, Footer, shared UI
        └── pages/
            ├── Landing.jsx               # Home / hero page
            ├── Login.jsx                 # Email/password + OAuth2 buttons
            ├── Register.jsx              # Student registration form
            ├── Jobs.jsx / Internships.jsx # Public job & internship listings
            ├── JobDetail.jsx             # Full job detail + apply
            ├── OAuthCallback.jsx         # OAuth2 redirect handler
            ├── ForgotPassword.jsx        # Forgot password form
            ├── About.jsx / Contact.jsx / FAQ.jsx / HelpCenter.jsx
            ├── Events.jsx / HostEvent.jsx
            ├── Privacy.jsx / Terms.jsx
            ├── student/
            │   ├── StudentDashboard.jsx
            │   ├── StudentProfile.jsx
            │   ├── StudentApplications.jsx
            │   ├── AIToolsHub.jsx        # Landing page for 4 AI tools
            │   ├── ResumeAnalyzer.jsx
            │   ├── ResumeJobMatch.jsx
            │   ├── CoverLetterGenerator.jsx
            │   └── InterviewCoach.jsx
            ├── company/
            │   ├── CompanyDashboard.jsx
            │   ├── PostJob.jsx
            │   ├── ApplicantsList.jsx
            │   └── AICandidateMatch.jsx
            └── admin/
                ├── AdminDashboard.jsx
                ├── AdminStudents.jsx
                ├── AdminCompanies.jsx
                └── AdminJobs.jsx
```

---

## ⚙️ Setup & Installation

### Prerequisites

- **Java 21+** and Maven (or use the included `./mvnw` wrapper)
- **Node.js 18+** and npm
- **PostgreSQL** database (local or [Supabase](https://supabase.com))
- **Gemini API Key** — [Get one free here](https://aistudio.google.com/app/apikey)
- **Gmail App Password** — [Generate here](https://myaccount.google.com/apppasswords) (required for email features)
- *(Optional)* Google OAuth2 credentials — [Google Cloud Console](https://console.cloud.google.com)
- *(Optional)* GitHub OAuth2 credentials — [GitHub Developer Settings](https://github.com/settings/developers)

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

Create a `.env` file inside `backend/` (or export these as system environment variables):

```env
# ── PostgreSQL / Supabase ──────────────────────────────────────────
DB_URL=jdbc:postgresql://localhost:5432/placement_db
DB_USERNAME=postgres
DB_PASSWORD=your_password

# ── JWT ───────────────────────────────────────────────────────────
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION_MS=86400000

# ── Gemini AI ─────────────────────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key_here

# ── Email (Gmail SMTP) ────────────────────────────────────────────
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_gmail_app_password

# ── Google OAuth2 (optional) ──────────────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ── GitHub OAuth2 (optional) ──────────────────────────────────────
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Run the backend:

```bash
./mvnw spring-boot:run
```

> Server starts on **`http://localhost:8080`**

On first run, `DataSeeder` automatically:
- Creates the **admin** account
- Seeds sample **companies** (e.g. Google, Microsoft, Amazon…)
- Seeds sample **jobs** and **internships** with eligibility criteria

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> Client starts on **`http://localhost:5173`**

Ensure `src/services/api.js` points to your backend:

```js
const API_URL = 'http://localhost:8080/api';
```

---

### 4. Docker Compose (Full Stack)

Run the entire stack (backend + frontend + database) with a single command:

```bash
docker-compose up --build
```

| Service | Port |
|---|---|
| Backend (Spring Boot) | `8080` |
| Frontend (React + Nginx) | `80` |
| MongoDB (Docker DB) | `27017` |

> **Note:** The Docker Compose setup uses **MongoDB** as the database. For the Supabase/PostgreSQL flow (used in production), configure the backend environment variables accordingly.

---

## 🔑 Default Credentials (Seeded on First Run)

| Role | Email | Password |
|---|---|---|
| Admin | `Abc@gmail.com` | `Abc@123` |
| Company (seeded) | e.g. `google@gmail.com` | `Company@123` |
| Student | Register via UI | Requires admin approval |

> OAuth2 students (Google / GitHub sign-in) are **auto-approved** — no admin action needed.

---

## 🌐 API Endpoints

### Auth — `/api/auth`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | Login (student, company, or admin) → JWT |
| POST | `/student/register` | Public | Register new student (pending admin approval) |
| POST | `/company/register` | Public | Register new company (pending admin verification) |
| POST | `/forgot-password` | Public | Generate temp password and send via email |
| POST | `/oauth2/google` | Public | Exchange Google auth code → JWT |
| POST | `/oauth2/github` | Public | Exchange GitHub auth code → JWT |

### Student AI Tools — `/api/student/ai` *(ROLE_STUDENT)*

| Method | Path | Description |
|---|---|---|
| POST | `/analyze-resume` | Upload PDF → ATS score, skills, suggestions |
| POST | `/match-job` | Resume PDF + job description → match score & roadmap |
| POST | `/cover-letter` | Resume PDF + company + tone → personalized letter |
| POST | `/interview-prep` | Role + skills + difficulty → 5 interview Q&A cards |

### Jobs — `/api/jobs`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | All admin-approved jobs |
| GET | `/{id}` | Public | Job detail |
| GET | `/recommended` | ROLE_STUDENT | AI-matched job recommendations |
| POST | `/` | ROLE_COMPANY | Post a new job |
| PUT | `/{id}/approve` | ROLE_ADMIN | Approve a job posting |

### Applications — `/api/applications`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/` | ROLE_STUDENT | Apply to a job |
| GET | `/student` | ROLE_STUDENT | Get my applications |
| GET | `/job/{jobId}` | ROLE_COMPANY | Get all applicants for a job |
| PUT | `/{id}/status` | ROLE_COMPANY | Update application status |

### Company — `/api/company`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/profile` | ROLE_COMPANY | Get company profile |
| GET | `/jobs` | ROLE_COMPANY | Get company's job postings |
| POST | `/ai-match/{jobId}` | ROLE_COMPANY | Run Gemini AI candidate match for a job |
| POST | `/invite` | ROLE_COMPANY | Send talent invite email to a student |

### Admin — `/api/admin`

| Method | Path | Description |
|---|---|---|
| GET | `/students` | List all students |
| PUT | `/students/{id}/approve` | Approve a student |
| PUT | `/students/{id}/reject` | Reject a student |
| GET | `/companies` | List all companies |
| PUT | `/companies/{id}/verify` | Verify a company |
| PUT | `/companies/{id}/reject` | Reject a company |
| GET | `/jobs` | List all jobs (pending + approved) |
| PUT | `/jobs/{id}/approve` | Approve a job posting |
| PUT | `/jobs/{id}/reject` | Reject a job posting |
| GET | `/dashboard` | Aggregate analytics counts |

---

## 🔒 Security

- All endpoints are **JWT-protected** except explicitly public routes
- **Role-based access control:** `ROLE_STUDENT`, `ROLE_COMPANY`, `ROLE_ADMIN`
- **OAuth2 students** are auto-approved; they have no password stored (set to `null`)
- PDF uploads validated: type check + max **5 MB** size enforced by Spring
- AI prompts **sanitized** against injection (backtick stripping, variable placeholder escaping, 25 000 character truncation)
- CORS configured for Vercel origin + local dev (`localhost:5173`)
- Passwords hashed with **BCrypt** via Spring Security's `PasswordEncoder`

---

## 🚢 Deployment

| Service | Platform | Config File |
|---|---|---|
| **Frontend** | Vercel (static) | `vercel.json` — SPA rewrites `/*` → `/index.html` |
| **Backend** | Render (Java 21) | `render.yaml` — `./mvnw clean package -DskipTests` → `java -jar` |
| **Database** | Supabase (PostgreSQL) | Env var `DB_URL` |

**Live URL:** [https://jobytra.vercel.app](https://jobytra.vercel.app)

### Environment Variables on Render

Set the following in **Render Dashboard → Environment**:

```
DB_URL               → Supabase PostgreSQL connection string
DB_USERNAME
DB_PASSWORD
JWT_SECRET
GEMINI_API_KEY
MAIL_USERNAME
MAIL_PASSWORD
GOOGLE_CLIENT_ID     (optional)
GOOGLE_CLIENT_SECRET (optional)
GITHUB_CLIENT_ID     (optional)
GITHUB_CLIENT_SECRET (optional)
```

---

## 🗂️ Data Models

### Student
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Auto-generated |
| `name` | String | |
| `email` | String | Unique |
| `password` | String | BCrypt — `null` for OAuth2 users |
| `branch` | String | CSE / IT / ECE / ME / CE |
| `cgpa` | Float | Used for eligibility checks |
| `skills` | List\<String\> | |
| `resumeUrl` | String | Uploaded PDF path |
| `isApproved` | Boolean | `false` by default; `true` for OAuth2 |
| `batch` | String | Graduation year |
| `collegeId` | String | College roll number |
| `oauthProvider` | String | `"google"` / `"github"` / `null` |

### Job
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | |
| `title` | String | |
| `companyId` | String | FK to Company |
| `description` | TEXT | |
| `eligibility` | Eligibility | Embedded (branches, minCgpa) |
| `salary` | String | |
| `location` | String | |
| `type` | String | `"internship"` or `"full-time"` |
| `deadline` | Date | |
| `isApproved` | Boolean | Admin must approve before public visibility |
| `postedAt` | Date | Auto-set on creation |

### Application
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | |
| `jobId` | String | |
| `studentId` | String | |
| `status` | String | Applied / Shortlisted / Selected |
| `appliedAt` | Date | |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit with conventional commits: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request against `main`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Built with ❤️ for engineering students · Powered by Google Gemini AI
</div>
