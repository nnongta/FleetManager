import { useState } from "react";

interface UsageDetailsProps {
  data: any;
  updateData: (fields: any) => void;
  onNext: () => void;
  onCancel: () => void;
}

export default function UsageDetails({ data, updateData, onNext, onCancel }: UsageDetailsProps) {
  
  const handleSameAsPickup = (checked: boolean) => {
    updateData({
      sameAsPickup: checked,
      dropoff_location: checked ? data.pickup_location : ""
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* --- Stepper Header --- */}
      <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
        <div className="relative flex items-center justify-between max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
          {[
            { step: 1, label: "Usage Details" },
            { step: 2, label: "Vehicle Selection" },
            { step: 3, label: "Confirmation" },
          ].map((item) => (
            <div key={item.step} className="relative z-10 flex flex-col items-center gap-2 bg-white px-4">
              <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${data.currentStep >= item.step || item.step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {item.step}
              </div>
              <span className={`text-xs font-bold ${item.step === 1 ? 'text-blue-600' : 'text-slate-400'}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Main Form Content --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-10">
          
          {/* Section: When is the vehicle needed? */}
          <section className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">schedule</span>
              When is the vehicle needed?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* START BLOCK */}
              <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Start</p>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Start Date</label>
                    <div className="relative">
                      <input type="date" value={data.start_date} onChange={e => updateData({ start_date: e.target.value })} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Start Time</label>
                    <input type="time" value={data.start_time} onChange={e => updateData({ start_time: e.target.value })} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm" />
                  </div>
                </div>
              </div>

              {/* END BLOCK */}
              <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">End</p>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">End Date</label>
                    <input type="date" value={data.end_date} onChange={e => updateData({ end_date: e.target.value })} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">End Time</label>
                    <input type="time" value={data.end_time} onChange={e => updateData({ end_time: e.target.value })} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Duration Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">
              <span className="material-symbols-outlined text-lg">info</span>
              Total Duration: 1 Day, 9 Hours
            </div>
          </section>

          {/* Section: Where is the journey? */}
          <section className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">location_on</span>
              Where is the journey?
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8 relative">
                {/* Visual Line between dots */}
                <div className="absolute left-[21px] top-12 bottom-12 w-[1px] border-l-2 border-dotted border-slate-200 hidden md:block"></div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Pick-up Location</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                    <input
                      type="text"
                      placeholder="Search office or enter address..."
                      value={data.pickup_location}
                      onChange={e => {
                        const val = e.target.value;
                        updateData({
                          pickup_location: val,
                          dropoff_location: data.sameAsPickup ? val : data.dropoff_location
                        });
                      }}
                      className="w-full pl-10 p-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700">Drop-off Location</label>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={data.sameAsPickup}
                        onChange={e => handleSameAsPickup(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                      /> 
                      <span className="group-hover:text-slate-600">Same as pick-up</span>
                    </label>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                    <input
                      type="text"
                      disabled={data.sameAsPickup}
                      placeholder="Search office or enter address..."
                      value={data.dropoff_location}
                      onChange={e => updateData({ dropoff_location: e.target.value })}
                      className={`w-full pl-10 p-4 border rounded-xl outline-none transition-all ${data.sameAsPickup ? 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed' : 'bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-600'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Map Preview Area */}
              <div className="bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-100 min-h-[280px] group shadow-inner">
                <iframe
                  width="100%" height="100%"
                  className="grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(data.pickup_location || "Thailand")}&output=embed`}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                   <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-xl border border-white flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                      <span className="material-symbols-outlined text-lg">map</span>
                      Map Preview
                   </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* --- Footer Action Bar --- */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button 
            onClick={onCancel}
            className="px-6 py-2 text-slate-500 font-bold hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onNext} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all active:scale-95"
          >
            Next Step <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}