// src/pages/steps/BookingConfirmation.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dbService } from "../../services/db";
import { v4 as uuidv4 } from "uuid";

interface Passenger {
    id: number;
    name: string;
    phone: string;
    email: string;
}

interface StepProps {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    onBack: () => void;
}

export default function BookingConfirmation({ formData, setFormData, onBack }: StepProps) {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [passengers, setPassengers] = useState<Passenger[]>(
        formData?.passenger_list?.length
            ? formData.passenger_list
            : [{ id: Date.now(), name: "", phone: "", email: "" }]
    );

    useEffect(() => {
        if (typeof setFormData === "function") {
            setFormData((prev: any) => ({
                ...prev,
                passenger_count: passengers.length,
                passenger_list: passengers,
            }));
        }
    }, [passengers]);

    const addPassenger = () => {
        setPassengers([...passengers, { id: Date.now(), name: "", phone: "", email: "" }]);
    };

    const removePassenger = (id: number) => {
        setPassengers(passengers.filter(p => p.id !== id));
    };

    const updatePassenger = (id: number, field: keyof Passenger, value: string) => {
        setPassengers(passengers.map(p => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split("\n").filter(line => line.trim() !== "");
            const newPassengers: Passenger[] = lines.slice(1).map((line, index) => {
                const [name, phone, email] = line.split(",");
                return { id: Date.now() + index, name, phone, email };
            });
            setPassengers(newPassengers);
        };
        reader.readAsText(file);
    };

    const handleCreateBooking = () => {
        if (!formData) return alert("Form data is missing");
        if (passengers.length === 0) return alert("Please add at least one passenger");

        const finalData = {
            ...formData,
            id: uuidv4(),
            status: "Pending",
        };

        try {
            dbService.createBooking(finalData);
            alert("Booking created successfully!");
            navigate("/bookings");
        } catch (error: any) {
            console.error("Create booking failed:", error);
            alert(error.message || "Failed to create booking");
        }
    };

    // Format datetime for display
    const formatDateTime = (start: string, end: string) => {
        if (!start || !end) return "-";
        const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
        const startDate = new Date(start);
        const endDate = new Date(end);
        return `${startDate.toLocaleDateString(undefined, options)} • ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Passenger Entry */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Stepper */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="mx-4 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-primary rounded-full"></div>
                        <div className="relative flex justify-between w-full">
                            <div className="flex flex-col items-center">
                                <div className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white ring-4 ring-white dark:ring-gray-900 shadow-sm">
                                    <span className="material-symbols-outlined text-xl font-bold">check</span>
                                </div>
                                <div className="absolute top-12 w-max text-center">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Details</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white ring-4 ring-white dark:ring-gray-900 shadow-sm">
                                    <span className="material-symbols-outlined text-xl font-bold">check</span>
                                </div>
                                <div className="absolute top-12 w-max text-center">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Selection</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white ring-4 ring-blue-100 dark:ring-blue-900/40 shadow-lg shadow-blue-500/20">
                                    <span className="font-bold text-base">3</span>
                                </div>
                                <div className="absolute top-12 w-max text-center">
                                    <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Passengers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Add Passengers</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base max-w-2xl">
                        Manually enter passenger details below or upload a CSV file for bulk addition. Ensure contact information is accurate for notifications.
                    </p>
                </div>

                {/* --- Tabs + Table + Add Passenger button --- */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-800 px-6">
                        <button className="flex items-center gap-2 border-b-[3px] border-primary text-primary px-4 py-4 focus:outline-none">
                            <span className="material-symbols-outlined text-xl">edit_note</span>
                            <span className="text-sm font-bold tracking-wide">Manual Entry</span>
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 border-b-[3px] border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-4 py-4 focus:outline-none transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">upload_file</span>
                            <span className="text-sm font-bold tracking-wide">Bulk Upload</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv"
                            onChange={handleFileUpload}
                        />
                    </div>

                    {/* Passenger Table */}
                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                    <th className="py-3 px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider w-[5%]">#</th>
                                    <th className="py-3 px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider w-[30%]">Full Name</th>
                                    <th className="py-3 px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider w-[25%]">Phone Number</th>
                                    <th className="py-3 px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider w-[30%]">Email Address</th>
                                    <th className="py-3 px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider w-[10%] text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {passengers.map((p, idx) => (
                                    <tr
                                        key={p.id}
                                        className="group border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="py-3 px-2 text-gray-400 font-medium">{idx + 1}</td>
                                        <td className="py-3 px-2">
                                            <input
                                                type="text"
                                                value={p.name}
                                                placeholder="Enter name"
                                                className="w-full bg-transparent border-none p-0 text-gray-900 dark:text-white focus:ring-0 placeholder-gray-300 font-medium"
                                                onChange={(e) => updatePassenger(p.id, "name", e.target.value)}
                                            />
                                        </td>
                                        <td className="py-3 px-2">
                                            <input
                                                type="text"
                                                value={p.phone}
                                                placeholder="Enter phone"
                                                className="w-full bg-transparent border-none p-0 text-gray-900 dark:text-white focus:ring-0 placeholder-gray-300"
                                                onChange={(e) => updatePassenger(p.id, "phone", e.target.value)}
                                            />
                                        </td>
                                        <td className="py-3 px-2">
                                            <input
                                                type="email"
                                                value={p.email}
                                                placeholder="Enter email"
                                                className="w-full bg-transparent border-none p-0 text-gray-900 dark:text-white focus:ring-0 placeholder-gray-300"
                                                onChange={(e) => updatePassenger(p.id, "email", e.target.value)}
                                            />
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            <button
                                                onClick={() => removePassenger(p.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            onClick={addPassenger}
                            className="mt-4 flex items-center gap-2 text-primary hover:text-blue-700 font-medium text-sm transition-colors py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 w-fit"
                        >
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            Add Another Passenger
                        </button>
                    </div>
                </div>


                {/* Footer */}
                <div className="flex items-center justify-between pt-4 pb-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Back
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="hidden sm:flex px-6 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            Save as Draft
                        </button>
                        <button
                            onClick={handleCreateBooking}
                            className="px-8 py-3 rounded-lg bg-primary text-white font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
                        >
                            Create Booking
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column: Dynamic Booking Summary */}
            <div className="lg:col-span-4">
                <div className="sticky top-24 flex flex-col gap-6">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <h3 className="text-gray-900 dark:text-white font-bold text-lg">Booking Summary</h3>
                            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded font-medium">Draft</span>
                        </div>
                        <div className="h-40 w-full relative bg-gray-200">
                            <img
                                alt="Map"
                                className="w-full h-full object-cover opacity-90"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbf6JDZ9C5jXb-JO2lMRiXYmNtp2Ss_hWSQymdBmGkZ1izozj0FF1kShjGk7isoQrPZEVjhcsFekyr7M0Vh9ALG2bvTeqfijvaU7MCzqD7L1CUd1MC_mylIV8QCcc3TMpjhbvekXO6gn2ezh4r130T_yOgRFrhg4en7kIYNW4Lq6codsguJaWq6wzQg4uf-2q-j1AQNfHRHfKNPmq0QQIO98XtUqnhkTZmkpG1VtWnIpRagrEQ-Z-6NK6WEIad0hw-bFHq7traJT9I"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                                <p className="text-white text-xs font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">distance</span> 42.5 miles
                                </p>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                            {/* Date & Time */}
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-primary">
                                    <span className="material-symbols-outlined">calendar_today</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Date &amp; Time</p>
                                    <p className="text-gray-900 dark:text-white font-semibold">{formatDateTime(formData.start_datetime, formData.end_datetime)}</p>
                                </div>
                            </div>
                            {/* Vehicle */}
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-primary">
                                    <span className="material-symbols-outlined">directions_car</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Vehicle</p>
                                    <p className="text-gray-900 dark:text-white font-semibold">{formData.vehicle_name || "-"}</p>
                                </div>
                            </div>
                            {/* Pickup / Dropoff */}
                            <div className="flex gap-4 items-start relative">
                                <div className="absolute left-[19px] top-10 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="flex flex-col gap-6 w-full">
                                    <div className="flex gap-4">
                                        <div className="mt-1 size-2.5 rounded-full ring-4 ring-green-100 dark:ring-green-900/30 bg-green-500 shrink-0 z-10"></div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Pickup</p>
                                            <p className="text-gray-900 dark:text-white text-sm font-medium leading-tight">{formData.pickup_location || "-"}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="mt-1 size-2.5 rounded-full ring-4 ring-red-100 dark:ring-red-900/30 bg-red-500 shrink-0 z-10"></div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Dropoff</p>
                                            <p className="text-gray-900 dark:text-white text-sm font-medium leading-tight">{formData.dropoff_location || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-5 border border-primary/10">
                            <div className="flex gap-3">
                                <span className="material-symbols-outlined text-primary">info</span>
                                <div>
                                    <p className="text-gray-900 dark:text-white font-semibold text-sm mb-1">Need to add 50+ passengers?</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                                        Use the <a className="text-primary font-medium hover:underline" href="#">Bulk Upload</a> tab to import a CSV file directly.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
