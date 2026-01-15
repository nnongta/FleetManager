import React from "react";

interface StepProps {
  onNext: () => void;
}

export default function UsageDetails({ onNext }: StepProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100">
        <h3 className="flex items-center gap-2 text-xl font-bold mb-6">
          <span className="material-symbols-outlined text-blue-600">schedule</span>
          When is the vehicle needed?
        </h3>
        
        {/* Date & Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Start</label>
            <div className="space-y-4">
              <input type="date" className="w-full p-3 border rounded-lg" defaultValue="2023-10-27" />
              <input type="time" className="w-full p-3 border rounded-lg" defaultValue="09:00" />
            </div>
          </div>
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">End</label>
            <div className="space-y-4">
              <input type="date" className="w-full p-3 border rounded-lg" defaultValue="2023-10-28" />
              <input type="time" className="w-full p-3 border rounded-lg" defaultValue="18:00" />
            </div>
          </div>
        </div>
        
        <div className="inline-flex items-center gap-2 text-sm text-blue-700 font-bold bg-blue-50 px-3 py-2 rounded-lg">
          <span className="material-symbols-outlined text-[18px]">timelapse</span>
          Total Duration: 1 Day, 9 Hours
        </div>
      </div>

      {/* Location Selection */}
      <div className="p-8 space-y-6">
        <h3 className="flex items-center gap-2 text-xl font-bold mb-2">
          <span className="material-symbols-outlined text-blue-600">location_on</span>
          Where is the journey?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Pick-up Location</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                <input type="text" placeholder="Search office or enter address..." className="w-full pl-10 p-3 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Drop-off Location</label>
                <label className="flex items-center gap-2 text-xs text-slate-500">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600" /> Same as pick-up
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                <input type="text" placeholder="Search office or enter address..." className="w-full pl-10 p-3 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-600" />
              </div>
            </div>
          </div>
          
          {/* Map Preview */}
          <div className="bg-slate-100 rounded-xl overflow-hidden relative border min-h-[200px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-bold flex items-center gap-2 hover:bg-slate-50">
                <span className="material-symbols-outlined text-blue-600">map</span> View Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-slate-50 border-t flex justify-end">
        <button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all">
          Next Step <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}