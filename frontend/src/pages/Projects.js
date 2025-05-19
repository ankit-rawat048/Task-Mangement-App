// src/pages/Projects.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import Navbar from "../components/Navbar";
import '../styles/csspages/Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;

  const token = localStorage.getItem("token");
  const api = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  const createProjects = () => navigate("/createproject");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      console.warn("No token found. User might not be logged in.");
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api}/api/projects`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token, api]);

  // Filter based on search term and status
  const filteredProjects = projects
    .filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((project) => {
      if (filter === "All") return true;
      if (filter === "Completed") return project.status === "Completed";
      if (filter === "In Progress") return project.status === "In Progress";
      return true;
    });

  // Sort projects
  const sortedProjects = filteredProjects.sort((a, b) => {
    if (sort === "name") {
      return a.title.localeCompare(b.title);
    } else if (sort === "date") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePagination = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <Navbar />
      </div>

      {/* Search, Filter, Sort */}
      <div className="projects-filters">
        <input
          type="text"
          placeholder="Search Projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-dropdown"
        >
          <option value="All">All Projects</option>
          <option value="Completed">Completed Projects</option>
          <option value="In Progress">In Progress</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sort-dropdown"
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      {/* Create New Project Button */}
      <div className="create-project-btn">
        <button onClick={createProjects} className="create-btn">
          + Create Project
        </button>
      </div>

      {/* Loading & Projects Grid */}
      {loading ? (
        <p className="loading-text">Loading projects...</p>
      ) : (
        <div className="projects-grid">
          {currentProjects.length > 0 ? (
            currentProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))
          ) : (
            <p className="no-projects">No projects found.</p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePagination(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Prev
        </button>
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => handlePagination(number + 1)}
            className={`pagination-btn ${
              currentPage === number + 1 ? "active" : ""
            }`}
          >
            {number + 1}
          </button>
        ))}
        <button
          onClick={() => handlePagination(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Projects;
