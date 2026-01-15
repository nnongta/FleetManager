import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from "../services/db"; // นำเข้า dbService
import type { Booking } from "../services/db";

const BookingDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);

    useEffect(() => {
        if (id) {
            const data = dbService.getBookingById(id);
            if (data) {
                setBooking(data);
            }
        }
    }, [id]);

    if (!booking) {
        return <div className="p-10 text-center">Loading or Booking not found...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 py-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium">
                    <span className="material-symbols-outlined">arrow_back</span> Back
                </button>
                <div className="text-right">
                    <h1 className="text-2xl font-black text-slate-900">Booking #{booking.id}</h1>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                        {booking.status} Approval
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* ข้อมูลผู้ขอ - แสดงข้อมูลจริงจาก booking object */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Requester</h3>
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border">
                                <img src={`https://i.pravatar.cc/150?u=${booking.requester}`} alt="" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-slate-900">{booking.requester}</p>
                                <p className="text-sm text-slate-500 font-medium">Department Employee</p>
                            </div>
                        </div>
                    </div>

                    {/* รายละเอียดการเดินทาง */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Trip Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-blue-600">distance</span>
                                <div>
                                    <p className="text-sm font-bold">Destination</p>
                                    <p className="text-slate-600">{booking.destination}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-blue-600">directions_car</span>
                                <div>
                                    <p className="text-sm font-bold">Vehicle Type</p>
                                    <p className="text-slate-600">{booking.vehicleType}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ส่วนปุ่ม Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-24">
                        <h3 className="text-sm font-bold mb-4">Actions</h3>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => {
                                    dbService.approveBooking(booking.id);
                                    navigate('/bookings');
                                }}
                                className="w-full bg-[#135bec] text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">check</span> Approve
                            </button>
                            <button 
                                onClick={() => navigate('/bookings')}
                                className="w-full border border-slate-300 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;