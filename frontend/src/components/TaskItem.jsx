import React, { useState } from 'react';
import '../styles/TaskItem.css';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: task.status,
    priority: task.priority,
  });

  const handleSave = async () => {
    await onUpdate(task.id, editData);
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': '#ef4444',
      'medium': '#f59e0b',
      'low': '#10b981',
    };
    return colors[priority] || '#6b7280';
  };

  const getStatusBg = (status) => {
    const colors = {
      'done': '#d1fae5',
      'in_progress': '#dbeafe',
      'todo': '#f3f4f6',
    };
    return colors[status] || '#f3f4f6';
  };

  return (
    <div className="task-item">
      <div className="task-content">
        <h4>{task.title}</h4>
        {task.description && <p>{task.description}</p>}
      </div>

      <div className="task-meta">
        {isEditing ? (
          <div className="task-edit-mode">
            <select 
              value={editData.status}
              onChange={(e) => setEditData({...editData, status: e.target.value})}
              className="edit-select"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <select 
              value={editData.priority}
              onChange={(e) => setEditData({...editData, priority: e.target.value})}
              className="edit-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button className="btn-save" onClick={handleSave}>Save</button>
            <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <div className="task-badges">
              <span 
                className="badge status-badge"
                style={{ backgroundColor: getStatusBg(task.status) }}
              >
                {task.status.replace('_', ' ')}
              </span>
              <span 
                className="badge priority-badge"
                style={{ backgroundColor: getPriorityColor(task.priority) + '20', color: getPriorityColor(task.priority) }}
              >
                {task.priority}
              </span>
            </div>

            <div className="task-actions">
              <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="btn-delete" onClick={() => onDelete(task.id)}>Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
