import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../services/authApi";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // if (allowedRoles && user && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/profile" replace />;
  // }

  return <>{children}</>;
}
