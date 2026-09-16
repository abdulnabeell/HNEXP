import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Receipt, LogOut, X, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profilePhoto } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("expense_tracker_token");
    navigate("/login");
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? "open" : ""}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="expense-item-icon" style={{ width: 32, height: 32, backgroundColor: "var(--color-text-inverse)", color: "var(--color-bg-sidebar)" }}>
            <Receipt size={18} />
          </div>
          <span>FinTrack</span>
          {isOpen && (
            <button className="mobile-nav-toggle" style={{ marginLeft: "auto", color: "white" }} onClick={onClose}>
              <X size={24} />
            </button>
          )}
        </div>
        <nav className="sidebar-nav">
          <Link 
            to="/dashboard" 
            className={`sidebar-link ${location.pathname === "/dashboard" ? "active" : ""}`}
            onClick={onClose}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link 
            to="/expenses" 
            className={`sidebar-link ${location.pathname === "/expenses" ? "active" : ""}`}
            onClick={onClose}
          >
            <Receipt size={20} />
            Expenses
          </Link>
          <Link 
            to="/profile" 
            className={`sidebar-link ${location.pathname === "/profile" ? "active" : ""}`}
            onClick={onClose}
          >
            <User size={20} />
            Profile
          </Link>
        </nav>
        <div className="sidebar-footer" style={{ borderTop: "1px solid var(--color-border)", padding: "var(--spacing-md)" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--color-text-primary)', backgroundImage: profilePhoto ? `url(${profilePhoto})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }}>
              {!profilePhoto && user ? user.name.charAt(0).toUpperCase() : ""}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user ? user.name : "..."}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Personal account</div>
            </div>
          </div>
          <button className="sidebar-link" style={{ width: "100%", background: "none", border: "none", cursor: "pointer", paddingLeft: 0, paddingRight: 0 }} onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
