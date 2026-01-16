import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { dbService } from "../services/db";
import type { Booking } from "../services/db";

export default function BookingApprove() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ฟังก์ชันโหลดข้อมูลใหม่
  const loadPendingBookings = () => {
    const data = dbService.getAllBookings();
    setAllBookings(data.filter(b => b.status === "Pending"));
  };

  useEffect(() => {
    loadPendingBookings();
  }, []);

  const handleApprove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("ยืนยันการอนุมัติการจองนี้ใช่หรือไม่?")) {
      dbService.approveBooking(id); // อัปเดตใน DB
      loadPendingBookings(); // รีโหลด UI
    }
  };


  const handleReject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const reason = prompt("ระบุเหตุผลที่ปฏิเสธ:");
    if (reason !== null) {
      dbService.rejectBooking(id, reason); // อัปเดตใน DB
      loadPendingBookings(); // รีโหลด UI
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Pending Approvals</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search booking ID..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-wider">Booking ID</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-wider">Requester</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-wider">Destination</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {allBookings.length > 0 ? (
              allBookings.filter(b => b.id.includes(searchTerm)).map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => navigate(`/bookings/${booking.id}`)}>
                  <td className="px-6 py-4 font-bold text-blue-600">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{booking.requester}</div>
                    <div className="text-xs text-slate-400">{booking.purpose}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{booking.destination}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={e => handleApprove(e, booking.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all">
                        <span className="material-symbols-outlined">check_circle</span>
                      </button>
                      <button onClick={e => handleReject(e, booking.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all">
                        <span className="material-symbols-outlined">cancel</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">inbox</span>
                  <p className="text-slate-400 font-medium text-sm">No pending requests found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}