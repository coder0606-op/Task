import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <Link
        to="/dashboard"
        className="font-bold text-xl tracking-wide"
      >
        TaskCollab
      </Link>

      <div className="flex items-center gap-4">
        {user && (
          <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            {user.name}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
