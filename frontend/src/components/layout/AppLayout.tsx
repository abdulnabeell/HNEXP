import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ color: 'var(--color-text-secondary)' }}>Loading HNEXP...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="main-wrapper">
        <Header />
        {!isOnline && (
          <div style={{ backgroundColor: '#111111', color: '#FFFFFF', padding: '12px', textAlign: 'center', fontSize: '14px', borderBottom: '1px solid #242424', zIndex: 30 }}>
            You're offline. Reconnect to update your expenses.
          </div>
        )}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
