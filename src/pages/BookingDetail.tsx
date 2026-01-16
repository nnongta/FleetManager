import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dbService } from "../services/db";
import type { Booking } from "../services/db";

export default function BookingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const allBookings = dbService.getAllBookings();
            // Logic ค้นหา ID ที่ครอบคลุมทั้งแบบมี # และไม่มี
            const foundBooking = allBookings.find(b => 
                String(b.id) === String(id) || 
                String(b.id) === `#${id}` ||
                String(b.id).replace('#', '') === String(id)
            );
            
            if (foundBooking) {
                setBooking(foundBooking);
            }
            setLoading(false);
        }
    }, [id]);

    // --- Action Handlers ---
    const handleApprove = () => {
        if (booking && window.confirm("Are you sure you want to approve this request?")) {
            dbService.approveBooking(booking.id);
            navigate("/bookings");
        }
    };

    const handleReject = () => {
        if (booking) {
            const reason = prompt("Please enter the reason for rejection:");
            if (reason) {
                dbService.rejectBooking(booking.id, reason);
                navigate("/bookings");
            }
        }
    };

    const handleRequestChanges = () => {
        // Logic สำหรับขอแก้ไขข้อมูล (Placeholder)
        alert("Request changes feature coming soon!");
    };

    // --- Helpers ---
    const getStatusStyle = (status: string = "") => {
        switch ((status || "").toLowerCase()) {
            case "approved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
            case "rejected": return "bg-rose-100 text-rose-700 border-rose-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading details...</div>;

    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="text-xl font-bold text-slate-400">Booking not found</div>
                <button onClick={() => navigate(-1)} className="text-blue-600 font-bold hover:underline">Go Back</button>
            </div>
        );
    }

    // จัดการวันที่และเวลาสำหรับแสดงผล
    const [datePart, timePart] = (booking.start_datetime || "").split('T');
    const [endDatePart, endTimePart] = (booking.end_datetime || "").split('T');

    return (
        <div className="min-h-screen pb-20">
            {/* Top Navigation Bar Mockup */}
            <div className="border-b border-slate-200 px-8 py-4 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                     <button onClick={() => navigate("/approve")} className="p-2 rounded-lg hover:bg-slate-50 text-slate-500">
                        <span className="material-symbols-outlined">arrow_back</span>
                     </button>
                     <span className="font-bold text-slate-700">Booking Details</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking {booking.id}</h1>
                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getStatusStyle(booking.status)}`}>
                                {booking.status || "Unknown"}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm">Submitted on Oct 23, 2024 • 14:30 PM</p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                        Review Policy
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- LEFT COLUMN (Main Content) --- */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* 1. Requester Information */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Requester Information</h3>
                            <div className="flex items-start gap-5">
                                <div className="size-16 rounded-full bg-slate-100 overflow-hidden ring-4 ring-slate-50 shrink-0">
                                    <img src={`https://i.pravatar.cc/150?u=${booking.requester}`} alt={booking.requester} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{booking.requester}</h2>
                                    <p className="text-slate-500 font-medium mb-2">Sales Department • Senior Manager</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-lg">mail</span>
                                            <span>sarah.jenkins@company.com</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-lg">call</span>
                                            <span>+1 (555) 012-3456</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Trip Itinerary (Map & Timeline) */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                            {/* Left: Timeline */}
                            <div className="p-8 flex-1">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Trip Itinerary</h3>
                                <p className="font-bold text-slate-900 mb-8 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400">calendar_month</span>
                                    {datePart} - {endDatePart || datePart}
                                </p>

                                <div className="relative pl-4 border-l-2 border-slate-100 space-y-10 ml-2">
                                    {/* Pickup */}
                                    <div className="relative">
                                        <div className="absolute -left-[25px] top-0 size-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md ring-4 ring-white">A</div>
                                        <div>
                                            <p className="text-xs font-bold text-blue-600 uppercase mb-1">Pickup • {timePart}</p>
                                            <p className="font-bold text-slate-900 text-lg">HQ Office</p>
                                            <p className="text-slate-500 text-sm">{booking.pickup_location || "123 Main St, San Francisco, CA"}</p>
                                        </div>
                                    </div>

                                    {/* Dropoff */}
                                    <div className="relative">
                                        <div className="absolute -left-[25px] top-0 size-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-md ring-4 ring-white">B</div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Drop-off • {endTimePart || "18:00"}</p>
                                            <p className="font-bold text-slate-900 text-lg">Destination</p>
                                            <p className="text-slate-500 text-sm">{booking.destination || "456 Tech Park, San Jose, CA"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Map Preview */}
                            <div className="w-full md:w-[280px] bg-slate-100 relative min-h-[300px] border-l border-slate-100">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(booking.destination || "")}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                    className="absolute inset-0"
                                ></iframe>
                                <button className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-lg shadow-md text-xs font-bold text-slate-700 hover:bg-slate-50">
                                    View Route
                                </button>
                            </div>
                        </div>

                        {/* Reason for Rejection (Optional - for demo UI) */}
                        {/* <div className="bg-rose-50 rounded-xl border border-rose-100 p-6">
                            <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined">warning</span> Reason for Rejection
                            </h3>
                            <textarea className="w-full p-3 border border-rose-200 rounded-lg text-sm text-rose-800 placeholder:text-rose-300 focus:ring-2 focus:ring-rose-500/20 outline-none resize-none h-24" placeholder="Required if rejecting request..."></textarea>
                        </div> */}
                    </div>

                    {/* --- RIGHT COLUMN (Sidebar) --- */}
                    <div className="space-y-6">
                        
                        {/* 1. Requirements Card */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Requirements</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="size-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                                        <span className="material-symbols-outlined">directions_car</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Vehicle Type</p>
                                        <p className="font-bold text-slate-900">{booking.vehicleType || "Sedan (Preferred)"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="size-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                                        <span className="material-symbols-outlined">group</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Passengers</p>
                                        <p className="font-bold text-slate-900">{booking.passenger_count || 1} Persons</p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {booking.passengers?.map((p: any) => p.name).join(", ") || "Sarah Jenkins"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="size-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                                        <span className="material-symbols-outlined">business_center</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Purpose</p>
                                        <p className="font-bold text-slate-900">{booking.purpose || "Client Meeting"}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Acme Corp Quarterly Review</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="size-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                                        <span className="material-symbols-outlined">verified</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Booking Type</p>
                                        <p className="font-bold text-slate-900">Business</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Actions Card */}
                        {booking.status === "Pending" && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
                                <h3 className="text-sm font-bold text-slate-900 mb-4">Actions</h3>
                                <div className="space-y-3">
                                    <button 
                                        onClick={handleApprove}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">check</span> Approve Request
                                    </button>
                                    
                                    <button 
                                        onClick={handleRequestChanges}
                                        className="w-full py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">edit_note</span> Request Changes
                                    </button>
                                    
                                    <button 
                                        onClick={handleReject}
                                        className="w-full py-3 bg-white border border-rose-100 text-rose-600 hover:bg-rose-50 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">close</span> Reject Request
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}