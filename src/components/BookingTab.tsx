import { useState } from 'react';
import { Maximize2, Camera, FileText, X, ArrowRight, ExternalLink } from 'lucide-react';

export default function BookingTab({ flights, setFlights, isEditing, setIsEditing }: any) {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const updateFlight = (field: string, value: string, index: number) => {
    const newFlights = [...flights];
    newFlights[index] = { ...newFlights[index], [field]: value };
    setFlights(newFlights);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateFlight('imgUrl', reader.result as string, index);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500 text-left pb-44">
      <div className="flex justify-between items-center mb-12 pt-4">
        <h2 className="text-[32px] font-semibold tracking-tight uppercase text-[#2F2F2F]">Flights</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`text-[11px] font-bold tracking-[0.2em] uppercase px-6 py-2.5 rounded-full border transition-all ${
            isEditing ? 'bg-[#8E735B] text-white border-[#8E735B]' : 'bg-transparent text-[#8E735B] border-[#8E735B]'
          }`}
        >
          {isEditing ? 'Save Info' : 'Edit Info'}
        </button>
      </div>

      <div className="space-y-16">
        {Array.isArray(flights) && flights.map((flight: any, index: number) => (
          <div key={index} className="flex flex-col">
            <div className="border-b-2 border-[#C6B8A6] pb-6 mb-8 flex justify-between items-end">
              <div className="flex flex-col gap-2 flex-1">
                {isEditing ? (
                  <input className="text-xs bg-white/80 border border-[#C6B8A6] rounded px-2 py-1 outline-none w-32" value={flight.flightNum || ''} placeholder="Flight No." onChange={(e) => updateFlight('flightNum', e.target.value, index)} />
                ) : (
                  <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#8E735B]">{flight.flightNum || 'JX741'}</span>
                )}
                <div className="flex items-center gap-6">
                  {isEditing ? (
                    <>
                      <input className="text-4xl font-semibold bg-transparent border-b border-gray-300 w-24 outline-none uppercase" value={flight.from || ''} onChange={(e) => updateFlight('from', e.target.value, index)} />
                      <ArrowRight size={20} className="opacity-20" />
                      <input className="text-4xl font-semibold bg-transparent border-b border-gray-300 w-24 outline-none uppercase" value={flight.to || ''} onChange={(e) => updateFlight('to', e.target.value, index)} />
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-semibold tracking-tighter">{flight.from || 'TPE'}</span>
                      <ArrowRight size={20} className="opacity-20" />
                      <span className="text-4xl font-semibold tracking-tighter">{flight.to || 'BKK'}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-10 gap-x-8 mb-10">
              {['Date', 'Gate', 'Boarding', 'Seat'].map((label) => {
                const field = label === 'Boarding' ? 'time' : label.toLowerCase();
                return (
                  <div key={label}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-[#9A9A9A]">{label}</p>
                    {isEditing ? (
                      <input className="text-lg font-medium bg-white/50 border-b border-[#E2DFD8] outline-none py-1 w-full" value={flight[field] || ''} onChange={(e) => updateFlight(field, e.target.value, index)} />
                    ) : (
                      <p className={`text-xl font-medium ${field === 'time' ? 'text-[#D2A48C]' : 'text-[#2F2F2F]'}`}>{flight[field] || '---'}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* PDF 連結功能區塊 */}
            <div className="mb-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-[#9A9A9A]">Digital Document (PDF)</p>
              {isEditing ? (
                <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg border border-[#E2DFD8]">
                  <FileText size={18} className="text-[#8E735B]" />
                  <input 
                    className="bg-transparent text-sm outline-none w-full" 
                    placeholder="Paste PDF Link (Google Drive, etc.)" 
                    value={flight.pdfUrl || ''} 
                    onChange={(e) => updateFlight('pdfUrl', e.target.value, index)} 
                  />
                </div>
              ) : (
                flight.pdfUrl ? (
                  <a 
                    href={flight.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full bg-white p-4 rounded-xl border border-[#E2DFD8] shadow-sm active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-[#F5F3EE] p-2 rounded-lg text-[#8E735B]">
                        <FileText size={20} />
                      </div>
                      <span className="text-[13px] font-bold tracking-wider text-[#2F2F2F]">OPEN DIGITAL TICKET</span>
                    </div>
                    <ExternalLink size={16} className="text-[#C6B8A6]" />
                  </a>
                ) : (
                  <div className="py-4 border-2 border-dashed border-[#E2DFD8] rounded-xl text-center opacity-30 text-[11px] font-bold tracking-widest uppercase">
                    No PDF Linked
                  </div>
                )
              )}
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A9A9A]">Digital Pass Screenshot</p>
              <div className="relative aspect-[3/4] bg-white rounded-[12px] border border-[#E2DFD8] overflow-hidden shadow-sm">
                {flight.imgUrl ? (
                  <>
                    <img src={flight.imgUrl} className="w-full h-full object-cover" alt="Ticket" />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button onClick={() => setPreviewImg(flight.imgUrl)} className="bg-white/90 p-3 rounded-full shadow-md text-[#2F2F2F] active:scale-90"><Maximize2 size={18}/></button>
                      {isEditing && (
                        <label className="bg-white/90 p-3 rounded-full shadow-md text-[#2F2F2F] cursor-pointer active:scale-90">
                          <Camera size={18}/><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, index)} className="hidden" />
                        </label>
                      )}
                    </div>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-[#F9F8F6] hover:bg-white transition-colors">
                    <Camera size={24} className="text-[#9A9A9A]" />
                    <span className="text-[11px] font-bold mt-3 tracking-widest opacity-40 uppercase">Upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, index)} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewImg && (
        <div className="fixed inset-0 bg-[#F5F3EE]/98 z-[200] flex items-center justify-center p-6 animate-in fade-in" onClick={() => setPreviewImg(null)}>
          <button className="absolute top-12 right-8 text-[#2F2F2F] active:scale-90"><X size={32}/></button>
          <img src={previewImg} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" alt="Preview" />
        </div>
      )}
    </div>
  );
}
