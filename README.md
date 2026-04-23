# Engineering College Placement Portal

A MERN/Spring Boot full-stack placement portal for students, companies, and college admins.

## Tech Stack
- **Backend:** Spring Boot (Java 21), MongoDB (Spring Data MongoDB), JWT Auth, JavaMailSender
- **Frontend:** React 18, Vite, Tailwind CSS, Recharts

## Prerequisites
- Node.js & npm (or yarn)
- Java 21+ and Maven (or use provided Maven Wrapper if `mvnw` is present contextually)
- MongoDB instance (Atlas or local)

## Setup Instructions

### 1. Backend Configuration
1. Navigate to `/backend`.
2. Ensure you have a running MongoDB instance. Update `./backend/src/main/resources/application.properties` with your connection URI:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/placement_db
   ```
3. (Optional) Provide real SMTP credentials in `application.properties` for Email notifications.
   ```properties
   spring.mail.username=your_email@gmail.com
   spring.mail.password=your_app_password
   ```
4. Build and Run:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
   > The server will start on `http://localhost:8080`.

### 2. Frontend Configuration
1. Navigate to `/frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   > The client will start on `http://localhost:5173`. Make sure the backend base URL in `src/services/api.js` points to `http://localhost:8080/api`.

### 3. Usage & Seeding
- **Register Admin:** Add an admin user programmatically or via MongoDB console directly to the `admins` collection, since there's no open endpoint to create admin.
  ```json
  db.admins.insert({
      email: 'admin@college.edu',
      password: '<bcrypt_hashed_password>',
      role: 'ROLE_ADMIN'
  })
  ```
- **Register Company/Student:** Use the provided Sign Up page to register. An Admin must approve the registration before jobs can be applied/posted.

## Smart Features Implemented
- **Auto Eligibility:** CGPA and branch restrictions evaluated aggressively on the backend logic when applying.
- **Top Students:** Aggregation endpoint to fetch to performers on the landing page.
- **Skill-based Match:** Intelligent keyword matching algorithm mapping student skills with job descriptions available at `/jobs/recommended`.
- **Interview Scheduling:** Companies can schedule interviews, triggering MailSender events.
- **Admin Analytics:** Charts powered by Recharts giving visibility into total students, placed status, etc.
