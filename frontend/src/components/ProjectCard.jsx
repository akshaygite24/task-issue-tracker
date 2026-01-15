import React from 'react';
import '../styles/ProjectCard.css';

const ProjectCard = ({ project, onClick }) => {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-header">
        <h3>{project.name}</h3>
      </div>
      {project.description && (
        <p className="project-description">{project.description}</p>
      )}
      <div className="project-footer">
        <span className="member-count">👥 {project.members?.length || 0}</span>
        <span className="arrow">→</span>
      </div>
    </div>
  );
};

export default ProjectCard;
