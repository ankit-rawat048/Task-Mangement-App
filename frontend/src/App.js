import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/settings" />} /> {/* Redirect unknown routes */}
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
