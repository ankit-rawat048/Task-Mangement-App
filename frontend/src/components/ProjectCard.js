import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const formattedDate = project.dueDate
    ? new Date(project.dueDate).toLocaleDateString()
    : "No due date";

  const tagsArray = Array.isArray(project.tags)
    ? project.tags
    : typeof project.tags === "string"
    ? project.tags.split(",").map((tag) => tag.trim())
    : [];

  return (
    <div className="project-card">
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

      <Link to={`/projectdetails/${project._id}`} className="details-link">
        View Details →
      </Link>
    </div>
  );
};

export default ProjectCard;
