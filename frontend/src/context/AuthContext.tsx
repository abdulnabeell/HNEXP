import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthService } from "../services/auth.service";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profilePhoto: string | null;
  setProfilePhoto: (photo: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  profilePhoto: null,
  setProfilePhoto: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhotoState] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("expense_tracker_token");
        if (token) {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
          
          const storedPhoto = localStorage.getItem(`profile_photo_${userData.id}`);
          if (storedPhoto) setProfilePhotoState(storedPhoto);
        }
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const setProfilePhoto = (photo: string | null) => {
    setProfilePhotoState(photo);
    if (user) {
      if (photo) {
        localStorage.setItem(`profile_photo_${user.id}`, photo);
      } else {
        localStorage.removeItem(`profile_photo_${user.id}`);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, profilePhoto, setProfilePhoto }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
