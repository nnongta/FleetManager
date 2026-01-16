// src/pages/BookingDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dbService } from "../services/db";
import type { Booking } from "../services/db";

export default function BookingDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);

    useEffect(() => {
        if (!id) return;

        const data = dbService.getAllBookings();
        const found = data.find(b => String(b.id) === id) || null;
        setBooking(found);
    }, [id]);

    if (!booking) {
        return (
            <div className="p-6 text-center text-slate-500">
                Booking not found
            </div>
        );
    }

    const formatDateTime = (start: string, end: string) => {
        if (!start || !end) return "-";
        const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
        const startDate = new Date(start);
        const endDate = new Date(end);
        return `${startDate.toLocaleDateString(undefined, options)} • ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    const handleApprove = () => {
        if (window.confirm("Approve this booking?")) {
            dbService.approveBooking(booking.id);
            navigate("/approve");
        }
    };

    const handleReject = () => {
        const reason = prompt("Reason for rejection:");
        if (reason && reason.trim() !== "") {
            dbService.rejectBooking(booking.id, reason);
            navigate("/approve");
        }
    };

    const handleEdit = () => {
        navigate(`/bookings/edit/${booking.id}`);
    };

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        Booking #{booking.id}
                        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                            Pending Approval
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Submitted on {new Date(booking.start_datetime).toLocaleString()}
                    </p>
                </div>

                <button className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-100">
                    Review Policy
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Requester */}
                    <div className="bg-white rounded-xl border p-6">
                        <p className="text-xs font-semibold text-gray-400 mb-4">
                            REQUESTER INFORMATION
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gray-200" />
                            <div>
                                <p className="font-bold text-lg text-gray-900">
                                    User #{booking.requester_id}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {booking.purpose}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Trip */}
                    <div className="bg-white rounded-xl border overflow-hidden">
                        <div className="p-6 border-b">
                            <p className="text-xs font-semibold text-gray-400 mb-2">
                                TRIP ITINERARY
                            </p>
                            <p className="font-semibold">
                                {formatDateTime(booking.start_datetime, booking.end_datetime)}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2">
                            <div className="p-6 space-y-6">
                                <div>
                                    <p className="text-xs text-gray-400">PICKUP</p>
                                    <p className="font-semibold">{booking.pickup_location || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">DROP-OFF</p>
                                    <p className="font-semibold">{booking.dropoff_location || "-"}</p>
                                </div>
                            </div>

                            <div className="relative h-64">
                                <div className="relative h-64 w-full">
                                    <iframe
                                        title="Destination Map"
                                        className="absolute inset-0 w-full h-full rounded-lg"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                                            booking.dropoff_location || ""
                                        )}&output=embed`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Requirements */}
                    <div className="bg-white rounded-xl border p-6 space-y-4">
                        <p className="text-xs font-semibold text-gray-400">
                            REQUIREMENTS
                        </p>

                        <div>
                            <p className="text-sm text-gray-500">Vehicle Type</p>
                            <p className="font-semibold">{booking.vehicleType}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Passengers</p>
                            <p className="font-semibold">{booking.passenger_count || "-"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Booking Type</p>
                            <p className="font-semibold">Business</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl border p-6 space-y-3">
                        <p className="font-semibold mb-2">Actions</p>

                        <button
                            onClick={handleApprove}
                            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                        >
                            ✓ Approve Request
                        </button>

                        <button
                            onClick={handleEdit}
                            className="w-full py-3 rounded-lg border font-semibold hover:bg-gray-50"
                        >
                            Request Changes
                        </button>

                        <button
                            onClick={handleReject}
                            className="w-full py-3 rounded-lg border border-red-300 text-red-600 font-semibold hover:bg-red-50"
                        >
                            ✕ Reject Request
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
