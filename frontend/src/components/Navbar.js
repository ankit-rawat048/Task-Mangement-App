import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Task Manager</h1>
      <div>
        <Link to="/dashboard" className="px-3">Dashboard</Link>
        <Link to="/profile" className="px-3">Profile</Link>
        <Link to="/logout" className="px-3">Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
