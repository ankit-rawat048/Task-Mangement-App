import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import Projects from "./pages/Projects";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/dashboard" />} /> {/* Redirect unknown routes */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/createproject" element={<CreateProject />}/>
        <Route path="/projectdetails/:id" element={<ProjectDetails />}/>
        <Route path="/projects" element={<Projects />}/>
      </Routes>
    </Router>
  );
}

export default App;
