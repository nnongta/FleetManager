import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from "../services/db";
import type { Booking } from "../services/db";

const BookingDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);

    // ฟังก์ชันสำหรับปุ่ม Approve
    const handleApprove = () => {
        if (!id) return;
        if (window.confirm("คุณต้องการอนุมัติการจองนี้ใช่หรือไม่?")) {
            dbService.approveBooking(id); // อัปเดตสถานะเป็น Approved ใน DB
            alert("อนุมัติการจองเรียบร้อยแล้ว");
            navigate("/approve"); // กลับไปหน้ารายการรออนุมัติ
        }
    };

    // ฟังก์ชันสำหรับปุ่ม Request Changes
    const handleRequestChanges = () => {
        const reason = prompt("ระบุข้อมูลที่ต้องการให้ผู้จองแก้ไข:");
        if (reason && id) {
            // ในที่นี้สมมติว่าใช้การอัปเดตสถานะหรือเก็บ comment (ถ้า dbService รองรับ)
            alert(`ส่งคำขอแก้ไขเรียบร้อย: ${reason}`);
            navigate("/approve");
        }
    };

    // ฟังก์ชันสำหรับปุ่ม Reject
    const handleReject = () => {
        if (!id) return;
        const reason = prompt("ระบุเหตุผลที่ปฏิเสธการจอง:");
        if (reason) {
            dbService.rejectBooking(id, reason); // อัปเดตสถานะเป็น Rejected ใน DB
            alert("ปฏิเสธการจองเรียบร้อยแล้ว");
            navigate("/approve");
        }
    };

    useEffect(() => {
        if (id) {
            const data = dbService.getBookingById(id);
            if (data) {
                setBooking(data);
            }
        }
    }, [id]);

    if (!booking) {
        return <div className="p-10 text-center font-bold text-slate-500">ไม่พบข้อมูลการจองรหัส {id}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-6 font-sans bg-[#F8FAFC] min-h-screen">
            {/* Header Section */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Booking #{booking.id}
                        </h1>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                            {booking.status || "Pending Approval"}
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        Submitted on {new Date(booking.start_datetime).toLocaleDateString()} • {new Date(booking.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                    Review Policy
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Itinerary and Requester */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Requester Information Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Requester Information</h3>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-slate-200 overflow-hidden ring-4 ring-slate-50">
                                <img src={`https://i.pravatar.cc/150?u=${booking.requester}`} alt={booking.requester} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900">{booking.requester}</h4>
                                <p className="text-sm text-slate-500 font-medium">Sales Department • Senior Manager</p>
                                <div className="flex gap-4 mt-2 text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">mail</span> {booking.requester.toLowerCase().replace(' ', '.')}@company.com
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">call</span> +1 (555) 012-3456
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trip Itinerary Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Trip Itinerary</h3>
                            <p className="text-lg font-bold text-slate-900">
                                {new Date(booking.start_datetime).toLocaleDateString()} - {new Date(booking.end_datetime).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="p-8 flex-1 space-y-12 relative">
                                {/* Timeline Line */}
                                <div className="absolute left-[41px] top-12 bottom-12 w-0.5 bg-slate-100"></div>

                                {/* Pickup */}
                                <div className="flex gap-6 relative z-10">
                                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-blue-200">A</div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Pickup • {new Date(booking.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <h5 className="text-lg font-bold text-slate-900 leading-tight">{booking.pickup_location}</h5>
                                        <p className="text-sm text-slate-500 mt-1">123 Main St, San Francisco, CA</p>
                                    </div>
                                </div>

                                {/* Drop-off */}
                                <div className="flex gap-6 relative z-10">
                                    <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-slate-200">B</div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Drop-off • {new Date(booking.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <h5 className="text-lg font-bold text-slate-900 leading-tight">{booking.destination}</h5>
                                        <p className="text-sm text-slate-500 mt-1">456 Tech Park, San Jose, CA</p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Preview Placeholder */}
                            <div className="md:w-72 bg-slate-100 relative min-h-[300px] md:min-h-full overflow-hidden">
                                <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                                    <img src="https://api.placeholder.com/400x600" alt="Map" className="w-full h-full object-cover opacity-50" />
                                    <button className="absolute bottom-6 right-6 bg-white px-4 py-2 rounded-lg shadow-md text-sm font-bold text-slate-700">View Route</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Requirements and Actions */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Requirements Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Requirements</h3>

                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                <span className="material-symbols-outlined">directions_car</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Vehicle Type</p>
                                <p className="font-bold text-slate-900">{booking.vehicleType} (Preferred)</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                <span className="material-symbols-outlined">group</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Passengers</p>
                                <p className="font-bold text-slate-900">{booking.passenger_count || 1} Persons</p>
                                <p className="text-xs text-slate-500 font-medium">Sarah Jenkins, Mike Ross</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                <span className="material-symbols-outlined">work</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Purpose</p>
                                <p className="font-bold text-slate-900">{booking.purpose || "Client Meeting"}</p>
                                <p className="text-xs text-slate-500 font-medium">Acme Corp Quarterly Review</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Actions</h3>

                        <button
                            onClick={handleApprove}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                            Approve Request
                        </button>

                        <button
                            onClick={handleRequestChanges}
                            className="w-full py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">edit_square</span>
                            Request Changes
                        </button>

                        <button
                            onClick={handleReject}
                            className="w-full py-4 bg-white text-red-600 border border-slate-100 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">cancel</span>
                            Reject Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;