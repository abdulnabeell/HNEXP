import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link to="/dashboard" className={`bottom-nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
        <span>Dashboard</span>
      </Link>
      <Link to="/expenses" className={`bottom-nav-item ${location.pathname === "/expenses" ? "active" : ""}`}>
        <span>Expenses</span>
      </Link>
      <Link to="/profile" className={`bottom-nav-item ${location.pathname === "/profile" ? "active" : ""}`}>
        <span>Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
