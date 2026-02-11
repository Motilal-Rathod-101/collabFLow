
CollabFlow – Project & Task Management System

CollabFlow is a full-stack Project & Task Management System inspired by tools like Jira and ClickUp.

It allows teams to manage:

 Workspaces
 Projects
 Tasks (Status, Priority, Assignee)
 Comments
`Team Members with Role-based Access

Built using Django REST Framework (Backend) and React + Redux Toolkit (Frontend) with PostgreSQL as the database.

- Tech Stack
🔹 Backend

Django
Django REST Framework
PostgreSQL
JWT Authentication (SimpleJWT)
Gunicorn (Production)

🔹 Frontend

React (Vite)
Redux Toolkit
TypeScript
Tailwind CSS
Axios

✨ Features

Workspace Management
Project Creation & Configuration
Task Management (TODO / IN_PROGRESS / DONE)
Task Assignment
Role-based Authorization (Admin / Member)
Project Dashboard & Analytics
Team Management
Comment System
Seed Script for Demo Data
Fully API-driven Architecture


🛠 Local Setup Guide
1️ Clone Repository
git clone https://github.com/Motilal-Rathod-101/collabFLow.git
cd collabFLow

- Backend Setup (Django)
cd backend

python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt

python manage.py migrate
python manage.py seed        # Optional: Load demo data
python manage.py runserver

Backend URL:
http://127.0.0.1:8000/

-Frontend Setup (React + Vite)
cd frontend

npm install
npm run dev

Frontend URL:
http://localhost:5173/

- Authentication

JWT based authentication

Access Token & Refresh Token

Role-based project & task permissions

Protected API routes

📡 API Endpoints (Sample)
Workspaces
GET    /api/workspaces/
POST   /api/workspaces/

Projects
GET    /api/projects/
POST   /api/projects/
PUT    /api/projects/:id/
DELETE /api/projects/:id/

Tasks
GET    /api/tasks/:project_id/
POST   /api/tasks/:project_id/
PUT    /api/tasks/:task_id/
DELETE /api/tasks/:task_id/

Comments
GET    /api/comments/:task_id/
POST   /api/comments/

🗄 Database
PostgreSQL

Seed data available via:
python manage.py seed
