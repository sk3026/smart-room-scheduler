import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import TeacherSchedule from "../pages/TeacherSchedule";
import ManageSchedule from "../pages/ManageSchedule";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-schedule"
        element={
          <ProtectedRoute role="TEACHER">
            <TeacherSchedule />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-schedule"
        element={
          <ProtectedRoute role="HOD">
            <ManageSchedule />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}