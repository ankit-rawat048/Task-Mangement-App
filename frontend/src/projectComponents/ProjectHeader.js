import React from 'react';
import '../projectComponents/StyleOfProject.css';

const CircularProgress = ({ percentage }) => {
  const radius = 80;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getProgressColor = () => {
    if (percentage < 40) return '#f44336'; // red
    if (percentage < 70) return '#ff9800'; // orange
    return '#4caf50'; // green
  };

  return (
    <svg height={radius * 2} width={radius * 2} style={{ maxWidth: '100%' }}>
      <circle
        stroke="#e0e0e0"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={getProgressColor()}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }}
      />
      <text
        x="50%"
        y="50%"
        dy="0.3em"
        textAnchor="middle"
        className="circular-progress-text-primary"
      >
        {percentage}%
      </text>
      <text
        x="50%"
        y="65%"
        dy="1.3em"
        textAnchor="middle"
        className="circular-progress-text-secondary"
      >
        Tasks Completed
      </text>
    </svg>
  );
};

const ProjectHeader = ({ project }) => {
  const progress = project.progress ?? 0;

  return (
    <div className="project-header-container">
      <div className="project-header-left">
        <h1 className="project-header-title">{project.title}</h1>
        <p className="project-header-description">{project.description}</p>
        <p className="project-header-detail">
          <span className="project-header-strong">Created:</span>{' '}
          {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
        </p>
        <p className="project-header-detail">
          <span className="project-header-strong">Due:</span>{' '}
          {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}
        </p>
        <p className="project-header-detail">
          <span className="project-header-strong">Tags:</span>{' '}
          {project.tags?.length ? project.tags.join(', ') : 'None'}
        </p>
      </div>

      <div className="project-header-right">
        <CircularProgress percentage={progress} />
      </div>
    </div>
  );
};

export default ProjectHeader;
