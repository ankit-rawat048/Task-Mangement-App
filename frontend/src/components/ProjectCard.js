import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <div className="border p-4 rounded shadow-md bg-white">
      <h2 className="text-lg font-semibold">{project.title}</h2>
      <p className="text-sm text-gray-600">{project.description}</p>
      <Link to={`/projects/${project._id}`} className="text-blue-500 mt-2 block">View Tasks</Link>
    </div>
  );
};

export default ProjectCard;
