import { useNavigate } from "react-router-dom"; // 👈 เพิ่มการ Import
import { dbService } from "../../services/db"; // 👈 แก้ Path เป็น ../../

interface StepProps {
    onBack: () => void;
}

export default function BookingConfirmation({ onBack }: StepProps) {
    const navigate = useNavigate(); // 👈 ประกาศตัวแปร navigate ภายใน Component

    const handleCreateBooking = () => {
        // ในอนาคตคุณควรรับ props ข้อมูลจากหน้าก่อนๆ มาใส่ที่นี่
        dbService.createBooking({
            requester_id: 1,
            requester: "John Doe", // เพิ่มชื่อเพื่อให้หน้า Approve และ Detail แสดงผลได้
            purpose: "Corporate Event",
            start_datetime: "2023-10-27T09:00",
            end_datetime: "2023-10-27T17:00",
            pickup_location: "HQ Office",
            dropoff_location: "Convention Center",
            destination: "Convention Center", // ฟิลด์ที่ใช้ใน BookingDetail
            vehicleType: "Toyota Camry (ABC-1234)", // ข้อมูลจากหน้า VehicleSelection
            passenger_count: 5
        });

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