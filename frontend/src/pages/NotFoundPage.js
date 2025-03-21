import { Link } from "react-router-dom";
import "../styles/Global.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-text">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="not-found-link">
        🔙 Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
