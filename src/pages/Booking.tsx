import { useEffect, useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import { dbService } from "../services/db";
import type { Booking } from "../services/db";

import BookingTable from "../components/BookingTable";

const StatCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
            { label: "Pending Approval", count: 5, color: "text-amber-600" },
            { label: "Active Trips", count: 12, color: "text-blue-600" },
            { label: "Completed", count: 8, color: "text-green-600" },
            { label: "Total Canceled", count: 2, color: "text-red-600" },
        ].map((stat, index) => (
            <div
                key={index}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
            >
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {stat.label}
                </p>
                <p className={`text-2xl font-black mt-1 ${stat.color}`}>
                    {stat.count}
                </p>
            </div>
        ))}
    </div>
);

export default function BookingPage() {
    const navigate = useNavigate();
    const [bookingList, setBookingList] = useState<Booking[]>([]);

    const isRoot = useMatch({ path: "/bookings", end: true });

    if (!isRoot) return null;

    useEffect(() => {
        const data = dbService.getAllBookings();
        setBookingList(data);
    }, []);

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Booking Management
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        จัดการรายการจองรถทั้งหมดขององค์กร
                    </p>
                </div>

                <button
                    onClick={() => navigate("/bookings/new")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    New Booking
                </button>
            </div>

            <StatCards />

            <BookingTable bookings={bookingList} />
        </div>
    );
}
