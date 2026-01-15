import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Layout</h1>
      <hr />
      <Outlet />
    </div>
  );
}
