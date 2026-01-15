import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { dbService } from "../../services/db";


export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!id) return;

    const data = dbService.getBookingById(id);
    setBooking(data ?? null);
  }, [id]);

  if (!booking) {
    return (
      <div className="py-20 text-center text-slate-500">
        <p className="text-lg font-semibold">Loading or Booking not found...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Booking Detail
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          booking.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
          booking.status === "Rejected" ? "bg-red-100 text-red-700" :
          "bg-yellow-100 text-yellow-700"
        }`}>
          {booking.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-700">
        <Field label="Booking ID" value={booking.id} />
        <Field label="Requester ID" value={booking.requester_id.toString()} />
        <Field label="Purpose" value={booking.purpose} />
        <Field label="Passengers" value={booking.passenger_count?.toString() ?? "-"} />
        <Field label="Start Time" value={formatDate(booking.start_datetime)} />
        <Field label="End Time" value={formatDate(booking.end_datetime)} />
        <Field label="Pickup Location" value={booking.pickup_location ?? "-"} />
        <Field label="Dropoff Location" value={booking.dropoff_location ?? "-"} />
        <Field label="Vehicle ID" value={booking.vehicle_id?.toString() ?? "-"} />
      </div>

      {booking.reject_reason && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-red-700">Reject Reason</p>
          <p className="text-sm text-red-600 mt-1">{booking.reject_reason}</p>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}
