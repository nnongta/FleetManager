import { useNavigate } from "react-router-dom"; // 👈 เพิ่มการ Import
import { dbService } from "../../services/db"; // 👈 แก้ Path เป็น ../../

interface StepProps {
  onBack: () => void;
}

export default function BookingConfirmation({ onBack }: StepProps) {
  const navigate = useNavigate(); // 👈 ประกาศตัวแปร navigate ภายใน Component

  const handleCreateBooking = () => {
    dbService.createBooking({
      requester_id: 1,
      purpose: "Corporate Event",
      start_datetime: "2023-10-27T09:00",
      end_datetime: "2023-10-27T17:00",
      pickup_location: "HQ Office",
      dropoff_location: "Convention Center",
      passenger_count: 5
    });
    
    // เมื่อบันทึกสำเร็จ ระบบจะเปลี่ยนสถานะเป็น Pending อัตโนมัติ 
    navigate("/bookings"); 
  };

  return (
    <div className="bg-white p-8 rounded-xl border">
      <h3 className="text-xl font-bold mb-6">Review & Confirm</h3>
      <div className="flex justify-between mt-10 border-t pt-6">
        <button onClick={onBack} className="text-slate-500 font-bold">Back</button>
        <button 
          onClick={handleCreateBooking}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold"
        >
          Create Booking
        </button>
      </div>
    </div>
  );
}