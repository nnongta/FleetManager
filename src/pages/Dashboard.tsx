// src/pages/Dashboard.tsx
import React from "react";
import {
  Calendar,
  Car,
  Clock,
  Route,
  ChevronDown,
  FileText,
  Table,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";

import { authService } from "../services/auth";
import { dbService } from "../services/db";

export default function Dashboard() {
  const currentUser = authService.getCurrentUser();
  const allBookings = dbService.getAllBookings();

  // กรอง booking ของ user ปัจจุบัน
  const userBookings = currentUser
    ? allBookings.filter((b) => b.requester_id === currentUser.id)
    : [];

  const stats = [
    {
      title: "Total Bookings",
      value: userBookings.length.toString(),
      change: "+12.5%",
      trendingUp: true,
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "Active Trips",
      value: userBookings.filter((b) => b.status === "In Progress").length.toString(),
      change: "+5%",
      trendingUp: true,
      icon: <Car className="w-5 h-5 text-indigo-600" />,
      bg: "bg-indigo-50",
    },
    {
      title: "Pending Approvals",
      value: userBookings.filter((b) => b.status === "Pending").length.toString(),
      change: "-2%",
      trendingUp: false,
      icon: <Clock className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-50",
    },
    {
      title: "Total Distance",
      value: userBookings.reduce((sum, b: any) => sum + (b.distance || 0), 0) + " km",
      change: "+8%",
      trendingUp: true,
      icon: <Route className="w-5 h-5 text-teal-600" />,
      bg: "bg-teal-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, {currentUser?.name || "User"}.</p>
        </div>
        <div className="text-slate-400 text-sm font-medium">Tue, Dec 30, 2025</div>
      </div>

      {/* --- Filters & Actions --- */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {["Time: This Week", "Dept: All Departments", "Type: All Bookings"].map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
            >
              {filter}
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </div>
        <div className="flex gap-3 w-full xl:w-auto">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            <Table className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* --- Metric Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>{stat.icon}</div>
              <span
                className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                  stat.trendingUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                }`}
              >
                {stat.change}
                {stat.trendingUp ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* --- Recent Requests --- */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Recent Requests</h3>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Requester</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Vehicle Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {userBookings.map((b) => (
                <RequestRow
                  key={b.id}
                  id={`#REQ-${b.id.substring(0, 4)}`}
                  name={currentUser?.name || "Unknown"}
                  type={b.vehicleType}
                  status={b.status}
                  statusColor={
                    b.status === "Pending"
                      ? "bg-yellow-500"
                      : b.status === "Approved"
                      ? "bg-emerald-500"
                      : b.status === "In Progress"
                      ? "bg-blue-500"
                      : b.status === "Rejected"
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface RequestRowProps {
  id: string;
  name: string;
  type: string;
  status: string;
  statusColor: string;
}

const RequestRow = ({ id, name, type, status, statusColor }: RequestRowProps) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{id}</td>
    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{name}</td>
    <td className="px-6 py-4 text-sm text-slate-600">{type}</td>
    <td className="px-6 py-4">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200">
        <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <button className="p-1 hover:bg-slate-100 rounded-md transition-colors">
        <MoreHorizontal className="w-5 h-5 text-slate-400" />
      </button>
    </td>
  </tr>
);
