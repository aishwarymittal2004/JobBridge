import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ role }) {
  const user = useSelector((s) => s.auth.user);

  if (!user) {
    return <Navigate to={role === "hr" ? "/hr/login" : "/login"} replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
