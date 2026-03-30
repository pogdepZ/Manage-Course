import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { registerAuthRefreshHandler } from '../api/http';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../utils/tokenManager';

const USER_KEY = 'mc_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const [accessToken, setAccessToken] = useState(() => getAccessToken());
  const [refreshToken, setRefreshToken] = useState(() => getRefreshToken());

  useEffect(() => {
    registerAuthRefreshHandler((tokens) => {
      if (!tokens) {
        logout();
        return;
      }
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
    });
  }, []);

  const login = (nextUser, nextAccessToken, nextRefreshToken) => {
    setUser(nextUser);
    setAccessToken(nextAccessToken);
    setRefreshToken(nextRefreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setTokens(nextAccessToken, nextRefreshToken);
  };

  const logout = () => {
    setUser(null);
    setAccessToken('');
    setRefreshToken('');
    localStorage.removeItem(USER_KEY);
    clearTokens();
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken && user),
      login,
      logout,
    }),
    [user, accessToken, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
