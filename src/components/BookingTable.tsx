import { useNavigate } from "react-router-dom";
import type { Booking } from "../services/db";

interface BookingTableProps {
  bookings: Booking[];
}

export default function BookingTable({ bookings }: BookingTableProps) {
  const navigate = useNavigate();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-600/10";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-100 ring-amber-600/10";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-100 ring-rose-600/10";
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-100 ring-blue-600/10";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100 ring-slate-600/10";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Booking ID
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Schedule
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Route
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Vehicle
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking) => {
                const dateTimeParts =
                  booking.start_datetime?.split("T") || ["N/A", ""];
                const date = dateTimeParts[0];
                const time = dateTimeParts[1];

                return (
                  <tr
                    key={booking.id}
                    className="hover:bg-slate-50/30 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/bookings/${booking.id}`)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-blue-600 text-sm">
                        #{booking.id}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">
                          {date}
                        </span>
                        <span className="text-xs text-slate-500">
                          {time}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-300 text-lg">
                          location_on
                        </span>
                        <span className="text-sm text-slate-600 truncate max-w-[220px]">
                          {booking.pickup_location ?? "-"} →{" "}
                          {booking.dropoff_location ?? "-"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {booking.vehicleType || "Not specified"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${getStatusStyles(
                          booking.status
                        )}`}
                      >
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current"></span>
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <span className="material-symbols-outlined">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-24 text-center">
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-5xl text-slate-200 mb-2">
                      calendar_today
                    </span>
                    <p className="text-slate-400 font-bold">
                      No bookings found
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
