import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbService } from "../services/db";
import type { Booking } from "../services/db";
import BookingTable from "../components/BookingTable";

const StatCards = ({ bookings }: { bookings: Booking[] }) => {
  const stats = [
    {
      label: "Pending Approval",
      count: bookings.filter(b => b.status === "Pending").length,
      color: "text-amber-600",
    },
    {
      label: "Active Trips",
      count: bookings.filter(b => b.status === "Approved").length,
      color: "text-blue-600",
    },
    {
      label: "Completed",
      count: bookings.filter(b => b.status === "Completed").length,
      color: "text-green-600",
    },
    {
      label: "Total Canceled",
      count: bookings.filter(b => b.status === "Rejected").length,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
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
};

export default function BookingPage() {
  const navigate = useNavigate();
  const [bookingList, setBookingList] = useState<Booking[]>([]);

  useEffect(() => {
    // ดึงข้อมูลจริงจาก dbService
    const data = dbService.getAllBookings();
    setBookingList(data);
  }, []);

  return (
    <div className="flex flex-col gap-6 p-4 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Booking Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            จัดการและติดตามสถานะการจองรถขององค์กร
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/bookings/approve")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">
              verified_user
            </span>
            Approval Portal
          </button>

          <button
            onClick={() => navigate("/bookings/new")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Booking
          </button>
        </div>
      </div>

      <StatCards bookings={bookingList} />
      <BookingTable bookings={bookingList} />
    </div>
  );
}
