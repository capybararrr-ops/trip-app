import { useState } from 'react';
import { Maximize2, Camera, FileText, X, ArrowRight } from 'lucide-react';

const GLOBAL_THEME = {
  bgBase: '#F5F3EE',       
  primary: '#A69685',      
  highlight: '#8E735B',    
  textMain: '#2F2F2F',     
  textSub: '#5A5A5A',      
  textHint: '#9A9A9A',     
  white: '#FFFFFF',
  border: '#E2DFD8'
};

export default function BookingTab({ flights, updateFlight, isEditing, setIsEditing }: any) {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  // 修正：修復圖片上傳讀取邏輯
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
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
      {/* --- 頁面標題：移除重複的 Trip Name，僅保留功能標題 --- */}
      <div className="flex justify-between items-end mb-12 px-2 pt-4">
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
          className="text-[11px] font-bold tracking-[0.2em] uppercase transition-all px-6 py-2.5 rounded-full border shadow-sm active:scale-95"
          style={{ 
            backgroundColor: isEditing ? GLOBAL_THEME.highlight : 'transparent',
            color: isEditing ? '#FFFFFF' : GLOBAL_THEME.highlight,
            borderColor: GLOBAL_THEME.highlight
          }}
        >
          {isEditing ? 'Save Info' : 'Edit Info'}
        </button>
      </div>

      <div className="space-y-16">
        {flights && flights.map((flight: any, index: number) => (
          <div key={index} className="flex flex-col">
            {/* --- 航班核心資訊 --- */}
            <div className="border-b-2 border-[#C6B8A6] pb-6 mb-8 flex justify-between items-end">
              <div className="flex flex-col gap-2 flex-1">
                {isEditing ? (
                  <div className="flex gap-4 mb-2">
                    <input 
                      className="text-xs bg-white/80 border border-[#C6B8A6] rounded px-2 py-1 outline-none w-24"
                      value={flight.type || ''} 
                      placeholder="行程類型"
                      onChange={(e) => updateFlight('type', e.target.value, index)}
                    />
                    <input 
                      className="text-xs bg-white/80 border border-[#C6B8A6] rounded px-2 py-1 outline-none w-24"
                      value={flight.flightNum || ''} 
                      placeholder="航班號"
                      onChange={(e) => updateFlight('flightNum', e.target.value, index)}
                    />
                  </div>
                ) : (
                  <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: GLOBAL_THEME.highlight }}>
                    {flight.type || (index === 0 ? 'Departure' : 'Return')} — {flight.flightNum || 'JX741'}
                  </span>
                )}
                
                <div className="flex items-center gap-6">
                  {isEditing ? (
                    <>
                      <input className="text-4xl font-semibold tracking-tighter bg-transparent border-b border-gray-300 w-24 outline-none" value={flight.from || ''} onChange={(e) => updateFlight('from', e.target.value, index)} />
                      <ArrowRight size={20} className="opacity-20" />
                      <input className="text-4xl font-semibold tracking-tighter bg-transparent border-b border-gray-300 w-24 outline-none" value={flight.to || ''} onChange={(e) => updateFlight('to', e.target.value, index)} />
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-semibold tracking-tighter">{flight.from || '---'}</span>
                      <ArrowRight size={20} className="opacity-20" />
                      <span className="text-4xl font-semibold tracking-tighter">{flight.to || '---'}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* --- 細節網格 --- */}
            <div className="grid grid-cols-2 gap-y-10 gap-x-8 mb-10">
              {[
                { label: 'Date', field: 'date' },
                { label: 'Gate', field: 'gate' },
                { label: 'Boarding', field: 'time' },
                { label: 'Seat', field: 'seat' }
              ].map((info) => (
                <div key={info.label} className="flex flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: GLOBAL_THEME.textHint }}>
                    {info.label}
                  </p>
                  {isEditing ? (
                    <input 
                      className="text-lg font-medium bg-white/50 border-b border-[#E2DFD8] outline-none py-1"
                      value={flight[info.field] || ''}
                      onChange={(e) => updateFlight(info.field, e.target.value, index)}
                    />
                  ) : (
                    <p className={`text-xl font-medium ${info.field === 'time' ? 'text-[#D2A48C]' : ''}`}>
                      {flight[info.field] || '—'}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* --- 截圖區 --- */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GLOBAL_THEME.textHint }}>
                Digital Pass Screenshot
              </p>
              <div className="relative aspect-[3/4] bg-white rounded-[12px] border border-[#E2DFD8] overflow-hidden group shadow-sm">
                {flight.imgUrl ? (
                  <>
                    <img src={flight.imgUrl} className="w-full h-full object-cover" alt="Ticket" />
                    <div className="absolute bottom-4 right-4 flex gap-2 transition-opacity">
                      <button onClick={() => setPreviewImg(flight.imgUrl)} className="bg-white/90 p-3 rounded-full shadow-md text-[#2F2F2F] active:scale-90 transition-transform"><Maximize2 size={18}/></button>
                      {isEditing && (
                        <label className="bg-white/90 p-3 rounded-full shadow-md text-[#2F2F2F] cursor-pointer active:scale-90 transition-transform">
                          <Camera size={18}/><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, index)} className="hidden" />
                        </label>
                      )}
                    </div>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-[#F9F8F6] hover:bg-white transition-colors">
                    <Camera size={24} style={{ color: GLOBAL_THEME.textHint }} />
                    <span className="text-[11px] font-bold mt-3 tracking-widest opacity-40">UPLOAD SCREENSHOT</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, index)} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* --- PDF 連結按鈕 --- */}
            <div className="mt-8">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GLOBAL_THEME.textHint }}>E-Ticket PDF Link</label>
                  <input 
                    className="w-full bg-white border border-[#E2DFD8] p-4 rounded-[12px] text-xs outline-none focus:border-[#C6B8A6] shadow-inner"
                    placeholder="貼上 PDF 雲端連結"
                    value={flight.pdfUrl || ''}
                    onChange={(e) => updateFlight('pdfUrl', e.target.value, index)}
                  />
                </div>
              ) : (
                <button 
                  onClick={() => flight.pdfUrl && window.open(flight.pdfUrl, '_blank')}
                  className="w-full py-5 rounded-[12px] text-[13px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all active:scale-[0.98] border"
                  style={{ 
                    backgroundColor: flight.pdfUrl ? GLOBAL_THEME.textMain : 'transparent',
                    color: flight.pdfUrl ? '#FFFFFF' : GLOBAL_THEME.textHint,
                    borderColor: flight.pdfUrl ? GLOBAL_THEME.textMain : GLOBAL_THEME.border
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
