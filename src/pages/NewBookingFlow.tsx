import { useState } from "react";
import UsageDetails from "./steps/UsageDetails";
import BookingConfirmation from "./steps/BookingConfirmation";
import VehicleSelection from "./steps/VehicleSelection";

export default function NewBookingFlow() {
    const [step, setStep] = useState(1);
    
    // สร้าง State กลางเพื่อเก็บข้อมูลการจอง (แก้ Error undefined)
    const [formData, setFormData] = useState({
        start_date: new Date().toISOString().split('T')[0],
        start_time: "09:00",
        end_date: new Date().toISOString().split('T')[0],
        end_time: "18:00",
        pickup_location: "",
        dropoff_location: "",
        sameAsPickup: false,
        driverType: "self",
        vehicle: "",
        licenseNumber: "",
    });

    const updateData = (fields: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            {/* Stepper Header (Optional) */}
            {/* <div className="mb-8 flex items-center justify-center gap-4">
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-2 w-16 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
                ))}
            </div> */}

            {step === 1 && (
                <UsageDetails 
                    data={formData} 
                    updateData={updateData} 
                    onNext={() => setStep(2)} 
                />
            )}
            
            {step === 2 && (
                <VehicleSelection 
                    data={formData} 
                    updateData={updateData} 
                    onNext={() => setStep(3)} 
                    onBack={() => setStep(1)} 
                />
            )}

            {step === 3 && (
                <BookingConfirmation 
                    formData={formData} 
                    onBack={() => setStep(2)} 
                />
            )}
        </div>
    );
}