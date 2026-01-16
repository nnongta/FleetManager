import { useState } from "react";
import UsageDetails from "./steps/UsageDetails";
import BookingConfirmation from "./steps/BookingConfirmation";
import VehicleSelection from "./steps/VehicleSelection";

    
export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    start_date: "2023-10-27",
    start_time: "09:00",
    end_date: "2023-10-28",
    end_time: "18:00",
    pickup_location: "",
    dropoff_location: "",
    sameAsPickup: false,
    driverType: "self", // 'required' | 'self'
    licenseNumber: "",
    vehicle: "",
    passengers: []
  });

  const updateData = (fields: Partial<typeof bookingData>) => {
    setBookingData(prev => ({ ...prev, ...fields }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {step === 1 && <UsageDetails data={bookingData} updateData={updateData} onNext={() => setStep(2)} onCancel={function (): void {
              throw new Error("Function not implemented.");
          } } />}
      {step === 2 && <VehicleSelection data={bookingData} updateData={updateData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <BookingConfirmation data={bookingData} onBack={() => setStep(2)} />}
    </div>
  );
}