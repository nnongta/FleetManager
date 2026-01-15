import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import BookingDetail from "./pages/BookingDetail";
import BookingApprove from "./pages/BookingApprove";
import CreateBooking from "./pages/CreateBooking";
import VehicleList from "./pages/VehicleList";

export default function App() {
  const [userRole, setUserRole] = useState<'admin' | 'approver'>('admin');
  const isLoggedIn = true; // mock auth

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <MainLayout userRole={userRole} setUserRole={setUserRole} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<Booking />} />
          <Route path="bookings/new" element={<CreateBooking />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="approve" element={<BookingApprove />} />
          <Route path="vehicles" element={<VehicleList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
