import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Button } from "./ui/button";

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold hover:text-gray-300">
          TestCube
        </Link>

        {/* Navigation Links */}
        <nav className="space-x-6 hidden md:flex">
          <Link
            to="/"
            className={`hover:text-gray-400 ${
              location.pathname === "/" ? "border-b-2 border-white" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/file-upload"
            className={`hover:text-gray-400 ${
              location.pathname === "/file-upload" ? "border-b-2 border-white" : ""
            }`}
          >
            File Upload
          </Link>
        </nav>

        <div className="flex items-center justify-center gap-6">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600">
            <span className="text-white font-bold">{user?.email.charAt(0).toUpperCase()}</span>
          </button>

          <div>
            <Button className="bg-red-500" onClick={logout}>Logout</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
