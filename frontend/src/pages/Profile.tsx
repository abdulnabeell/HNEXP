import { useRef, useState, useEffect } from "react";
import { Mail, Calendar, LogOut, Camera, Download } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, loading, profilePhoto, setProfilePhoto } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const isStandaloneMode = ('standalone' in window.navigator && (window.navigator as any).standalone) || window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  if (loading) return <div className="main-content">Loading profile...</div>;
  if (!user) return <div className="main-content auth-error">Failed to load profile.</div>;

  const handleLogout = () => {
    localStorage.removeItem("expense_tracker_token");
    navigate("/login");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: 40 }}>
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Personal account</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <div className="profile-header">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', backgroundColor: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 600, color: 'var(--color-text-primary)', backgroundImage: profilePhoto ? `url(${profilePhoto})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              {!profilePhoto && user ? user.name.charAt(0).toUpperCase() : ""}
            </div>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '8px 16px', fontSize: 14 }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={16} />
              Change photo
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="profile-info">
            <h2 style={{ fontSize: 28, marginBottom: 8, fontWeight: 700 }}>{user.name}</h2>
            <div className="profile-email">
              <Mail size={18} style={{ flexShrink: 0 }} />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 24, paddingBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-secondary)', fontSize: 16 }}>
            <Calendar size={18} />
            Account created: {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 24 }}>
          {(!isStandalone && (isIOS || deferredPrompt)) && (
            <div style={{ marginBottom: 24, padding: 16, backgroundColor: 'var(--color-secondary)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Download size={18} />
                Install HNEXP
              </h3>
              
              {isIOS ? (
                <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  <p style={{ marginBottom: 8 }}>Install this app on your iPhone for the best experience:</p>
                  <ol style={{ paddingLeft: 20, margin: 0 }}>
                    <li>Open HNEXP in Safari.</li>
                    <li>Tap the Share button.</li>
                    <li>Select "Add to Home Screen".</li>
                    <li>Tap Add.</li>
                  </ol>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>Install app to your home screen.</p>
                  <button className="btn btn-primary" onClick={handleInstallClick}>Install</button>
                </div>
              )}
            </div>
          )}

          <button className="btn btn-secondary" onClick={handleLogout} style={{ color: 'var(--color-danger)' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
