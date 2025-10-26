import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { storageService } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (email: string, name: string, role: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const login = (email: string, password: string): boolean => {
    const loggedInUser = storageService.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  const signup = (email: string, name: string, role: string): boolean => {
    try {
      const newUser = storageService.signup(email, name, role);
      setUser(newUser);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    storageService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
