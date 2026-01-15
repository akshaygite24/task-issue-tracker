import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import '../styles/Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) {
      alert('Please enter project name');
      return;
    }

    try {
      const response = await projectsAPI.create(newProject);
      setProjects([...projects, response.data]);
      setNewProject({ name: '', description: '' });
      setShowForm(false);
    } catch (err) {
      alert('Failed to create project');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    onLogout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-top">
          <h1>My Projects</h1>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        {error && <div className="error-message">{error}</div>}

        {!showForm ? (
          <button className="btn-create" onClick={() => setShowForm(true)}>
            + New Project
          </button>
        ) : (
          <div className="create-form">
            <h2>Create Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Enter description"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">Create</button>
                <button type="button" className="btn-secondary" 
                  onClick={() => {
                    setShowForm(false);
                    setNewProject({ name: '', description: '' });
                  }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">No projects yet. Create one!</div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onClick={() => navigate(`/project/${project.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
