import { useState } from 'react';
import { Plane, Maximize2, Camera, Link2, FileText, ChevronRight, X, ArrowRight } from 'lucide-react';

// 沿用主程式的配色規範
const GLOBAL_THEME = {
  bgBase: '#F5F3EE',       
  primary: '#C6B8A6',      // 灰調暖駝色
  secondary: '#9DA8A1',    
  highlight: '#D2A48C',    
  textMain: '#2F2F2F',     
  textSub: '#6B6B6B',      
  textHint: '#9A9A9A',     
  white: '#FFFFFF',
  border: '#E2DFD8'        
};

export default function BookingTab({ flights, updateFlight, isEditing, setIsEditing }: any) {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const handleFileUpload = (e: any, index: number) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFlight('imgUrl', reader.result as string, index);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500 text-left pb-44 font-inter">
      {/* --- 頁面標題：與首頁標題風格一致 --- */}
      <div className="flex justify-between items-end mb-12 px-2">
        <div>
          <h2 className="text-[28px] font-semibold tracking-tight uppercase leading-tight" style={{ color: GLOBAL_THEME.textMain }}>
            Flights
          </h2>
          <p className="text-[12px] font-medium tracking-[0.2em] uppercase mt-2" style={{ color: GLOBAL_THEME.textSub }}>
            Transit Protocol
          </p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-[11px] font-bold tracking-[0.2em] uppercase transition-all px-4 py-2 rounded-full border border-[#C6B8A6] active:scale-95"
          style={{ 
            backgroundColor: isEditing ? GLOBAL_THEME.primary : 'transparent',
            color: isEditing ? '#FFFFFF' : GLOBAL_THEME.primary 
          }}
        >
          {isEditing ? 'Save Pass' : 'Edit Info'}
        </button>
      </div>

      <div className="space-y-16">
        {flights && flights.map((flight: any, index: number) => (
          <div key={index} className="flex flex-col">
            {/* --- 航班核心資訊：雜誌感排版 --- */}
            <div className="border-b-2 border-[#C6B8A6] pb-6 mb-8 flex justify-between items-end">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: GLOBAL_THEME.highlight }}>
                  {flight.type || (index === 0 ? 'Departure' : 'Return')} — {flight.flightNum || 'JX741'}
                </span>
                <div className="flex items-center gap-6">
                  <span className="text-4xl font-semibold tracking-tighter">{flight.from}</span>
                  <ArrowRight size={20} className="opacity-20" />
                  <span className="text-4xl font-semibold tracking-tighter">{flight.to}</span>
                </div>
              </div>
              
              {isEditing && (
                 <div className="flex flex-col gap-2 w-24">
                   <input 
                     className="text-right text-xs bg-white/50 border-b border-[#C6B8A6] outline-none p-1"
                     value={flight.flightNum} 
                     onChange={(e) => updateFlight('flightNum', e.target.value, index)}
                     placeholder="No."
                   />
                 </div>
              )}
            </div>

            {/* --- 細節網格：放大字體，移除背景 --- */}
            <div className="grid grid-cols-2 gap-y-10 gap-x-8 mb-10">
              {[
                { label: 'Date', field: 'date', placeholder: '2026.02.12' },
                { label: 'Gate', field: 'gate', placeholder: 'B7' },
                { label: 'Boarding', field: 'time', placeholder: '10:40' },
                { label: 'Seat', field: 'seat', placeholder: '24K' }
              ].map((info) => (
                <div key={info.label} className="flex flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: GLOBAL_THEME.textHint }}>
                    {info.label}
                  </p>
                  {isEditing ? (
                    <input 
                      className="text-lg font-medium bg-transparent border-b border-[#E2DFD8] outline-none py-1"
                      value={flight[info.field] || ''}
                      onChange={(e) => updateFlight(info.field, e.target.value, index)}
                      placeholder={info.placeholder}
                    />
                  ) : (
                    <p className={`text-xl font-medium ${info.field === 'time' ? 'text-[#D2A48C]' : ''}`}>
                      {flight[info.field] || '—'}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* --- 截圖區：保持 3:4 優雅比例，移除重陰影 --- */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GLOBAL_THEME.textHint }}>
                Digital Pass Screenshot
              </p>
              <div className="relative aspect-[3/4] bg-white rounded-[12px] border border-[#E2DFD8] overflow-hidden group">
                {flight.imgUrl ? (
                  <>
                    <img src={flight.imgUrl} className="w-full h-full object-cover grayscale-[20%]" alt="Ticket" />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button onClick={() => setPreviewImg(flight.imgUrl)} className="bg-white/90 p-3 rounded-full shadow-sm text-[#2F2F2F]"><Maximize2 size={18}/></button>
                      {isEditing && (
                        <label className="bg-white/90 p-3 rounded-full shadow-sm text-[#2F2F2F] cursor-pointer">
                          <Camera size={18}/><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, index)} className="hidden" />
                        </label>
                      )}
                    </div>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/50 transition-colors">
                    <Camera size={24} style={{ color: GLOBAL_THEME.textHint }} />
                    <span className="text-[11px] font-bold mt-3 tracking-widest opacity-40">UPLOAD SCREENSHOT</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, index)} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* --- PDF 連結按鈕：改為細線條風格 --- */}
            <div className="mt-8">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GLOBAL_THEME.textHint }}>PDF Link</label>
                  <input 
                    className="w-full bg-white border border-[#E2DFD8] p-4 rounded-[12px] text-xs outline-none focus:border-[#C6B8A6]"
                    placeholder="Paste link here"
                    value={flight.pdfUrl || ''}
                    onChange={(e) => updateFlight('pdfUrl', e.target.value, index)}
                  />
                </div>
              ) : (
                <button 
                  onClick={() => flight.pdfUrl && window.open(flight.pdfUrl, '_blank')}
                  className="w-full py-5 rounded-[12px] text-[13px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all border border-[#2F2F2F] active:scale-[0.98]"
                  style={{ 
                    backgroundColor: flight.pdfUrl ? GLOBAL_THEME.textMain : 'transparent',
                    color: flight.pdfUrl ? '#FFFFFF' : GLOBAL_THEME.textHint,
                    opacity: flight.pdfUrl ? 1 : 0.3
                  }}
                >
                  <FileText size={18} />
                  {flight.pdfUrl ? 'Open E-Ticket PDF' : 'No PDF Linked'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- Lightbox 預覽 --- */}
      {previewImg && (
        <div className="fixed inset-0 bg-[#F5F3EE]/98 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setPreviewImg(null)}>
          <button className="absolute top-12 right-8 text-[#2F2F2F] p-2 hover:opacity-50 transition-all"><X size={32} strokeWidth={1.5}/></button>
          <img src={previewImg} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" alt="Preview" />
        </div>
      )}
    </div>
  );
}
