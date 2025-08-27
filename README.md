# Task Tracker Backend

A backend service for tracking tasks and time logs with AI-enhanced task management using **Gemini AI**.  
Built with **Express**, **Prisma**, **PostgreSQL**, and **JWT Authentication**.

---

## 🚀 Features

✅ **Authentication & Authorization**
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- User data isolation

✅ **Task Management**
- CRUD operations for tasks
- AI-enhanced task creation (Gemini)
- Task status management
- User-specific task access

✅ **Real-time Time Tracking**
- Start/stop timers
- Duration calculation
- Active timer management
- Time log history

✅ **Daily & Weekly Summaries**
- Daily and weekly breakdowns
- Task completion stats
- Time spent analysis

✅ **Security**
- Helmet for security headers
- CORS configuration
- Rate limiting
- Input validation
- Error handling

✅ **Other Features**
- Prisma Studio for DB inspection
- Health check endpoint
- Graceful shutdown handling

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express  
- **Database ORM:** Prisma  
- **Database:** PostgreSQL  
- **Auth:** JWT, bcryptjs  
- **Validation:** Joi  
- **Security:** Helmet, CORS, Rate limiting  
- **AI Integration:** Gemini AI  

---


## ENV 

- Database
DATABASE_URL="postgresql-url"

- JWT
JWT_SECRET="your_super_secret_jwt_key_here_make_it_long_and_secure"
JWT_EXPIRES_IN="7d"

- Server
PORT=5000
NODE_ENV="development"

- AI Service (Gemini)
GEMINI_API_KEY="your_gemini_api_key_here"

- CORS
CLIENT_URL="http://localhost:3000"

---

## 📑 API Documentation

### 🔐 Authentication Endpoints
- `POST /api/auth/register` → Register new user  
- `POST /api/auth/login` → Login user  
- `GET /api/auth/profile` → Get user profile (protected)  
- `POST /api/auth/logout` → Logout user (protected)  

---

### ✅ Task Endpoints
- `POST /api/tasks` → Create new task (protected)  
- `GET /api/tasks` → Get all user tasks (protected)  
- `GET /api/tasks/:id` → Get specific task (protected)  
- `PUT /api/tasks/:id` → Update task (protected)  
- `DELETE /api/tasks/:id` → Delete task (protected)  

---

### ⏱️ Time Log Endpoints
- `POST /api/time-logs/start` → Start timer (protected)  
- `PUT /api/time-logs/stop/:id` → Stop timer (protected)  
- `GET /api/time-logs/active` → Get active timer (protected)  
- `GET /api/time-logs` → Get time logs with pagination (protected)  
- `DELETE /api/time-logs/:id` → Delete time log (protected)  

---

### 📊 Summary Endpoints
- `GET /api/summary/daily?date=YYYY-MM-DD` → Get daily summary (protected)  
- `GET /api/summary/weekly?startDate=YYYY-MM-DD` → Get weekly summary (protected)  

