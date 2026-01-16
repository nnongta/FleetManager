import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { dbService } from "../../services/db";

interface Passenger {
    id: number;
    name: string;
    phone: string;
    email: string;
}

// รับ props ข้อมูลที่กรอกมาจากหน้า 1 และ 2
interface StepProps {
    formData: any;
    onBack: () => void;
}

export default function BookingConfirmation({ formData, onBack }: StepProps) {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. State สำหรับจัดการผู้โดยสารในหน้านี้
    const [activeTab, setActiveTab] = useState<'manual' | 'bulk'>('manual');
    const [passengers, setPassengers] = useState<Passenger[]>([
        { id: 1, name: "", phone: "", email: "" }
    ]);

    // 2. ฟังก์ชันจัดการตารางผู้โดยสาร
    const addPassenger = () => {
        setPassengers([...passengers, { id: Date.now(), name: "", phone: "", email: "" }]);
    };

    const removePassenger = (id: number) => {
        setPassengers(passengers.filter(p => p.id !== id));
    };

    const updatePassenger = (id: number, field: keyof Passenger, value: string) => {
        setPassengers(passengers.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    // 3. ฟังก์ชัน Bulk Upload (อ่านไฟล์ CSV)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split("\n").filter(line => line.trim() !== "");
            const newPassengers: Passenger[] = lines.slice(1).map((line, index) => {
                const [name, phone, email] = line.split(",");
                return { id: Date.now() + index, name, phone, email };
            });
            setPassengers(newPassengers);
            setActiveTab('manual');
        };
        reader.readAsText(file);
    };

    // 4. บันทึกข้อมูลลง Database
    const handleCreateBooking = () => {
        const finalData = {
            ...formData, // ข้อมูลจากหน้า 1 & 2 (วันที่, สถานที่, รถ)
            passengers: passengers,
            passenger_count: passengers.length
        };

        dbService.createBooking(finalData);
        alert("Booking created successfully!");
        navigate("/bookings");
    };

    return (
        <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
                {/* --- Stepper Header --- */}
                <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
                    <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                        {/* Progress Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-blue-600 -translate-y-1/2 z-0"></div>
                        <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-blue-600 -translate-y-1/2 z-0"></div>

                        {[
                            { step: 1, label: "Customer", sub: "Personal Details", done: true },
                            { step: 2, label: "Vehicle & Driver", sub: "Select Assets", active: true },
                            { step: 3, label: "Confirmation", sub: "Review Booking", active: true  },
                        ].map((item) => (
                            <div key={item.step} className="relative z-10 flex flex-col items-center gap-2 bg-white px-4">
                                <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${item.done ? 'bg-blue-600 text-white' : item.active ? 'bg-blue-600 text-white ring-4 ring-blue-50' : 'bg-slate-100 text-slate-400'}`}>
                                    {item.done ? <span className="material-symbols-outlined text-xl">check</span> : item.step}
                                </div>
                                <div className="text-center">
                                    <p className={`text-[10px] font-black uppercase tracking-tight ${item.active || item.done ? 'text-blue-600' : 'text-slate-400'}`}>{item.label}</p>
                                    <p className="text-[10px] text-slate-400 hidden sm:block">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Add Passengers</h1>
                    <p className="text-gray-500">กรุณาระบุรายชื่อผู้โดยสารสำหรับการเดินทางครั้งนี้</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200 px-6">
                        <button onClick={() => setActiveTab('manual')} className={`px-6 py-4 font-bold text-sm transition-all ${activeTab === 'manual' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400'}`}>Manual Entry</button>
                        <button onClick={() => setActiveTab('bulk')} className={`px-6 py-4 font-bold text-sm transition-all ${activeTab === 'bulk' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400'}`}>Bulk Upload</button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'manual' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b text-xs text-gray-400 uppercase font-bold tracking-widest">
                                            <th className="py-3 px-2">#</th>
                                            <th className="py-3 px-2">Full Name</th>
                                            <th className="py-3 px-2">Phone</th>
                                            <th className="py-3 px-2 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {passengers.map((p, index) => (
                                            <tr key={p.id} className="border-b border-gray-50">
                                                <td className="py-4 px-2 text-gray-400 font-medium">{index + 1}</td>
                                                <td><input type="text" value={p.name} onChange={(e) => updatePassenger(p.id, 'name', e.target.value)} className="w-full border-none focus:ring-0 font-medium" placeholder="John Doe" /></td>
                                                <td><input type="text" value={p.phone} onChange={(e) => updatePassenger(p.id, 'phone', e.target.value)} className="w-full border-none focus:ring-0" placeholder="08x-xxx-xxxx" /></td>
                                                <td className="text-center">
                                                    <button onClick={() => removePassenger(p.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button onClick={addPassenger} className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline">
                                    <span className="material-symbols-outlined">add_circle</span> Add Passenger
                                </button>
                            </div>
                        ) : (
                            <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">upload_file</span>
                                <p className="text-gray-600 font-medium mb-1">Drag and drop your CSV file here</p>
                                <p className="text-gray-400 text-xs mb-6">Format: Name, Phone, Email</p>
                                <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
                                <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">Browse Files</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center py-6">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span> Back
                    </button>
                    <button onClick={handleCreateBooking} className="bg-blue-600 text-white px-12 py-4 rounded-xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                        Complete Booking
                    </button>
                </div>
            </div>

            {/* ส่วนขวา: Summary ที่ซิงค์กับ formData จริง */}
            <div className="lg:col-span-4">
                <div className="sticky top-10 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <span className="font-black text-gray-900 tracking-tight">Trip Summary</span>
                            <span className="text-[10px] font-black uppercase bg-blue-600 text-white px-2 py-1 rounded">Preview</span>
                        </div>

                        {/* MAP: ซิงค์จาก Pick-up หน้า 1 */}
                        <div className="h-48 bg-slate-200 relative">
                            <iframe
                                width="100%" height="100%"
                                style={{ border: 0 }}
                                src={`https://www.google.com/maps?q=${encodeURIComponent(formData.pickup_location || "Bangkok")}&output=embed`}
                            />
                        </div>

                        <div className="p-6 flex flex-col gap-6">
                            <div className="flex gap-4">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 self-start">
                                    <span className="material-symbols-outlined text-xl">event_available</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule</p>
                                    <p className="text-sm font-bold text-gray-900">{formData.start_date} @ {formData.start_time}</p>
                                    <p className="text-xs text-gray-500">To {formData.end_date} @ {formData.end_time}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 self-start">
                                    <span className="material-symbols-outlined text-xl">directions_car</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehicle & Driver</p>
                                    <p className="text-sm font-bold text-gray-900">{formData.vehicle || "Not selected"}</p>
                                    <p className="text-xs text-gray-500">{formData.driverType === 'self' ? 'Self-drive' : 'Driver provided'} • {passengers.length} Passengers</p>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-gray-100 pt-6 space-y-4">
                                <div className="flex gap-3">
                                    <div className="size-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pickup</p>
                                        <p className="text-xs font-medium text-gray-700">{formData.pickup_location || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="size-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dropoff</p>
                                        <p className="text-xs font-medium text-gray-700">{formData.dropoff_location || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}