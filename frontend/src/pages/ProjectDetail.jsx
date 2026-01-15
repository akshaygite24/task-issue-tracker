import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI, authAPI } from '../services/api';
import TaskList from '../components/TaskList';
import MembersList from '../components/MembersList';
import '../styles/ProjectDetail.css';

const ProjectDetail = ({ onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assigned_to: '',
  });
  const [newMemberId, setNewMemberId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectRes, tasksRes, membersRes] = await Promise.all([
        projectsAPI.getById(id),
        tasksAPI.getAll({ project_id: id }),
        projectsAPI.getMembers(id),
      ]);
      
      setProject(projectRes.data);
      setTasks(tasksRes.data.results || tasksRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      alert('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      alert('Enter task title');
      return;
    }
    if (!newTask.assigned_to) {
      alert('Please select who to assign this task to');
      return;
    }

    try {
      const response = await tasksAPI.create({
        ...newTask,
        project: parseInt(id),
        assigned_to: parseInt(newTask.assigned_to),
      });
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', status: 'todo', priority: 'medium', assigned_to: '' });
      setShowTaskForm(false);
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleSearchUsers = async (query) => {
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await authAPI.searchUsers(query.trim());
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (err) {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSelectUser = (userId) => {
    const selected = searchResults.find((u) => u.id === userId);
    if (selected) {
      setNewMemberId(userId);
      setSearchQuery(selected.username);
      setShowSearchResults(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberId) {
      alert('Select a user');
      return;
    }

    try {
      await projectsAPI.addMember(id, { user_id: parseInt(newMemberId) });
      setNewMemberId('');
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchResults(false);
      setShowMemberForm(false);
      fetchData();
    } catch (err) {
      alert('Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (confirm('Remove this member?')) {
      try {
        await projectsAPI.removeMember(id, userId);
        fetchData();
      } catch (err) {
        alert('Failed to remove member');
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm('Delete task?')) {
      try {
        await tasksAPI.delete(taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await tasksAPI.update(taskId, updates);
      setTasks(tasks.map(t => t.id === taskId ? response.data : t));
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleDeleteProject = async () => {
    if (confirm('Delete project? This cannot be undone.')) {
      try {
        await projectsAPI.delete(id);
        navigate('/dashboard');
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!project) {
    return <div className="error-screen">Project not found</div>;
  }

  return (
    <div className="project-detail-container">
      <header className="project-header">
        <div className="header-top">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>← Back</button>
          <button className="btn-logout" onClick={() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            onLogout();
            navigate('/login');
          }}>Logout</button>
        </div>
        <div className="header-content">
          <h1>{project.name}</h1>
          {project.description && <p>{project.description}</p>}
        </div>
      </header>

      <main className="project-main">
        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks ({tasks.length})
          </button>
          <button 
            className={`tab ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Members ({members.length})
          </button>
          <button className="btn-delete-project" onClick={handleDeleteProject}>
            Delete Project
          </button>
        </div>

        {activeTab === 'tasks' && (
          <div className="tasks-section">
            {!showTaskForm ? (
              <button className="btn-create" onClick={() => setShowTaskForm(true)}>
                + New Task
              </button>
            ) : (
              <div className="create-form">
                <h2>Create Task</h2>
                <form onSubmit={handleCreateTask}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Task title"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={newTask.status}
                        onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                      >
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Priority</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Assign To</label>
                    <select
                      value={newTask.assigned_to}
                      onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
                      required
                    >
                      <option value="">Select a member...</option>
                      {members.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.username}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Description"
                      rows="3"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">Create</button>
                    <button type="button" className="btn-secondary" onClick={() => {
                      setShowTaskForm(false);
                      setNewTask({ title: '', description: '', status: 'todo', priority: 'medium', assigned_to: '' });
                    }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <TaskList 
              tasks={tasks}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          </div>
        )}

        {activeTab === 'members' && (
          <div className="members-section">
            {!showMemberForm ? (
              <button className="btn-create" onClick={() => setShowMemberForm(true)}>
                + Add Member
              </button>
            ) : (
              <div className="create-form">
                <h2>Add Member</h2>
                <form onSubmit={handleAddMember}>
                  <div className="form-group">
                    <label>Search by Username</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchUsers(e.target.value)}
                      placeholder="Type at least 2 characters"
                      autoComplete="off"
                    />

                    {showSearchResults && (
                      <ul className="search-results">
                        {searchResults.length === 0 && (
                          <li className="search-empty">No users found</li>
                        )}
                        {searchResults.map((user) => (
                          <li
                            key={user.id}
                            className={`search-item ${user.id === newMemberId ? 'selected' : ''}`}
                            onClick={() => handleSelectUser(user.id)}
                          >
                            {user.username}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">Add</button>
                    <button type="button" className="btn-secondary" onClick={() => {
                      setShowMemberForm(false);
                      setNewMemberId('');
                    }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <MembersList 
              members={members}
              projectOwnerId={project.owner}
              onRemove={handleRemoveMember}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectDetail;
