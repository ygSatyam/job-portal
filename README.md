# Job Portal Web Application

A full-stack Job Portal web application that connects job seekers with recruiters. Users can explore job opportunities, manage profiles, and apply for jobs, while recruiters can manage companies and job postings.

## Features

### Job Seekers
- User registration and login
- Profile management
- Browse and search job listings
- Apply for jobs
- Track job applications

### Recruiters
- Recruiter authentication
- Company registration and management
- Create and manage job postings
- View applicants and application details

## Tech Stack

**Frontend:** React.js, Tailwind CSS, Vite

**Backend:** Node.js, Express.js

**Database:** MongoDB

**Tools:** Git, GitHub, Postman

## Project Structure

```text
job-portal/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/ygSatyam/job-portal.git
cd job-portal
```

### 2. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Set up the backend

Open a separate terminal:

```bash
cd backend
npm install
npm run dev
```

### 4. Configure environment variables

Create a `.env` file in the backend directory with the required configuration:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use your own credentials and check the backend code for any additional required environment variables.

## Future Improvements

- Responsive UI improvements
- Advanced job search and filtering
- Improved validation and error handling
- Deployment and production configuration

## Author

**Satyam Yadav**

GitHub: [ygSatyam](https://github.com/ygSatyam)

---

*This project is being developed and improved as part of my full-stack web development learning journey.*