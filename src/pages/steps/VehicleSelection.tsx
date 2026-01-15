import React from "react";

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function VehicleSelection({ onNext, onBack }: StepProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      {/* Driver Assignment Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">assignment_ind</span>
          Driver Assignment [cite: 43]
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="relative flex cursor-pointer rounded-xl border p-5 hover:bg-slate-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50/50">
            <input className="peer sr-only" name="driver" type="radio" value="required" />
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-slate-400 peer-checked:text-blue-600">person</span>
              <div>
                <span className="block font-bold text-slate-900">Driver Required [cite: 145]</span>
                <span className="text-sm text-slate-500">Professional driver provided[cite: 6].</span>
              </div>
            </div>
          </label>
          <label className="relative flex cursor-pointer rounded-xl border p-5 hover:bg-slate-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50/50">
            <input className="peer sr-only" name="driver" type="radio" value="self" defaultChecked />
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-slate-400 peer-checked:text-blue-600">directions_car</span>
              <div>
                <span className="block font-bold text-slate-900">Self-Drive [cite: 145]</span>
                <span className="text-sm text-slate-500">Customer drives themselves[cite: 12].</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Driver Information (For Self-Drive) */}
      <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <h4 className="text-xs font-black uppercase text-slate-400 mb-6 border-b pb-2">Driver Information [cite: 87]</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Driver License Number * [cite: 45]</label>
            <input className="w-full p-3 border rounded-lg" placeholder="e.g. D12345678" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">License Expiry Date * [cite: 153]</label>
            <input className="w-full p-3 border rounded-lg" type="date" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Upload License Copy * [cite: 45, 153]</label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-white hover:border-blue-600 cursor-pointer">
            <span className="material-symbols-outlined text-slate-300 text-5xl">upload_file</span>
            <p className="mt-2 text-sm text-slate-600 font-medium">Upload a file or drag and drop [cite: 153]</p>
            <p className="text-xs text-slate-400">PNG, JPG, PDF up to 10MB</p>
          </div>
        </div>
      </div>

      {/* Vehicle Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">directions_bus</span>
          Vehicle Selection [cite: 39, 149]
        </h3>
        <select className="w-full p-4 bg-white border rounded-lg shadow-sm appearance-none">
          <option>Select a vehicle from fleet... [cite: 149]</option>
          <option>Toyota Camry (ABC-1234) - Available [cite: 80]</option>
        </select>
        <p className="text-sm text-slate-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">info</span>
          Showing only vehicles available for selected dates[cite: 44, 147].
        </p>
      </div>

      {/* Footer Buttons */}
      <div className="mt-10 pt-6 border-t flex justify-between">
        <button onClick={onBack} className="px-6 h-12 text-slate-500 font-bold flex items-center gap-2 hover:bg-slate-50 rounded-lg">
          <span className="material-symbols-outlined">arrow_back</span> Back
        </button>
        <button onClick={onNext} className="bg-blue-600 text-white px-8 h-12 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-200">
          Next Step <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}