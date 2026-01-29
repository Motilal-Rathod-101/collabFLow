# 🚀 CollabFlow – Project & Task Management System

CollabFlow is a full-stack project and task management system inspired by tools like Jira and ClickUp.  
It allows teams to manage **workspaces, projects, tasks, and comments** in a structured way.

This project is built using **Django REST Framework (Backend)** and **React + Redux Toolkit (Frontend)**.

---

## Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication (planned)

### Frontend
- React (Vite)
- Redux Toolkit
- TypeScript
- Tailwind CSS
- Axios

---

## Features

- Workspaces management
- Projects under workspaces
- Task management (status, priority, assignee)
- Sidebar workspace & project navigation
- Project dashboard & task overview
- PostgreSQL seeded data
- API-driven architecture

---

## 🛠 Installation & Run Instructions

Follow the steps below to run the project locally.

---

###  Clone the Repository
```bash
git clone https://github.com/Motilal-Rathod-101/collabFLow.git
cd collabflow

## Backend Setup

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed
python manage.py runserver

Backend runs on:
http://127.0.0.1:8000/


Frontend Setup:
cd frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173/

API Endpoints:
GET /api/workspaces/
GET /api/projects/
GET /api/tasks/
GET /api/comments/

Notes:
PostgreSQL is used as database
Data is seeded using seed script
Frontend fetches data using REST APIs
Authentication will be added later
