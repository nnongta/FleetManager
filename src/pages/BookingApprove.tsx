import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { dbService } from "../services/db";
import type { Booking } from "../services/db";

export default function BookingApprove() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = dbService.getAllBookings();
    setAllBookings(data.filter(b => b.status === "Pending"));
  }, []);

  const filteredBookings = useMemo(() => {
    return allBookings.filter(b =>
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allBookings, searchTerm]);

  const handleRowClick = (id: string) => {
    navigate(`/bookings/${id}`);
  };

  const handleApprove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("ยืนยันการอนุมัติการจองนี้ใช่หรือไม่?")) {
      dbService.approveBooking(id);
      setAllBookings(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleReject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const reason = prompt("ระบุเหตุผลที่ปฏิเสธ:");
    if (reason) {
      dbService.rejectBooking(id, reason);
      setAllBookings(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 font-sans bg-[#F8FAFC] min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Booking Approvals
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Review and manage pending vehicle requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="ค้นหาชื่อ, รหัสจอง..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-sm font-bold text-blue-600">
              {filteredBookings.length} Requests
            </span>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-bold">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Requester</th>
              <th className="px-6 py-4">Vehicle Type</th>
              <th className="px-6 py-4">Destination</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <tr
                  key={booking.id}
                  onClick={() => handleRowClick(booking.id)}
                  className="hover:bg-blue-50/50 transition-all cursor-pointer group"
                >
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    {booking.id}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white">
                        <img
                          src={`https://i.pravatar.cc/150?u=${booking.requester}`}
                          alt={booking.requester}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {booking.requester}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {booking.vehicleType}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {booking.destination}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => handleApprove(e, booking.id)}
                        className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          check_circle
                        </span>
                      </button>

                      <button
                        onClick={e => handleReject(e, booking.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          cancel
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center text-slate-400">
                    <span className="material-symbols-outlined text-5xl mb-2">
                      inbox
                    </span>
                    <p className="text-sm font-medium">
                      ไม่พบรายการที่รอการอนุมัติ
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
