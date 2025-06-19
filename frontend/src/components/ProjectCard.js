// src/components/ProjectCard.js
import { Link } from "react-router-dom";

// Internal styles using a <style> tag
const styles = `
  .project-card {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    background-color: #fafafa;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    transition: box-shadow 0.3s ease;
    width:fit-content;
  }

  .project-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .project-title {
    margin: 0 0 10px;
    font-size: 1.5rem;
    color: #333;
  }

  .project-description {
    margin-bottom: 10px;
    color: #555;
  }

  .project-info {
    margin: 5px 0;
    color: #666;
    font-size: 0.95rem;
  }

  .project-tags {
    margin-top: 10px;
  }

  .project-tag {
    display: inline-block;
    background-color: #e0f2f1;
    color: #00695c;
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 0.8rem;
    margin-right: 6px;
    margin-bottom: 6px;
  }

  .details-link {
    display: inline-block;
    margin-top: 12px;
    color: #1e88e5;
    text-decoration: none;
    font-weight: bold;
  }

  .details-link:hover {
    text-decoration: underline;
  }

  .project-header-right {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .circular-progress-text-primary {
    font-size: 1.2rem;
    fill: #333;
    font-weight: bold;
  }

  .circular-progress-text-secondary {
    font-size: 0.7rem;
    fill: #777;
  }
`;

const Style = () => <style>{styles}</style>;

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

const ProjectCard = ({ project }) => {
  const formattedDate = project.dueDate
    ? new Date(project.dueDate).toLocaleDateString()
    : "No due date";

  const tagsArray = Array.isArray(project.tags)
    ? project.tags
    : typeof project.tags === "string"
    ? project.tags.split(",").map((tag) => tag.trim())
    : [];

  const handleClick = () => {
    console.log("Clicked project:", project);
  };

  return (
    <>
      <Style />
      <div className="project-card">
        <div>
          <h2 className="project-title">{project.title}</h2>
          <p className="project-description">{project.description}</p>

          <p className="project-info">
            <strong>Tasks:</strong> {project.tasks?.length || 0}
          </p>

          <p className="project-info">
            <strong>Due Date:</strong> {formattedDate}
          </p>

          {tagsArray.length > 0 && (
            <div className="project-tags">
              {tagsArray.map((tag, index) => (
                <span key={index} className="project-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Link
            to={`/projectdetails/${project._id}`}
            className="details-link"
            onClick={handleClick}
          >
            View Details →
          </Link>
        </div>

        <div className="project-header-right">
          <CircularProgress percentage={project.progress || 0} />
        </div>
      </div>
    </>
  );
};

export default ProjectCard;
