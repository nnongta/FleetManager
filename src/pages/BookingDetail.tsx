import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from "../services/db"; // 1. Import dbService
import type { Booking } from "../services/db";

const BookingDetail = () => {
    const { id } = useParams<{ id: string }>(); // 2. รับค่า ID จาก URL
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);

    useEffect(() => {
        if (id) {
            // 3. ดึงข้อมูลจากฐานข้อมูลจำลองโดยใช้ ID
            const data = dbService.getBookingById(id);
            if (data) {
                setBooking(data);
            }
        }
    }, [id]);

    // 4. กรณีหาข้อมูลไม่เจอ
    if (!booking) {
        return <div className="p-10 text-center font-bold text-slate-500">ไม่พบข้อมูลการจองรหัส {id}</div>;
    }

    return (
        // BookingDetail.tsx (ส่วน Trip Details)
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Trip Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-slate-500">Destination</p>
                        <p className="font-bold text-slate-900">{booking.destination}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Vehicle Type</p>
                        <p className="font-bold text-slate-900">{booking.vehicleType}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-slate-500">Pick-up Location</p>
                        <p className="font-bold text-slate-900">{booking.pickup_location || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Duration</p>
                        <p className="font-bold text-slate-900">
                            {new Date(booking.start_datetime).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;