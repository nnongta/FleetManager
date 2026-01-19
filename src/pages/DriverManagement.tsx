import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Car,
  PlusCircle,
  RefreshCw,
  X,
} from 'lucide-react';

// --- Types ---
interface Driver {
  id: string;
  name: string;
  phone: string;
  license: string;
  licenseClass: string;
  vehicle: string | null;
  status: 'Active' | 'Inactive';
  avatar: string | null;
  initials?: string;
}

// --- Mock Data ---
const INITIAL_DATA: Driver[] = [
  {
    id: 'DRV-001',
    name: 'John Doe',
    phone: '+1 555-0123',
    license: 'B239012',
    licenseClass: 'Class A',
    vehicle: 'Ford Transit',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: 'DRV-002',
    name: 'Jane Smith',
    phone: '+1 555-9876',
    license: 'C129088',
    licenseClass: 'Class B',
    vehicle: null,
    status: 'Inactive',
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
];

const DriverManagement: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Search & Filter ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] =
    useState<'All' | 'Active' | 'Inactive'>('All');

  // --- Modals ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assignVehicleId, setAssignVehicleId] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState('');

  const [newDriverForm, setNewDriverForm] = useState({
    name: '',
    phone: '',
    license: '',
    licenseClass: 'Class A',
  });

  useEffect(() => {
    setTimeout(() => {
      setDrivers(INITIAL_DATA);
      setIsLoading(false);
    }, 500);
  }, []);

  // --- Filter Logic ---
  const filteredDrivers = drivers.filter((driver) => {
    const matchesStatus =
      filterStatus === 'All' || driver.status === filterStatus;

    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.license.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f6f6f8] p-4 md:p-10 lg:px-40">
      {/* ===== Header ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Driver Management</h1>
          <p className="text-slate-500">
            Manage driver profiles, licenses, and assignments.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#135bec] text-white px-5 py-2.5 rounded-lg font-bold"
        >
          <Plus size={18} />
          Add New Driver
        </button>
      </div>

      {/* ===== Search & Filter ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Search */}
        <div className="lg:col-span-5 relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-3 rounded-xl bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-[#135bec] outline-none"
          />
        </div>

        {/* Filter */}
        <div className="lg:col-span-7 flex gap-3 overflow-x-auto">
          {(['All', 'Active', 'Inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                filterStatus === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status === 'All' ? 'All Drivers' : `${status} Only`}
            </button>
          ))}
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 gap-2">
            <RefreshCw className="animate-spin" />
            Loading...
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-4 w-16"></th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                  Name / ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                  License
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50">
                  {/* Avatar (FIXED) */}
                  <td className="px-6 py-4">
                    <div className="size-10 rounded-full overflow-hidden bg-gray-200">
                      {driver.avatar ? (
                        <img
                          src={driver.avatar}
                          alt={driver.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-[#135bec] font-bold text-sm">
                          {driver.initials}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-bold">{driver.name}</div>
                    <div className="text-xs text-slate-500">
                      ID: {driver.id}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm">{driver.phone}</td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{driver.license}</div>
                    <div className="text-xs text-slate-500">
                      {driver.licenseClass}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {driver.vehicle ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                        <Car size={16} />
                        {driver.vehicle}
                      </span>
                    ) : (
                      <button className="text-sm text-[#135bec] font-semibold">
                        <PlusCircle size={16} className="inline mr-1" />
                        Assign Vehicle
                      </button>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        driver.status === 'Active'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {driver.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DriverManagement;
