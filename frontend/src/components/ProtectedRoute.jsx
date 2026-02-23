import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/" />;
  }

  if (role && user?.role !== role) {
    return <div className="p-6 text-red-600">Access Denied</div>;
  }

  return children;
}