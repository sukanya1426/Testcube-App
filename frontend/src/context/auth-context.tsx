import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: { id: string; email: string } | undefined,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("is_authenticated_to_testcube") === "true"
  );

  const [user, setUser] = useState<{ id: string; email: string } | undefined>(
    localStorage.getItem("testcube_user")
      ? JSON.parse(localStorage.getItem("testcube_user")!)
      : undefined
  );

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");

    setUser(data.user);
    setIsAuthenticated(true);

    localStorage.setItem("is_authenticated_to_testcube", "true");
    localStorage.setItem("testcube_user", JSON.stringify(data.user));
  };

  const getUser = async () => {
    const response = await fetch("http://localhost:3000/user/profile");
    const data = await response.json();
    console.log(data);
  }

  const logout = async () => {
    const response = await fetch("http://localhost:3000/user/logout", {
      method: "POST",
      credentials: "include",
    });
    
    if (!response.ok) throw new Error("Logout failed");
    else console.log("Logout successful");
    setIsAuthenticated(false);
    setUser(undefined);
    localStorage.removeItem("is_authenticated_to_testcube");
    localStorage.removeItem("testcube_user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
