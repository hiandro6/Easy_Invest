import { createContext, useState, useEffect } from "react";
import { login as apiLogin } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
  }, []);

  async function login(email, password) {
    const data = await apiLogin(email, password);

    localStorage.setItem("token", data.access_token);
    setUser({ token: data.access_token });
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
