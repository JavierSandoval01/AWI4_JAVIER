import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

export function AuthRoutes({ children }: Props) {
  // Simula que siempre hay token (usuario autenticado)
  const token = "fake-token";

  return children ? <>{children}</> : <Outlet />;
}
