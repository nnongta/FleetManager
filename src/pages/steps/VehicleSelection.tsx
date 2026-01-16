import React, { useState, useRef } from 'react';

interface VehicleSelectionProps {
  data: any;
  updateData: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function VehicleSelection({ data, updateData, onNext, onBack }: VehicleSelectionProps) {
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ฟังก์ชันจัดการการเลือกไฟล์ผ่านปุ่ม Browse
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLicenseFile(file);
      // เก็บข้อมูลชื่อไฟล์ลงใน state กลาง (optional)
      updateData({ licenseFileName: file.name });
    }
  };

  // ฟังก์ชันจัดการการลากไฟล์มาวาง (Drag & Drop)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setLicenseFile(file);
      updateData({ licenseFileName: file.name });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* --- Stepper Header --- */}
      <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
        <div className="relative flex items-center justify-between max-w-2xl mx-auto">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-blue-600 -translate-y-1/2 z-0"></div>
          
          {[
            { step: 1, label: "Customer", sub: "Personal Details", done: true },
            { step: 2, label: "Vehicle & Driver", sub: "Select Assets", active: true },
            { step: 3, label: "Confirmation", sub: "Review Booking" },
          ].map((item) => (
            <div key={item.step} className="relative z-10 flex flex-col items-center gap-2 bg-white px-4">
              <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${item.done ? 'bg-blue-600 text-white' : item.active ? 'bg-blue-600 text-white ring-4 ring-blue-50' : 'bg-slate-100 text-slate-400'}`}>
                {item.done ? <span className="material-symbols-outlined text-xl">check</span> : item.step}
              </div>
              <div className="text-center">
                <p className={`text-[10px] font-black uppercase tracking-tight ${item.active || item.done ? 'text-blue-600' : 'text-slate-400'}`}>{item.label}</p>
                <p className="text-[10px] text-slate-400 hidden sm:block">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-10">
          
          {/* --- Section 1: Driver Assignment --- */}
          <section className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">badge</span>
              Driver Assignment
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option: Driver Required */}
              <label className={`group relative flex cursor-pointer rounded-2xl border-2 p-6 transition-all ${data.driverType === 'required' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}>
                <input className="sr-only" name="driver" type="radio" checked={data.driverType === 'required'} onChange={() => updateData({ driverType: 'required' })} />
                <div className="flex items-start gap-4">
                  <div className={`size-12 rounded-full flex items-center justify-center transition-colors ${data.driverType === 'required' ? 'bg-white text-blue-600 shadow-sm' : 'bg-white text-slate-400'}`}>
                    <span className="material-symbols-outlined text-2xl">person</span>
                  </div>
                  <div className="flex-1">
                    <span className="block font-bold text-slate-900">Driver Required</span>
                    <span className="block text-xs text-slate-500 mt-1 leading-relaxed">Our company provides a professional driver for this trip.</span>
                  </div>
                  {data.driverType === 'required' && <span className="material-symbols-outlined text-blue-600 text-xl animate-in zoom-in">check_circle</span>}
                </div>
              </label>

              {/* Option: Self-Drive */}
              <label className={`group relative flex cursor-pointer rounded-2xl border-2 p-6 transition-all ${data.driverType === 'self' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}>
                <input className="sr-only" name="driver" type="radio" checked={data.driverType === 'self'} onChange={() => updateData({ driverType: 'self' })} />
                <div className="flex items-start gap-4">
                  <div className={`size-12 rounded-full flex items-center justify-center transition-colors ${data.driverType === 'self' ? 'bg-white text-blue-600 shadow-sm' : 'bg-white text-slate-400'}`}>
                    <span className="material-symbols-outlined text-2xl">directions_car</span>
                  </div>
                  <div className="flex-1">
                    <span className="block font-bold text-slate-900">Self-Drive</span>
                    <span className="block text-xs text-slate-500 mt-1 leading-relaxed">The customer will drive the vehicle themselves.</span>
                  </div>
                  {data.driverType === 'self' && <span className="material-symbols-outlined text-blue-600 text-xl animate-in zoom-in">check_circle</span>}
                </div>
              </label>
            </div>
          </section>

          {/* --- Section 2: Driver Information (แสดงเฉพาะ Self-Drive) --- */}
          {data.driverType === 'self' && (
            <section className="p-8 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-8 animate-in zoom-in-95 duration-300">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2">Driver Information</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Driver License Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">badge</span>
                    <input 
                      className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm" 
                      value={data.licenseNumber || ""}
                      onChange={e => updateData({ licenseNumber: e.target.value })}
                      placeholder="e.g. D12345678" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">License Expiry Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">calendar_today</span>
                    <input type="date" className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm" />
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Upload License Copy <span className="text-red-500">*</span></label>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".png,.jpg,.jpeg,.pdf"
                />

                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer group ${licenseFile ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 bg-white hover:bg-blue-50/30'}`}
                >
                  {licenseFile ? (
                    <div className="flex flex-col items-center text-center animate-in zoom-in-50">
                      <div className="size-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-3 shadow-lg">
                        <span className="material-symbols-outlined text-3xl">check</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{licenseFile.name}</p>
                      <p className="text-xs text-slate-500">{(licenseFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setLicenseFile(null); }}
                        className="mt-4 text-xs font-black text-red-500 hover:underline uppercase tracking-tighter"
                      >
                        Remove and upload again
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                        <span className="material-symbols-outlined text-3xl">upload_file</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900"><span className="text-blue-600 underline">Upload a file</span> or drag and drop</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, PDF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* --- Section 3: Vehicle Selection --- */}
          <section className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">airport_shuttle</span>
              Vehicle Selection
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                <select 
                  value={data.vehicle || ""}
                  onChange={e => updateData({ vehicle: e.target.value })}
                  className="w-full pl-12 pr-10 p-4 bg-white border border-slate-200 rounded-2xl font-medium text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none appearance-none shadow-sm transition-all"
                >
                  <option value="">Select a vehicle from fleet...</option>
                  <option value="Toyota Camry (ABC-1234)">Toyota Camry (ABC-1234) - Available</option>
                  <option value="Mercedes-Benz V-Class (VIP-789)">Mercedes-Benz V-Class (VIP-789)</option>
                  <option value="Hyundai Staria (ST-4455)">Hyundai Staria (ST-4455)</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
                <span className="material-symbols-outlined text-sm text-blue-600">info</span>
                Only showing vehicles available for the selected dates.
              </div>
            </div>
          </section>
        </div>

        {/* --- Footer Buttons --- */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold flex items-center gap-2 hover:bg-slate-100 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span> Back
          </button>
          <button 
            onClick={onNext} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 h-12 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all active:scale-95"
          >
            Next Step <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}