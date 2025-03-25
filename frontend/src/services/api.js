const API_URL = "http://localhost:5000/api";

export const apiRequest = async (endpoint, method = "GET", body = null, auth = false) => {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${endpoint}`, options);
  return response.json();
};

export const loginUser = (credentials) => apiRequest("/auth/login", "POST", credentials);
export const signupUser = (credentials) => apiRequest("/auth/signup", "POST", credentials);
export const fetchProjects = () => apiRequest("/projects", "GET", null, true);
export const fetchTasks = (projectId) => apiRequest(`/projects/${projectId}/tasks`, "GET", null, true);
export const addTask = (projectId, taskData) => apiRequest(`/projects/${projectId}/tasks`, "POST", taskData, true);
