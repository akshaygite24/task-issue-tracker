import React, { useState } from 'react';
import TaskItem from './TaskItem';
import '../styles/TaskList.css';

const TaskList = ({ tasks, onUpdate, onDelete }) => {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const filteredTasks = tasks.filter(task => {
    if (filterStatus && task.status !== filterStatus) return false;
    if (filterPriority && task.priority !== filterPriority) return false;
    return true;
  });

  const stats = {
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className="task-list-container">
      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-label">Todo</span>
          <span className="stat-count">{stats.todo}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">In Progress</span>
          <span className="stat-count">{stats.inProgress}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Done</span>
          <span className="stat-count">{stats.done}</span>
        </div>
      </div>

      <div className="task-filters">
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select 
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="filter-select"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-tasks">
          {tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map(task => (
            <TaskItem 
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
