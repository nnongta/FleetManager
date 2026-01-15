import { useNavigate } from "react-router-dom";
import { dbService } from "../../services/db";

interface StepProps {
    onBack: () => void;
}

export default function BookingConfirmation({ onBack }: StepProps) {
    const navigate = useNavigate();

    const handleCreateBooking = () => {
        dbService.createBooking({
            requester_id: 1,
            requester: "John Doe",
            purpose: "Corporate Event",
            start_datetime: "2023-10-24T09:30",
            end_datetime: "2023-10-24T11:00",
            pickup_location: "SFO International Airport, Terminal 2",
            dropoff_location: "Fairmont Hotel, San Francisco",
            destination: "Fairmont Hotel, San Francisco",
            vehicleType: "Mercedes-Benz V-Class",
            passenger_count: 3
        });

        navigate("/bookings");
    };

    return (
        <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ฝั่งซ้าย: ตารางรายชื่อผู้โดยสาร */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Add Passengers</h1>
                    <p className="text-gray-500 text-base max-w-2xl">
                        Manually enter passenger details below or upload a CSV file for bulk addition. Ensure contact information is accurate for notifications.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="flex border-b border-gray-200 px-6">
                        <button className="flex items-center gap-2 border-b-[3px] border-primary text-primary px-4 py-4 focus:outline-none">
                            <span className="material-symbols-outlined text-xl">edit_note</span>
                            <span className="text-sm font-bold tracking-wide">Manual Entry</span>
                        </button>
                        <button className="flex items-center gap-2 border-b-[3px] border-transparent text-gray-500 hover:text-gray-700 px-4 py-4 focus:outline-none transition-colors">
                            <span className="material-symbols-outlined text-xl">upload_file</span>
                            <span className="text-sm font-bold tracking-wide">Bulk Upload</span>
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3 px-2 text-xs font-semibold uppercase text-gray-500 tracking-wider w-[5%]">#</th>
                                        <th className="py-3 px-2 text-xs font-semibold uppercase text-gray-500 tracking-wider w-[30%]">Full Name</th>
                                        <th className="py-3 px-2 text-xs font-semibold uppercase text-gray-500 tracking-wider w-[25%]">Phone Number</th>
                                        <th className="py-3 px-2 text-xs font-semibold uppercase text-gray-500 tracking-wider w-[30%]">Email Address</th>
                                        <th className="py-3 px-2 text-center text-xs font-semibold uppercase text-gray-500 tracking-wider w-[10%]">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {/* ตัวอย่างแถวข้อมูลที่ 1 */}
                                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-2 text-gray-400">1</td>
                                        <td className="py-3 px-2 font-medium">Alice Freeman</td>
                                        <td className="py-3 px-2">+1 (555) 012-3456</td>
                                        <td className="py-3 px-2">alice.f@company.com</td>
                                        <td className="py-3 px-2 text-center">
                                            <button className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-lg">delete</span></button>
                                        </td>
                                    </tr>
                                    {/* ตัวอย่างแถวข้อมูลที่ 2 */}
                                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-2 text-gray-400">2</td>
                                        <td className="py-3 px-2 font-medium">Robert Chen</td>
                                        <td className="py-3 px-2">+1 (555) 987-6543</td>
                                        <td className="py-3 px-2">r.chen@company.com</td>
                                        <td className="py-3 px-2 text-center">
                                            <button className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-lg">delete</span></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <button className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors py-2 px-3 rounded hover:bg-blue-50 w-fit">
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            Add Another Passenger
                        </button>
                    </div>
                </div>

                {/* ปุ่ม Action ด้านล่าง */}
                <div className="flex items-center justify-between pt-4 pb-10">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Back
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="hidden sm:flex px-6 py-3 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors">
                            Save as Draft
                        </button>
                        <button 
                            onClick={handleCreateBooking}
                            className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                        >
                            Create Booking
                        </button>
                    </div>
                </div>
            </div>

            {/* ฝั่งขวา: Booking Summary */}
            <div className="lg:col-span-4">
                <div className="sticky top-24 flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-gray-900 font-bold text-lg">Booking Summary</h3>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">Draft</span>
                        </div>
                        <div className="h-40 w-full relative bg-gray-200">
                            {/* ใส่รูปแผนที่จำลอง */}
                            <div className="w-full h-full bg-slate-300 flex items-center justify-center text-gray-500">
                                [ Map Preview ]
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                                <p className="text-white text-xs font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">distance</span> 42.5 miles
                                </p>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                    <span className="material-symbols-outlined">calendar_today</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date & Time</p>
                                    <p className="text-gray-900 font-semibold">Oct 24, 2023</p>
                                    <p className="text-gray-600 text-sm">09:30 AM - 11:00 AM</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                    <span className="material-symbols-outlined">directions_car</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Vehicle</p>
                                    <p className="text-gray-900 font-semibold">Mercedes-Benz V-Class</p>
                                    <p className="text-gray-600 text-sm">Luxury Van • 6 Seats</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start relative">
                                <div className="absolute left-[19px] top-10 bottom-2 w-0.5 bg-gray-200"></div>
                                <div className="flex flex-col gap-6 w-full">
                                    <div className="flex gap-4">
                                        <div className="mt-1 size-2.5 rounded-full ring-4 ring-green-100 bg-green-500 shrink-0 z-10"></div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-medium">Pickup</p>
                                            <p className="text-gray-900 text-sm font-medium">SFO International Airport, Terminal 2</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="mt-1 size-2.5 rounded-full ring-4 ring-red-100 bg-red-500 shrink-0 z-10"></div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-medium">Dropoff</p>
                                            <p className="text-gray-900 text-sm font-medium">Fairmont Hotel, San Francisco</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* ส่วนแนะนำ Bulk Upload */}
                    <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-blue-600">info</span>
                            <div>
                                <p className="text-gray-900 font-semibold text-sm mb-1">Need to add 50+ passengers?</p>
                                <p className="text-gray-600 text-xs leading-relaxed">
                                    Use the <a className="text-blue-600 font-medium hover:underline" href="#">Bulk Upload</a> tab to import a CSV file directly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}