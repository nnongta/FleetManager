import React from 'react';
import { useNavigate } from 'react-router-dom';

const VehicleList = () => {
    const navigate = useNavigate();

    // ข้อมูลสมมติสำหรับตารางรายการรถ
    const vehicles = [
        {
            id: 1,
            brand: 'Toyota HiAce',
            year: '2022 Model',
            plate: 'ABC-1234',
            type: 'Van',
            capacity: '12 Seats',
            driver: 'John Doe',
            status: 'Available',
            statusColor: 'bg-emerald-500',
            img: 'https://picsum.photos/seed/hiace/400/250'
        },
        {
            id: 2,
            brand: 'Ford Transit',
            year: '2021 Model',
            plate: 'XY-9876',
            type: 'Van',
            capacity: '15 Seats',
            driver: 'Sarah Smith',
            status: 'In Use',
            statusColor: 'bg-blue-500',
            img: 'https://picsum.photos/seed/transit/400/250'
        },
        {
            id: 3,
            brand: 'Mercedes Sprinter',
            year: '2023 Model',
            plate: 'MB-5544',
            type: 'Luxury Van',
            capacity: '10 Seats',
            driver: 'Unassigned',
            status: 'Maintenance',
            statusColor: 'bg-orange-500',
            img: 'https://picsum.photos/seed/sprinter/400/250'
        },
        {
            id: 4,
            brand: 'Nissan NV200',
            year: '2020 Model',
            plate: 'NS-2020',
            type: 'Cargo Van',
            capacity: '2 Seats',
            driver: 'Mike Ross',
            status: 'Available',
            statusColor: 'bg-emerald-500',
            img: 'https://picsum.photos/seed/nv200/400/250'
        },
        {
            id: 5,
            brand: 'Chevy Express',
            year: '2019 Model',
            plate: 'CH-9988',
            type: 'Van',
            capacity: '12 Seats',
            driver: 'Emily Blunt',
            status: 'In Use',
            statusColor: 'bg-blue-500',
            img: 'https://static.photos/400x250/car?random=1'
        },
    ];


    return (
        <div className="space-y-6">
            {/* --- Header Section --- */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-text-main text-3xl font-bold tracking-tight">Vehicle Management</h1>
                    <p className="text-text-secondary text-sm">Manage your fleet, track status, and view history.</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-border-light shadow-sm">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span className="text-sm font-medium text-text-secondary">Total Fleet: <span className="text-text-main font-bold ml-1">42</span></span>
                </div>
            </div>

            {/* --- Search & Filter Bar --- */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="relative w-full lg:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-text-secondary text-[20px]">search</span>
                    </div>
                    <input
                        className="block w-full pl-10 pr-3 py-2.5 border border-border-light rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                        placeholder="Search license plate, type, or driver..."
                        type="text"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-border-light rounded-lg shadow-sm text-sm font-medium text-text-secondary min-w-[140px] justify-between">
                            <span>Status: All</span>
                            <span className="material-symbols-outlined text-[20px] text-gray-400">arrow_drop_down</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-border-light rounded-lg shadow-sm text-sm font-medium text-text-secondary min-w-[130px] justify-between">
                            <span>Type: All</span>
                            <span className="material-symbols-outlined text-[20px] text-gray-400">arrow_drop_down</span>
                        </button>
                    </div>

                    <div className="h-8 w-px bg-gray-200 hidden sm:block mx-1"></div>

                    {/* ปุ่มเพิ่มรถที่จะนำไปสู่หน้า AddVehicle */}
                    <button
                        onClick={() => navigate('/vehicles/add')}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#135bec] hover:bg-[#0e4bce] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Add Vehicle</span>
                    </button>
                </div>
            </div>

            {/* --- Vehicle Table --- */}
            <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-border-light">
                                <th className="py-4 px-6 text-xs font-bold uppercase text-text-secondary">Vehicle</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase text-text-secondary">License Plate</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase text-text-secondary">Type</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase text-text-secondary">Capacity</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase text-text-secondary">Assigned Driver</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase text-text-secondary">Status</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase text-text-secondary text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light">
                            {vehicles.map((v) => (
                                <tr key={v.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            {/* ปรับ Aspect Ratio เป็น video (16:9) เพื่อให้เหมาะกับรูปทรงของรถ */}
                                            <div className="h-10 w-16 rounded-md bg-slate-100 overflow-hidden border border-slate-200 shadow-sm">
                                                <img
                                                    src={v.img}
                                                    alt={v.brand}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-main text-sm">{v.brand}</p>
                                                <p className="text-xs text-text-secondary mt-0.5">{v.year}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-text-main font-medium font-mono">{v.plate}</td>
                                    <td className="py-4 px-6 text-sm text-text-secondary">{v.type}</td>
                                    <td className="py-4 px-6 text-sm text-text-secondary">{v.capacity}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2.5">
                                            {v.driver !== 'Unassigned' ? (
                                                <>
                                                    <div className="h-8 w-8 rounded-full bg-slate-200 border border-white shadow-sm overflow-hidden">
                                                        <img src={`https://i.pravatar.cc/150?u=${v.driver}`} alt={v.driver} />
                                                    </div>
                                                    <span className="text-sm font-medium text-text-main">{v.driver}</span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">Unassigned</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                                            <span className={`h-1.5 w-1.5 rounded-full ${v.statusColor}`}></span>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">history</span>
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- Pagination --- */}
                <div className="flex items-center justify-between border-t border-border-light px-6 py-4 bg-gray-50/30">
                    <p className="text-sm text-text-secondary">
                        Showing <span className="font-semibold text-text-main">1</span> to <span className="font-semibold text-text-main">5</span> of <span className="font-semibold text-text-main">42</span> results
                    </p>
                    <div className="flex gap-2">
                        <button className="rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-text-secondary hover:bg-white transition-all shadow-sm disabled:opacity-50" disabled>Previous</button>
                        <button className="rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-text-secondary hover:bg-white transition-all shadow-sm">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleList;