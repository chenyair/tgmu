import * as React from 'react';

export interface AuthContext {
  isAuthenticated: boolean;
  setUser: (username: string | null) => void;
  user: string | null; // TOOO: Replace with user
}

const AuthContext = React.createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<string | null>(null);
  const isAuthenticated = !!user;
  return <AuthContext.Provider value={{ isAuthenticated, user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};