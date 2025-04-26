import React from 'react';

const ProjectHeader = ({ project }) => {
  return (
    <div className="project-header">
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p><strong>Created:</strong> {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Due:</strong> {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Tags:</strong> {project.tags?.length ? project.tags.join(', ') : 'None'}</p>
      <p><strong>Progress:</strong> {project.progress != null ? `${project.progress}%` : '0%'}</p>
    </div>
  );
};

export default ProjectHeader;
