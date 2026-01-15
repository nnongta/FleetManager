import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsageDetails from "./steps/UsageDetails";
import VehicleSelection from "./steps/VehicleSelection";
import BookingConfirmation from "./steps/BookingConfirmation";

export default function CreateBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState({
    // ข้อมูลจาก Step 1 [cite: 35-41]
    purpose: "",
    start_datetime: "",
    end_datetime: "",
    pickup_location: "",
    dropoff_location: "",

    // ข้อมูลจาก Step 2 [cite: 43-45]
    booking_type: "Self-Drive",
    driver_license_no: "",
    license_image_url: "", // หลังจากการ Upload ไฟล์จริง
    vehicle_id: null,

    // ข้อมูลจาก Step 3 [cite: 41, 146]
    passenger_count: 0,
    passenger_list: []
  });

  // ฟังก์ชันควบคุมการเปลี่ยน Step
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto py-8 px-4 font-display">

      {/* --- ส่วนหัวข้อ (Title Section) --- */}
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 leading-tight">Create New Booking</h1>
        <p className="text-slate-500 font-medium text-lg">
          Configure the details for the new vehicle reservation.
        </p>
      </header>

      {/* --- Progress Stepper (1-2-3) --- */}
      <nav className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
          {/* Progress Line Background */}
          <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 -z-0 rounded-full"></div>
          {/* Active Progress Line */}
          <div
            className="absolute top-5 left-0 h-1 bg-blue-600 -z-0 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          ></div>

          {[
            { id: 1, title: "Customer", sub: "Personal Details" },
            { id: 2, title: "Vehicle & Driver", sub: "Select Assets" },
            { id: 3, title: "Confirmation", sub: "Review Booking" }
          ].map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-3 bg-white px-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 shadow-sm
                ${currentStep >= s.id ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                {currentStep > s.id ? (
                  <span className="material-symbols-outlined font-bold">check</span>
                ) : s.id}
              </div>
              <div className="text-center">
                <p className={`text-sm font-bold tracking-tight ${currentStep >= s.id ? 'text-blue-600' : 'text-slate-400'}`}>
                  {s.title}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mt-1">
                  {s.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* --- Main Content Grid --- */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* คอลัมน์ซ้าย: แบบฟอร์มในแต่ละ Step */}
        <div className={`${currentStep === 3 ? "lg:col-span-full" : "lg:col-span-2"} order-2 lg:order-1`}>
          {currentStep === 1 && <UsageDetails onNext={nextStep} />}
          {currentStep === 2 && <VehicleSelection onNext={nextStep} onBack={prevStep} />}
          {currentStep === 3 && <BookingConfirmation onBack={prevStep} />}
        </div>

        {/* คอลัมน์ขวา: Booking Summary - ซ่อนเมื่ออยู่ Step 3 */}
        {currentStep !== 3 && (
          <aside className="lg:col-span-1 order-1 lg:order-2">
            <div className="sticky top-24 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ring-1 ring-slate-900/5">
              {/* คอลัมน์ขวา: Booking Summary (แสดงข้อมูลสรุปที่เลือก) */}
              <aside className="lg:col-span-1 order-1 lg:order-2">
                <div className="sticky top-24 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ring-1 ring-slate-900/5">
                  <div className="p-5 border-b bg-slate-50/50">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-[20px]">assignment</span>
                      Booking Summary
                    </h4>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* รายละเอียดวันเวลา */}
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <span className="material-symbols-outlined">calendar_month</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                        <p className="text-sm font-bold text-slate-900">Oct 24, 2023</p>
                        <p className="text-xs font-medium text-slate-500">09:00 AM - 11:00 AM</p>
                      </div>
                    </div>

                    {/* รายละเอียดรถที่เลือก (จะปรากฏใน Step 2-3) */}
                    {currentStep >= 2 && (
                      <div className="flex gap-4 animate-in fade-in duration-500">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                          <span className="material-symbols-outlined">directions_car</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vehicle</p>
                          <p className="text-sm font-bold text-slate-900">Toyota Camry</p>
                          <p className="text-xs font-medium text-slate-500">Sedan • CA 5239</p>
                        </div>
                      </div>
                    )}

                    {/* ส่วนแผนที่ Preview */}
                    <div className="group relative h-40 w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                      <div className="absolute inset-0 bg-blue-600/5 opacity-50"></div>
                      {/* จำลองรูปแผนที่ */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-md ring-1 ring-slate-200 hover:bg-slate-50 transition-all">
                          <span className="material-symbols-outlined text-blue-600 text-[18px]">map</span>
                          Map Preview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}