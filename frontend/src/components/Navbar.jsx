import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (

    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">

      <h1 className="font-bold text-lg">
        Smart Room Scheduler
      </h1>

      <div className="flex items-center gap-4">

        {/* Dashboard */}
        <Link to="/dashboard" className="hover:underline">
          Rooms
        </Link>

        {/* Admin Panel visible only for SUPERADMIN */}
        {user?.role === "SUPERADMIN" && (
          <Link to="/admin" className="hover:underline">
            Admin Panel
          </Link>
        )}

        <span>
          {user?.username} ({user?.role})
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>

      </div>

    </div>

  );

}