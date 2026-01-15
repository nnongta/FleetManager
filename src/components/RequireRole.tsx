import { Navigate } from "react-router-dom";
import { Role, useAuth } from "../auth/auth.store";

export default function RequireRole({
  allow,
  children,
}: {
  allow: Role[];
  children: JSX.Element;
}) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/login" replace />;

  return children;
}
