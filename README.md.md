# NEO GEN - Project File Structure

## Project Overview
NEO GEN is a full-stack internship management and ATS (Applicant Tracking System) platform with resume analysis capabilities.

- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Node.js/Express + MongoDB
- **ML Service**: Python/Django + scikit-learn

---

## Root Directory Structure

```
NEO GEN/
├── .git/                          # Git repository
├── .venv/                         # Python virtual environment
├── ats-ml-backend/               # ML/ATS Backend (Python/Django)
├── backend/                      # REST API Backend (Node.js/Express)
├── frontend/                     # Frontend (React/Vite)
├── package.json                  # Root workspace config
├── package-lock.json            # Dependencies lock
├── FILE_STRUCTURE.md            # This file
└── FILE_STRUCTURE.pdf           # PDF version
```

---

## 1. FRONTEND (React/Vite Application)

### Path: `/frontend`
Modern React frontend with TailwindCSS styling and Vite bundler.

```
frontend/
├── index.html                    # HTML entry point
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # TailwindCSS configuration
├── postcss.config.js            # PostCSS configuration
├── eslint.config.js             # ESLint configuration
├── package.json                 # Dependencies: React 18, Vite, TailwindCSS, etc.
├── package-lock.json
├── dist/                        # Production build output
├── node_modules/                # Dependencies
└── src/
    ├── main.jsx                 # React app entry point
    ├── App.jsx                  # Root component
    ├── index.css                # Global styles
    │
    ├── components/              # Reusable UI components
    │   ├── ATSScoreCard.jsx     # ATS score display component
    │   ├── Navbar.jsx           # Navigation bar
    │   ├── Footer.jsx           # Footer component
    │   ├── LoginModal.jsx       # Login modal
    │   ├── ResumeUpload.jsx     # Resume upload interface
    │   ├── ErrorMessage.jsx     # Error display component
    │   ├── dashboard/           # Dashboard components
    │   ├── home/                # Home page components
    │   └── ui/                  # Generic UI components
    │
    ├── pages/                   # Page-level components
    │   ├── Home.jsx             # Home page
    │   ├── ResumeTemplates.jsx  # Resume templates page
    │   ├── admin/               # Admin dashboard pages
    │   ├── auth/                # Authentication pages (login, register)
    │   └── dashboard/           # Student/Partner dashboards
    │
    ├── services/                # API service layer
    │   ├── api.js               # Axios instance & base config
    │   ├── authService.js       # Auth API calls
    │   ├── applicationService.js # Application API calls
    │   ├── internshipService.js # Internship API calls
    │   ├── profileService.js    # Profile API calls
    │   ├── resumeService.js     # Resume API calls
    │   ├── messageService.js    # Messaging API calls
    │   ├── notificationService.js # Notification API calls
    │   ├── reviewService.js     # Review API calls
    │   └── dashboardService.js  # Dashboard API calls
    │
    ├── context/                 # React Context for state management
    │   ├── AuthContext.jsx      # Authentication context
    │   └── StudentDashboardContext.jsx # Dashboard state
    │
    ├── routes/                  # Routing configuration
    │   └── AppRoutes.jsx        # Route definitions
    │
    ├── layout/                  # Layout components (headers, sidebars, etc.)
    │
    ├── styles/                  # CSS/Styling files
    │   ├── style.css            # Main stylesheet
    │   ├── admin.css            # Admin-specific styles
    │   ├── atsScore.css         # ATS score styles
    │   ├── resumeUpload.css     # Resume upload styles
    │   ├── chatbot.css          # Chatbot styles
    │   └── ... (other CSS files)
    │
    ├── assets/                  # Static assets
    │   └── images/              # Image files
    │
    └── utils/                   # Utility functions
```

### Frontend Technologies
- **React 18**: UI framework
- **Vite**: Fast build tool & dev server
- **TailwindCSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **React Router**: Client-side routing
- **Framer Motion**: Animation library
- **Recharts**: Charts & graphs
- **Lucide React**: Icon library
- **React Hot Toast**: Notifications

---

## 2. BACKEND (Node.js/Express API)

### Path: `/backend`
RESTful API server for handling business logic, database operations, and file uploads.

```
backend/
├── server.js                    # Express app entry point
├── verify.js                    # System verification script
├── package.json                 # Dependencies: Express, Mongoose, etc.
├── package-lock.json
├── .env                         # Environment variables (not in git)
├── db.sqlite3                   # SQLite database (if used)
├── node_modules/                # Dependencies
├── uploads/                     # User-uploaded files (resumes, documents)
│
├── config/                      # Configuration files
│   ├── db.js                    # MongoDB connection setup
│   └── cloudinary.js            # Cloudinary CDN configuration
│
├── controllers/                 # Business logic handlers
│   ├── authController.js        # User authentication (login, register, OTP)
│   ├── userController.js        # User management (admin operations)
│   ├── internshipController.js  # Internship CRUD operations
│   ├── applicationController.js # Job application handling
│   ├── guideController.js       # Guide/resource management
│   ├── messageController.js     # Messaging between users
│   ├── notificationController.js # Notification management
│   ├── reviewController.js      # Review/rating functionality
│   ├── profileController.js     # User profile operations
│   ├── dashboardController.js   # Dashboard data aggregation
│   └── atsController.js         # ATS resume analysis
│
├── models/                      # MongoDB schemas
│   ├── User.js                  # User model (students, partners, admins)
│   ├── TempUser.js              # Temporary user storage (OTP verification)
│   ├── Internship.js            # Internship postings
│   ├── Application.js           # User applications
│   ├── Guide.js                 # Learning guides
│   ├── Message.js               # Messages between users
│   ├── Notification.js          # User notifications
│   ├── Review.js                # Reviews/ratings
│   ├── Resume.js                # Resume storage
│   └── ActivityLog.js           # User activity tracking
│
├── middleware/                  # Express middleware
│   ├── authMiddleware.js        # JWT authentication verification
│   ├── errorMiddleware.js       # Global error handling
│   └── uploadMiddleware.js      # File upload configuration (Multer)
│
├── routes/                      # API endpoint definitions
│   ├── authRoutes.js            # Auth endpoints (/api/auth)
│   ├── adminRoutes.js           # Admin endpoints (/api/admin)
│   ├── userRoutes.js            # User endpoints (/api/users)
│   ├── internshipRoutes.js      # Internship endpoints (/api/internships)
│   ├── applicationRoutes.js     # Application endpoints (/api/applications)
│   ├── guideRoutes.js           # Guide endpoints (/api/guides)
│   ├── messageRoutes.js         # Message endpoints (/api/messages)
│   ├── notificationRoutes.js    # Notification endpoints (/api/notifications)
│   ├── reviewRoutes.js          # Review endpoints (/api/reviews)
│   ├── profileRoutes.js         # Profile endpoints (/api/profile)
│   ├── dashboardRoutes.js       # Dashboard endpoints (/api/dashboard)
│   ├── atsRoutes.js             # ATS endpoints (/api/resume)
│   └── uploadRoutes.js          # Upload endpoints (/api/upload)
│
└── utils/                       # Helper functions
    ├── sendEmail.js             # Email sending (Nodemailer)
    ├── parseResume.js           # Resume parsing (PDF/DOCX)
    ├── atsScoring.js            # ATS scoring logic
    ├── validation.js            # Input validation helpers
    └── ensureAdmin.js           # Admin initialization
```

### Backend Technologies
- **Express**: Web framework
- **Mongoose**: MongoDB ODM
- **MongoDB**: NoSQL database
- **JWT**: Authentication tokens
- **Bcryptjs**: Password hashing
- **Multer**: File upload handling
- **Nodemailer**: Email sending
- **Cloudinary**: Image/file hosting
- **Mammoth**: DOCX parsing
- **PDF-Parse**: PDF parsing
- **Axios**: HTTP requests

### API Routes
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| POST | /api/auth/verify-otp | OTP verification |
| POST | /api/admin/login | Admin login |
| GET | /api/users | Get all users |
| POST | /api/internships | Create internship |
| GET | /api/internships | List internships |
| POST | /api/applications | Apply for internship |
| GET | /api/messages | Get messages |
| GET | /api/dashboard | Get dashboard data |
| POST | /api/resume/analyze | ATS score analysis |

---

## 3. ATS ML BACKEND (Python/Django)

### Path: `/ats-ml-backend`
Machine learning service for resume analysis and ATS scoring using scikit-learn.

```
ats-ml-backend/
├── manage.py                    # Django management script
├── db.sqlite3                   # SQLite database (development)
├── requirements.txt             # Python dependencies
│
├── ats_project/                 # Django project configuration
│   ├── __init__.py
│   ├── settings.py              # Django settings
│   ├── urls.py                  # Project URL routing
│   ├── wsgi.py                  # WSGI configuration
│   └── __pycache__/
│
├── ml/                          # Machine Learning models
│   ├── train_model.py           # Model training script
│   ├── ats_model.pkl            # Trained ML model (pickle)
│   ├── tfidf.pkl                # TF-IDF vectorizer (pickle)
│   └── ats_dataset.csv          # Training dataset
│
└── predictor/                   # Django app for predictions
    ├── apps.py                  # App configuration
    ├── urls.py                  # App URL routing
    ├── views.py                 # View handlers for API endpoints
    ├── ml_loader.py             # ML model loading utilities
    ├── skill_extractor.py       # Skill extraction from resumes
    ├── __pycache__/
    └── migrations/              # Database migrations
```

### ML Backend Technologies
- **Django**: Web framework
- **Django REST Framework**: REST API
- **scikit-learn**: Machine learning
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Joblib**: Model serialization

### ML Models
1. **ats_model.pkl**: Trained model for ATS scoring
2. **tfidf.pkl**: TF-IDF vectorizer for text processing

### Key Features
- Resume parsing and text extraction
- Skill extraction and matching
- Job description analysis
- ATS score calculation
- Resume ranking

---

## 4. Database Models

### MongoDB Collections (Backend)

#### User
- name, email, password, role (student/partner/admin)
- phone, address, education, skills, experience
- resume, profile image
- isBlocked, active, createdAt

#### Internship
- title, company, description, requirements
- stipend, duration, location
- applicants, createdBy (admin)
- createdAt, updatedAt

#### Application
- userId, internshipId
- status (applied/shortlisted/rejected/accepted)
- appliedAt, updatedAt

#### Message
- senderId, recipientId
- subject, body, attachments
- read, createdAt

#### Notification
- userId, type, message, link
- read, createdAt

#### Review
- userId, targetId, rating, comment
- verified (admin approval)
- createdAt

#### Resume
- userId, fileName, fileUrl, parsedText
- uploadedAt

#### ActivityLog
- userId, action, details, ip, userAgent
- createdAt

---

## 5. Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
OTP_EXPIRY_MINUTES=5
OTP_LENGTH=6

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

---

## 6. Key Features by Module

### Authentication
- User registration with OTP verification
- JWT-based login
- Google OAuth integration
- Admin authentication
- Password hashing with bcryptjs

### Internships
- Browse available internships
- Apply for internships
- Track application status
- Admin: Create, edit, delete internships

### ATS & Resume Analysis
- Resume upload (PDF, DOCX)
- Automatic text extraction
- Skill extraction
- ATS score calculation
- Resume ranking

### User Management
- Student profiles
- Partner profiles
- Admin user management
- User blocking/unblocking
- Activity logging

### Messaging & Notifications
- Direct messaging
- Real-time notifications
- Message history
- Notification preferences

### Reviews & Ratings
- Review internships
- Rate companies
- Admin verification

---

## 7. Development Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18, Vite, TailwindCSS | UI/UX |
| Backend API | Express, Node.js | REST API |
| Database | MongoDB | Data storage |
| Authentication | JWT, Bcryptjs | Security |
| File Upload | Multer, Cloudinary | File handling |
| Email | Nodemailer | Email notifications |
| ML Service | Django, scikit-learn | Resume analysis |
| Deployment | Docker (optional) | Containerization |

---

## 8. API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

---

## 9. Folder Conventions

- **controllers/**: Business logic per feature
- **models/**: Database schemas
- **routes/**: API endpoint definitions
- **middleware/**: Reusable request/response handlers
- **utils/**: Helper functions
- **services/**: API calls (frontend)
- **components/**: Reusable UI elements
- **pages/**: Full page components
- **context/**: Global state management

---

## 10. Running the Project

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm start
```

### ML Backend
```bash
cd ats-ml-backend
pip install -r requirements.txt
python manage.py runserver
```

---

**Last Updated**: January 2026
**Maintainer**: Pradeep
