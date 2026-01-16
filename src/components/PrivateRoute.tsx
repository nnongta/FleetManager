// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/auth";

interface Props {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
