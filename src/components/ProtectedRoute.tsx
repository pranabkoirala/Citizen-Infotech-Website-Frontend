import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // not logged in → redirect login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // OPTIONAL SAFETY: block non-admin via token decode
  const token = localStorage.getItem("auth_token");

  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload?.is_admin === false) {
        return <Navigate to="/" replace />;
      }
    }
  } catch {
    // ignore decode errors
  }

  return <>{children}</>;
};

export default ProtectedRoute;
