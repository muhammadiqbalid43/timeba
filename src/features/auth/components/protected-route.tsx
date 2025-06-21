import Loading from "@/components/loading";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  const { user, isFetchingUser, userError } = useAuth();

  if (isFetchingUser) {
    return <Loading />;
  }

  if (userError || !user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
