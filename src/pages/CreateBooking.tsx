// src/pages/CreateBooking.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsageDetails from "./steps/UsageDetails";
import VehicleSelection from "./steps/VehicleSelection";
import BookingConfirmation from "./steps/BookingConfirmation";
import { authService } from "../services/auth";
import { dbService } from "../services/db";

export default function CreateBooking() {
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [bookingData, setBookingData] = useState({
    purpose: "",
    start_datetime: "",
    end_datetime: "",
    pickup_location: "",
    dropoff_location: "",
    booking_type: "Self-Drive",
    driver_license_no: "",
    license_image_url: "",
    vehicle_id: null,
    vehicleType: "",
    passenger_count: 0,
    passenger_list: [],
  });

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // ส่ง Booking ไป dbService
  const handleCreateBooking = () => {
    if (!currentUser) return alert("User not logged in");

    const finalData = {
      ...bookingData,
      id: crypto.randomUUID(),
      requester_id: currentUser.id,
      status: "Pending",
    };

    try {
      dbService.createBooking(finalData);
      alert("Booking created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.message || "Failed to create booking");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col gap-8">
      {/* Stepper & Header omitted for brevity */}

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className={`${currentStep === 3 ? "lg:col-span-full" : "lg:col-span-2"}`}>
          {currentStep === 1 && (
            <UsageDetails formData={bookingData} setFormData={setBookingData} onNext={nextStep} />
          )}
          {currentStep === 2 && (
            <VehicleSelection
              formData={bookingData}
              setFormData={setBookingData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 3 && (
            <BookingConfirmation
              formData={bookingData}
              setFormData={setBookingData}
              onBack={prevStep}
              onSubmit={handleCreateBooking} // เพิ่ม prop ส่ง booking จริง
            />
          )}
        </div>

        {/* Booking Summary */}
        {currentStep !== 3 && (
          <aside className="lg:col-span-1">
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <h4 className="font-bold">Booking Summary</h4>
              <p>Pickup: {bookingData.pickup_location || "-"}</p>
              <p>Dropoff: {bookingData.dropoff_location || "-"}</p>
              <p>Passengers: {bookingData.passenger_count}</p>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}
