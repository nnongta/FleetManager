import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import BookingDetail from "./pages/BookingDetail";
import BookingApprove from "./pages/BookingApprove";
import VehicleList from "./pages/VehicleList";
import NewBookingFlow from "./pages/NewBookingFlow";
import { type User } from "./services/auth";
import DriverManagement from "./pages/DriverManagement";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "approver">("admin");

  return (
    <BrowserRouter>
      <Routes>
        {/* หน้า login */}
        {!currentUser && (
          <Route
            path="/*"
            element={
              <Login
                onLogin={(user) => {
                  setCurrentUser(user);
                  setUserRole(user.role === "admin" ? "admin" : "approver");
                }}
              />
            }
          />
        )}

        {/* Main layout สำหรับ user ที่ login แล้ว */}
        {currentUser && (
          <Route path="/*" element={<MainLayout userRole={userRole} setUserRole={setUserRole} />}>
            {/* Nested routes */}
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Booking />} />
            <Route path="bookings/new" element={<NewBookingFlow />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
            <Route path="approve" element={<BookingApprove />} />
            <Route path="vehicles" element={<VehicleList />} />
            <Route path="drivers" element={<DriverManagement />} />
          </Route>
        )}

        {/* ถ้า user พยายามเข้าหน้าอื่นโดยไม่ได้ login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
