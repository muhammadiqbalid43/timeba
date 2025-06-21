import type { ReactNode } from "react";
import { useAuth } from "../hooks/use-auth";
import Loading from "@/components/loading";
import { Navigate } from "react-router";

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, isFetchingUser } = useAuth();

  if (isFetchingUser) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export default PublicRoute;
