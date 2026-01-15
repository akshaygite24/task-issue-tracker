# Task Tracker Frontend

A simple, clean, and interactive React frontend for the Django Task & Issue Tracker backend.

## Features

✅ **User Authentication**
- Register new account
- Login with credentials
- JWT token-based authentication
- Secure token storage

✅ **Projects Management**
- View all your projects
- Create new projects
- Delete projects
- View project details

✅ **Tasks Management**
- Create tasks within projects
- Edit task status (Todo, In Progress, Done)
- Edit task priority (Low, Medium, High)
- Delete tasks
- Filter tasks by status and priority
- View task statistics

✅ **Team Collaboration**
- View project members
- Add members by user ID
- Remove members from project
- Owner badge for project owner

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx         # Login form
│   │   ├── RegisterPage.jsx      # Registration form
│   │   ├── Dashboard.jsx         # Projects list
│   │   └── ProjectDetail.jsx     # Project workspace
│   ├── components/
│   │   ├── ProtectedRoute.jsx    # Route protection
│   │   ├── ProjectCard.jsx       # Project card display
│   │   ├── TaskList.jsx          # Task list with filters
│   │   ├── TaskItem.jsx          # Individual task
│   │   └── MembersList.jsx       # Members display
│   ├── services/
│   │   └── api.js                # Axios API calls
│   ├── styles/
│   │   ├── Auth.css              # Auth pages styling
│   │   ├── Dashboard.css         # Dashboard styling
│   │   ├── ProjectCard.css       # Card styling
│   │   ├── ProjectDetail.css     # Project detail styling
│   │   ├── TaskList.css          # Task list styling
│   │   ├── TaskItem.css          # Task item styling
│   │   └── MembersList.css       # Members styling
│   ├── App.jsx                   # Main app with routing
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
└── public/
    └── index.html                # HTML template
```

## How It Works

### 1. **API Service** (`services/api.js`)
- Centralized Axios instance
- Auto-adds JWT token to all requests
- Organized API methods for auth, projects, and tasks

### 2. **Authentication Flow**
- User registers → Auto-login → Stored in localStorage
- User login → Get access token → Stored in localStorage
- Token added to all API requests automatically

### 3. **Protected Routes**
- `ProtectedRoute` component checks for token
- Redirects to login if not authenticated
- Protects dashboard and project pages

### 4. **Component Communication**
- Parent components manage state
- Pass callbacks to child components
- Updates propagate through re-renders

### 5. **Styling Philosophy**
- Custom CSS (no UI frameworks)
- Modern, clean design
- Responsive for mobile/tablet/desktop
- Color scheme: Purple gradient + Tailwind-inspired colors

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Configuration

Make sure backend is running on `http://localhost:8000`

API Base URL: `http://localhost:8000/api`

## Key Technologies

- **React 18** - UI framework
- **React Router v6** - Page routing
- **Axios** - HTTP client
- **Vite** - Build tool (lightning fast)
- **Vanilla CSS** - No dependencies, pure styling

## Simple & Easy to Explain

Every file follows these principles:
- **One responsibility** per component
- **Clear naming** - function/variable names explain purpose
- **Minimal complexity** - easy logic to follow
- **Well-commented** - explains the "why"
- **Standard patterns** - React best practices

## Non-Generic Design

- Purple gradient theme (not default blue)
- Custom card and button styles
- Smooth animations and transitions
- Interactive hover effects
- Color-coded badges for status/priority
- Clean whitespace and typography
