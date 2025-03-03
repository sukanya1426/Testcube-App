
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

export function Header() {

  const { user } = useAuth(); 

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold hover:text-gray-300">
          TestCube
        </Link>

        {/* Navigation Links */}
        <nav className="space-x-6 hidden md:flex">
          <Link to="/dashboard" className="hover:text-gray-400">
            Dashboard
          </Link>
          <Link to="/file-upload" className="hover:text-gray-400">
            File Upload
          </Link>
        </nav>

        
        <div className="relative group">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600">
            <span className="text-white font-bold">{user?.email.charAt(0)}</span>
          </button>

       
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">
              Profile
            </Link>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-200">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
