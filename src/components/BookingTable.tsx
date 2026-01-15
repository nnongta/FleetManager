// src/components/BookingTable.tsx
import type { Booking } from "../services/db";

interface Props {
  bookings: Booking[];
}

const statusStyle = (status: Booking["status"]) => {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "Approved":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "In Progress":
      return "bg-blue-50 text-blue-700 ring-blue-700/10";
    case "Completed":
      return "bg-slate-100 text-slate-600 ring-slate-500/10";
    case "Canceled":
      return "bg-red-50 text-red-700 ring-red-600/10";
    default:
      return "";
  }
};

export default function BookingTable({ bookings }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {[
                "Booking ID",
                "Requester",
                "Vehicle",
                "Schedule",
                "Destination",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 ${
                    h === "Actions" ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {bookings.map((b) => (
              <tr
                key={b.id}
                className="group hover:bg-slate-50 transition-colors"
              >
                {/* Booking ID */}
                <td className="px-6 py-4 font-medium text-slate-900">
                  {b.id}
                </td>

                {/* Requester */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-200" />
                    <div>
                      <div className="font-medium text-slate-900">
                        User #{b.requester_id}
                      </div>
                      <div className="text-xs text-slate-500">Department</div>
                    </div>
                  </div>
                </td>

                {/* Vehicle */}
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">
                    Vehicle #{b.vehicle_id ?? "-"}
                  </div>
                  <div className="text-xs text-slate-500">
                    Fleet Vehicle
                  </div>
                </td>

                {/* Schedule */}
                <td className="px-6 py-4">
                  <div className="text-slate-900">
                    {new Date(b.start_datetime).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(b.start_datetime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(b.end_datetime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>

                {/* Destination */}
                <td className="px-6 py-4 text-slate-700">
                  {b.dropoff_location ?? "-"}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyle(
                      b.status
                    )}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {b.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600">
                      <span className="material-symbols-outlined text-[20px]">
                        visibility
                      </span>
                    </button>
                    <button className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600">
                      <span className="material-symbols-outlined text-[20px]">
                        close
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  ไม่พบข้อมูลการจอง
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
        <p className="text-sm text-slate-500">
          Showing <b>1</b> to <b>{bookings.length}</b> results
        </p>
        <div className="flex gap-2">
          <button className="rounded-lg border px-3 py-1.5 text-sm">
            Previous
          </button>
          <button className="rounded-lg border px-3 py-1.5 text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
