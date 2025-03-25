import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <ul>
        <li className="mb-4"><Link to="/dashboard">📌 Dashboard</Link></li>
        <li className="mb-4"><Link to="/projects">📂 Projects</Link></li>
        <li className="mb-4"><Link to="/tasks">📝 Tasks</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
