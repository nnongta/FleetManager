import React from "react";

interface StatProps {
  title: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const StatCard = ({ title, value, icon, iconBg, iconColor }: StatProps) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </span>
    </div>
    <div className="mt-3">
      <span className="text-2xl font-bold text-slate-900">{value}</span>
    </div>
  </div>
);

export default function StatCards() {
  const stats = [
    { title: "Pending Approval", value: "5", icon: "pending_actions", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { title: "Active Trips", value: "12", icon: "directions_car", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { title: "Completed Today", value: "8", icon: "check_circle", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { title: "Total Canceled", value: "2", icon: "cancel", iconBg: "bg-red-50", iconColor: "text-red-600" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <StatCard key={i} {...s} />
      ))}
    </div>
  );
}