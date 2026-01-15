# Task & Issue Tracker

A simple project and task management app where you can create projects, add team members, and manage tasks together.

## What does it do?

- **Create projects** - Start new projects with a name and description
- **Team collaboration** - Search and add members to your projects
- **Task management** - Create tasks, assign them to team members, set priorities and track status
- **User authentication** - Secure login and registration

## Tech Stack

**Backend:**
- Django & Django REST Framework
- SQLite database
- JWT authentication

**Frontend:**
- React with React Router
- Axios for API calls
- Clean, responsive UI

## Getting Started

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Start the server:
   ```bash
   python manage.py runserver
   ```

Backend will run at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

Frontend will run at `http://localhost:5173`

## How to Use

1. **Register** - Create a new account
2. **Login** - Sign in with your credentials
3. **Create a Project** - Start a new project from the dashboard
4. **Add Members** - Search for users by username and add them to your project
5. **Create Tasks** - Add tasks, assign them to team members, and track progress
6. **Manage Everything** - Update task status, remove members, or delete projects as needed

## Features

- JWT token-based authentication
- Real-time user search for adding members
- Task filtering and management
- Project-based collaboration
- Clean and intuitive interface

## API Endpoints

- `/api/auth/register/` - User registration
- `/api/auth/login/` - User login
- `/api/auth/search/?q=<username>` - Search users by username
- `/api/projects/` - List and create projects
- `/api/projects/<id>/` - Get, update, delete a project
- `/api/projects/<id>/members/` - Manage project members
- `/api/tasks/` - List and create tasks
- `/api/tasks/<id>/` - Get, update, delete a task

---

Built with Django REST Framework and React

## Project Structure

### Backend

```
backend/
├── manage.py
├── requirements.txt
├── db.sqlite3
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── users/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
├── projects/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
├── tasks/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── permissions.py
│   ├── urls.py
│   └── migrations/
└── common/
    └── paginator.py
```

**What's what:**
- `manage.py` - Command line tool to run Django commands
- `requirements.txt` - List of Python packages needed
- `db.sqlite3` - The database file that stores everything
- `config/` - Main Django settings and URL routing
- `users/` - Login, register, and user search code
- `projects/` - Project creation and management code
- `tasks/` - Task creation and management code
- `migrations/` - Database change history (auto-generated)

### Frontend

```
frontend/
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── services/
│   │   └── api.js
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── Dashboard.jsx
│   │   └── ProjectDetail.jsx
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskItem.jsx
│   │   └── MembersList.jsx
│   └── styles/
│       ├── Auth.css
│       ├── Dashboard.css
│       ├── ProjectCard.css
│       ├── ProjectDetail.css
│       ├── TaskList.css
│       ├── TaskItem.css
│       └── MembersList.css
└── public/
```

**What's what:**
- `package.json` - All npm packages your app needs
- `vite.config.js` - How Vite builds your app
- `main.jsx` - Where React starts
- `App.jsx` - Your main app layout with all routes
- `pages/` - Full page components (login, dashboard, etc.)
- `components/` - Smaller UI pieces used across pages
- `styles/` - CSS for each page and component
- `services/` - Code that talks to the backend API

## Database Models

### User (Django's built-in with custom fields)
- id, username, password, email

### Project
- id, name, description, owner (ForeignKey to User), members (ManyToMany to User), created_at, updated_at

### Task
- id, title, description, status (todo/in_progress/done), priority (low/medium/high), project (ForeignKey), created_by (ForeignKey to User), assigned_to (ForeignKey to User), created_at, updated_at

## How Authentication Works

1. User registers → password hashed → stored in database
2. User logs in → credentials validated → JWT tokens issued
3. Access token stored in browser localStorage
4. Every API request includes the token in Authorization header
5. If token expires or becomes invalid (401 error) → automatically redirected to login
6. User can logout → tokens cleared → redirected to login page

## Key Features Explained

### User Search
- Type at least 2 characters of a username
- Results appear in a dropdown below the input
- Click on a username to select them
- Search is real-time and secure (requires authentication)

### Task Assignment
- Only project members can be assigned tasks
- When creating a task, the assignee is selected from project members
- Task creator is automatically recorded
- Task status can be updated anytime

### Project Membership
- Only project owner can add/remove members
- Members can view all tasks in the project
- Search for users by username before adding
- View all members and their details on the Members tab

---

Built with Django REST Framework and React. Made to keep teams organized and productive!

## Developed By

**Akshay**



