import { useState } from 'react';
import { Plane, Maximize2, Camera, Link2, FileText, ChevronRight, X } from 'lucide-react';

export default function BookingTab({ flights, updateFlight, isEditing, setIsEditing }: any) {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const handleFileUpload = (e: any, index: number) => {
    const file = e.target.files[0];
    if (file) {
      updateFlight('imgUrl', URL.createObjectURL(file), index);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500 text-left pb-32">
      {/* 頁面標題 */}
      <div className="flex justify-between items-end mb-8 px-2">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#5B4636] italic text-left">Flights</h2>
          <p className="text-[10px] text-[#B7AEA5] font-bold uppercase tracking-widest mt-1 text-left">Boarding Passes</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`px-5 py-2 rounded-full text-[11px] font-black shadow-md transition-all active:scale-90 ${
            isEditing ? 'bg-[#F2B94B] text-white' : 'bg-white text-[#6FAF8E] border border-[#6FAF8E]/20'
          }`}
        >
          {isEditing ? 'SAVE PASS' : 'EDIT INFO'}
        </button>
      </div>

      <div className="space-y-10 px-1">
        {flights && flights.map((flight: any, index: number) => (
          <div key={index} className="relative group">
            {/* 實體票根質感卡片 */}
            <div className="bg-white rounded-[35px] overflow-hidden shadow-xl shadow-[#5B4636]/5 border border-white relative">
              
              {/* 機票頂部：出發與目的地 */}
              <div className="bg-[#6FAF8E] p-6 text-white relative">
                {/* 裝飾性的小圓孔 */}
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#F6F3EE] rounded-full z-10" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#F6F3EE] rounded-full z-10" />
                
                <div className="flex justify-between items-center text-[10px] font-black opacity-70 uppercase tracking-[2px] mb-4">
                  <div className="flex items-center gap-2">
                    <Plane size={12} />
                    <span>{flight.type || (index === 0 ? 'Departure' : 'Return')}</span>
                  </div>
                  {isEditing ? (
                    <input 
                      className="bg-white/20 px-3 py-1 rounded-lg border-none outline-none w-28 text-right text-white placeholder:text-white/50"
                      value={flight.flightNum || ''} 
                      onChange={(e) => updateFlight('flightNum', e.target.value, index)}
                      placeholder="航班號"
                    />
                  ) : (
                    <span className="bg-white/20 px-3 py-1 rounded-lg">{flight.flightNum || 'NO NUM'}</span>
                  )}
                </div>

                <div className="flex justify-between items-center pb-2">
                  <div className="text-center">
                    <p className="text-[10px] opacity-60 font-bold mb-1">FROM</p>
                    <div className="text-4xl font-black font-serif tracking-tighter">
                       {isEditing ? (
                         <input className="bg-transparent border-b border-white/50 w-20 text-center outline-none" value={flight.from} onChange={(e)=>updateFlight('from', e.target.value, index)} />
                       ) : flight.from}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center px-4">
                    <div className="w-full border-t-2 border-dashed border-white/30 relative mt-4">
                      {/* --- 修正：飛機高度設為 -top-2.5，角度設為 -rotate-90 (往右上方飛) --- */}
                      <div className="absolute left-1/2 -top-4 -translate-x-1/2 bg-[#6FAF8E] px-2 text-white">
                        <Plane size={20} fill="currentColor" className="-rotate-45" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] opacity-60 font-bold mb-1">TO</p>
                    <div className="text-4xl font-black font-serif tracking-tighter">
                      {isEditing ? (
                         <input className="bg-transparent border-b border-white/50 w-20 text-center outline-none" value={flight.to} onChange={(e)=>updateFlight('to', e.target.value, index)} />
                       ) : flight.to}
                    </div>
                  </div>
                </div>
              </div>

              {/* 機票內容：乘機細節 */}
              <div className="p-8 pt-10 grid grid-cols-2 gap-y-8 gap-x-4 bg-white relative">
                {/* 裝飾性虛線 */}
                <div className="absolute top-0 left-6 right-6 border-t border-dashed border-[#F6F3EE]" />

                {[
                  { label: 'Date', field: 'date' },
                  { label: 'Gate', field: 'gate' },
                  { label: 'Boarding', field: 'time' },
                  { label: 'Seat', field: 'seat' }
                ].map((info) => (
                  <div key={info.label} className="text-left">
                    {/* --- 修正：標題放大至 11px --- */}
                    <p className="text-[11px] text-[#B7AEA5] font-black uppercase tracking-widest mb-1">{info.label}</p>
                    {isEditing ? (
                      <input 
                        className="w-full bg-[#F6F3EE] p-2 rounded-xl outline-none focus:ring-1 focus:ring-[#6FAF8E] text-[13px] font-bold text-[#5B4636]" 
                        value={flight[info.field] || ''} 
                        onChange={(e) => updateFlight(info.field, e.target.value, index)}
                      />
                    ) : (
                      /* --- 修正：內容放大至 20px，時間放大至 3xl --- */
                      <p className={`font-black text-[#5B4636] ${info.field === 'time' ? 'text-3xl text-[#F2B94B]' : 'text-[20px]'}`}>
                        {flight[info.field] || '--'}
                      </p>
                    )}
                  </div>
                ))}

                {/* 📸 電子截圖區 */}
                <div className="col-span-2 pt-4 space-y-3">
                  <p className="text-[11px] font-black text-[#B7AEA5] uppercase tracking-widest">Digital Pass Screenshot</p>
                  <div className="relative rounded-[25px] overflow-hidden bg-[#F6F3EE] min-h-[160px] border-2 border-dashed border-[#B7AEA5]/20 flex items-center justify-center group">
                    {flight.imgUrl ? (
                      <>
                        <img src={flight.imgUrl} className="w-full h-auto object-contain max-h-[300px]" alt="Ticket Screenshot" />
                        <div className="absolute top-3 right-3 flex gap-2">
                           <button onClick={() => setPreviewImg(flight.imgUrl)} className="bg-white/90 p-2 rounded-full shadow-lg text-[#5B4636] active:scale-90"><Maximize2 size={16}/></button>
                           {isEditing && (
                             <label className="bg-white/90 p-2 rounded-full shadow-lg text-[#6FAF8E] cursor-pointer active:scale-90">
                               <Camera size={16}/><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, index)} className="hidden" />
                             </label>
                           )}
                        </div>
                      </>
                    ) : (
                      <label className="flex flex-col items-center text-[#B7AEA5] cursor-pointer">
                        <Camera size={24} />
                        <span className="text-[11px] font-bold mt-2">UPLOAD SCREENSHOT</span>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, index)} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                {/* PDF 雲端連結 */}
                <div className="col-span-2">
                  {isEditing ? (
                    <div className="bg-[#F6F3EE] p-4 rounded-2xl space-y-2">
                      <label className="text-[11px] font-black text-[#6FAF8E] uppercase flex items-center gap-1">
                        <Link2 size={10} /> Cloud Link (Google Drive)
                      </label>
                      <input 
                        className="w-full bg-white border-none p-3 rounded-xl text-[11px] font-medium outline-none shadow-sm" 
                        placeholder="Paste PDF sharing link here" 
                        value={flight.pdfUrl || ''} 
                        onChange={(e) => updateFlight('pdfUrl', e.target.value, index)} 
                      />
                    </div>
                  ) : (
                    <button 
                      onClick={() => flight.pdfUrl && window.open(flight.pdfUrl, '_blank')}
                      className={`w-full py-5 rounded-[25px] font-black text-xs flex items-center justify-center gap-3 transition-all active:scale-95 ${
                        flight.pdfUrl 
                        ? 'bg-[#F2B94B] text-white shadow-lg shadow-[#F2B94B]/20' 
                        : 'bg-[#F6F3EE] text-[#B7AEA5]'
                      }`}
                    >
                      <FileText size={16} />
                      {flight.pdfUrl ? 'OPEN E-TICKET PDF' : 'PDF LINK NOT SET'}
                      <ChevronRight size={14} className="opacity-50" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 放大預覽 Lightbox */}
      {previewImg && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setPreviewImg(null)}>
          <button className="absolute top-10 right-10 text-white p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"><X size={32} /></button>
          <img src={previewImg} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" alt="Ticket Preview" />
        </div>
      )}
    </div>
  );
}
