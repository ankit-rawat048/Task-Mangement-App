import React from "react";
import {useNavigate, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateNewTask from "./components/CreateNewTask";
import CreateNewProject from "./components/CreateNewProject";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CreateNewProject />} />
          <Route path="/tasks" element={<CreateNewTask />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
