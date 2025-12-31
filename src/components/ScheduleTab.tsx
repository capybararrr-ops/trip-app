import { useState } from 'react';
import { Plus, Camera, MapPin, FileText, X, Maximize2, Pencil, ExternalLink, StickyNote, AlignLeft, Trash2 } from 'lucide-react';

export default function ScheduleTab({ scheduleData: schedule, setScheduleData: setSchedule }: any) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [editingItem, setEditingItem] = useState<{ dayIdx: number, itemIdx: number } | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null); 
  const [editForm, setEditForm] = useState({
    time: '', task: '', desc: '', note: '', link: '', img: '',
    bookingLink: '', bookingNo: '', bookingImg: '' 
  });

  const getWeekday = (dateStr: string) => {
    const days = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const date = new Date(`2026/${dateStr}`);
    return isNaN(date.getTime()) ? '' : days[date.getDay()];
  };

  const openEditor = (dayIdx: number, itemIdx: number) => {
    const item = schedule[dayIdx].items[itemIdx];
    setEditForm({ ...item, note: item.note || '' });
    setEditingItem({ dayIdx, itemIdx });
  };

  // --- 核心進化：儲存時自動按時間排序 ---
  const saveChange = () => {
    if (!editingItem) return;
    const newSchedule = [...schedule];
    
    // 1. 更新內容
    newSchedule[editingItem.dayIdx].items[editingItem.itemIdx] = { ...editForm };
    
    // 2. 執行排序：將時間早的排在前面
    newSchedule[editingItem.dayIdx].items.sort((a: any, b: any) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      // 移除冒號進行純數字比較 (例如 "09:00" -> "0900")
      const timeA = a.time.replace(':', '');
      const timeB = b.time.replace(':', '');
      return timeA.localeCompare(timeB);
    });

    setSchedule(newSchedule);
    setEditingItem(null);
  };

  const handleFileUpload = (e: any, field: string) => {
    const file = e.target.files[0];
    if (file) setEditForm({ ...editForm, [field]: URL.createObjectURL(file) });
  };

  const addNewItem = (e: any) => {
    e.stopPropagation();
    const newSchedule = [...schedule];
    if (!newSchedule[selectedDay].items) newSchedule[selectedDay].items = [];
    newSchedule[selectedDay].items.push({ 
        time: '12:00', icon: '📍', task: '新行程', desc: '', note: '', link: '', 
        img: '', bookingLink: '', bookingNo: '', bookingImg: '' 
    });
    setSchedule(newSchedule);
  };

  const addNewDay = () => {
    const lastDay = schedule[schedule.length - 1];
    const lastDate = new Date(`2026/${lastDay.date}`);
    lastDate.setDate(lastDate.getDate() + 1);
    const m = (lastDate.getMonth() + 1).toString().padStart(2, '0');
    const d = lastDate.getDate().toString().padStart(2, '0');
    setSchedule([...schedule, { day: `DAY ${schedule.length + 1}`, date: `${m}/${d}`, items: [] }]);
  };

  // --- 核心進化：刪除最後一天功能 ---
  const removeLastDay = (e: any) => {
    e.stopPropagation();
    if (schedule.length <= 1) return;
    if (window.confirm(`確定要刪除最後一天 (${schedule[schedule.length - 1].day}) 嗎？資料將無法恢復！`)) {
      const newSchedule = schedule.slice(0, -1);
      // 如果當前選中的天數超出了新長度，跳回到最後一天
      if (selectedDay >= newSchedule.length) {
        setSelectedDay(newSchedule.length - 1);
      }
      setSchedule(newSchedule);
    }
  };

  if (!schedule || !schedule[selectedDay]) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 text-left pb-32">
      <div className="px-2 mb-6 flex justify-between items-end">
        <h2 className="text-3xl font-serif font-bold text-[#5B4636] italic">Plan</h2>
        <div className="bg-[#6FAF8E]/10 text-[#6FAF8E] px-4 py-1.5 rounded-full text-[12px] font-black">{getWeekday(schedule[selectedDay].date)}</div>
      </div>
      
      {/* 天數選擇列：加入刪除按鈕 */}
      <div className="flex gap-4 overflow-x-auto pb-6 px-4 no-scrollbar flex-nowrap w-full scroll-smooth">
        {schedule.map((item: any, index: number) => (
          <button key={index} onClick={() => setSelectedDay(index)} className={`flex-shrink-0 w-20 py-4 rounded-[28px] flex flex-col items-center transition-all duration-300 ${selectedDay === index ? 'bg-[#F2B94B] text-white shadow-lg scale-105' : 'bg-white text-[#B7AEA5] shadow-sm'}`}>
            <span className="text-[9px] font-bold uppercase">{item.day}</span>
            <span className="text-[14px] font-black mt-0.5">{item.date}</span>
          </button>
        ))}
        
        {/* 新增與刪除按鈕組合 */}
        <div className="flex gap-2">
          <button onClick={addNewDay} className="flex-shrink-0 w-20 py-4 rounded-[28px] border-2 border-dashed border-[#F2B94B]/30 text-[#F2B94B] bg-white/50 flex flex-col items-center justify-center active:scale-95 transition-transform">
            <Plus size={22} />
            <span className="text-[8px] font-bold mt-0.5 uppercase tracking-tighter">New Day</span>
          </button>
          
          {schedule.length > 1 && (
            <button onClick={removeLastDay} className="flex-shrink-0 w-20 py-4 rounded-[28px] border-2 border-dashed border-red-200 text-red-300 bg-white/50 flex flex-col items-center justify-center active:scale-95 transition-transform">
              <Trash2 size={20} />
              <span className="text-[8px] font-bold mt-0.5 uppercase tracking-tighter text-red-300">Delete Day</span>
            </button>
          )}
        </div>
        <div className="flex-shrink-0 w-8" />
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-xl relative border border-white">
        <div className="absolute left-7 top-10 bottom-10 w-[1.5px] border-l-2 border-dashed border-[#F6F3EE]" />
        <div className="space-y-10 relative">
          {schedule[selectedDay].items.map((event: any, idx: number) => (
            <div key={idx} onClick={() => openEditor(selectedDay, idx)} className="flex gap-5 items-start relative z-10 cursor-pointer group">
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 bg-[#F6F3EE] rounded-2xl flex items-center justify-center text-xl">{event.icon || '📍'}</div>
                <span className="text-[10px] font-black text-[#6FAF8E] mt-2">{event.time}</span>
              </div>
              <div className="flex-1 pt-1 border-b border-[#F6F3EE] pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[#5B4636] text-[16px] leading-snug text-left">{event.task}</p>
                    {event.desc && <p className="text-[11px] text-[#8A7F73] font-medium mt-0.5 text-left">{event.desc}</p>}
                    {event.link && <a href={event.link} target="_blank" rel="noreferrer" onClick={(e)=>e.stopPropagation()} className="flex items-center gap-1 mt-1 text-[10px] text-[#6FAF8E] font-bold"><MapPin size={10} /> Google Maps</a>}
                  </div>
                  <div className="flex gap-2">
                    {event.bookingLink && <a href={event.bookingLink} target="_blank" onClick={(e)=>e.stopPropagation()}><ExternalLink size={14} className="text-[#F2B94B]" /></a>}
                    {(event.bookingImg || event.bookingNo) && <FileText size={14} className="text-[#F2B94B]" />}
                  </div>
                </div>
                {event.note && (
                  <div className="mt-2 bg-[#F6F3EE]/60 p-2.5 rounded-xl border-l-2 border-[#B7AEA5] flex gap-2 items-start shadow-inner">
                    <StickyNote size={12} className="text-[#B7AEA5] mt-0.5 flex-shrink-0" /><p className="text-[11px] text-[#8A7F73] italic leading-relaxed text-left">{event.note}</p>
                  </div>
                )}
                {event.bookingImg && (
                  <div className="mt-3 flex items-center gap-2 p-1.5 bg-[#F6F3EE] rounded-xl w-fit active:scale-95 transition-transform" onClick={(e) => { e.stopPropagation(); setPreviewImg(event.bookingImg); }}>
                    <img src={event.bookingImg} className="w-8 h-8 rounded-lg object-cover shadow-sm" /><span className="text-[8px] text-[#8A7F73] font-bold uppercase tracking-tighter">View Voucher</span><Maximize2 size={10} className="text-[#B7AEA5]" />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button onClick={addNewItem} className="w-full py-4 border-2 border-dashed border-[#F6F3EE] rounded-3xl text-[#B7AEA5] text-[13px] font-bold">+ Add stop</button>
        </div>
      </div>

      {/* 編輯視窗 (不變) */}
      {editingItem && (
        <div className="fixed inset-0 bg-[#5B4636]/60 backdrop-blur-md z-[100] flex items-end justify-center">
          <div className="bg-[#F6F3EE] w-full max-w-md p-8 pt-12 rounded-t-[50px] shadow-2xl max-h-[96vh] overflow-y-auto pb-44 no-scrollbar">
            <div className="w-12 h-1.5 bg-[#B7AEA5]/30 rounded-full mx-auto mb-8 flex-shrink-0" />
            <h3 className="text-2xl font-serif italic font-bold text-[#5B4636] mb-6 text-left">Edit Stop</h3>
            <div className="space-y-6">
              <div className="relative w-full rounded-[30px] border-2 border-dashed border-[#B7AEA5]/30 flex flex-col items-center justify-center overflow-hidden bg-white shadow-inner min-h-[240px]">
                {editForm.img ? (
                  <>
                    <img src={editForm.img} className="w-full h-auto object-contain max-h-[400px]" alt="Spot" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => setPreviewImg(editForm.img)} className="bg-white/90 p-2 rounded-full shadow-lg text-[#5B4636] active:scale-90"><Maximize2 size={18}/></button>
                      <label className="bg-white/90 p-2 rounded-full shadow-lg text-[#6FAF8E] cursor-pointer active:scale-90"><Pencil size={18}/><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'img')} className="hidden" /></label>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center text-[#B7AEA5] cursor-pointer"><Camera size={32}/><span className="text-[10px] mt-2 font-bold uppercase">Upload Photo</span><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'img')} className="hidden" /></label>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-1"><label className="text-[9px] font-bold text-[#B7AEA5] ml-2 uppercase tracking-widest">Time</label><input type="text" className="w-full bg-white border-none p-4 rounded-2xl text-sm font-bold shadow-sm outline-none" value={editForm.time} onChange={(e)=>setEditForm({...editForm, time: e.target.value})} /></div>
                <div className="space-y-1"><label className="text-[9px] font-bold text-[#B7AEA5] ml-2 uppercase tracking-widest">Task</label><input type="text" className="w-full bg-white border-none p-4 rounded-2xl text-sm font-bold shadow-sm outline-none" value={editForm.task} onChange={(e)=>setEditForm({...editForm, task: e.target.value})} /></div>
              </div>
              <div className="space-y-1 text-left"><label className="text-[9px] font-bold text-[#B7AEA5] ml-2 uppercase flex items-center gap-1"><AlignLeft size={10} /> Description</label><input type="text" className="w-full bg-white border-none p-4 rounded-2xl text-sm font-medium shadow-sm outline-none" value={editForm.desc} onChange={(e)=>setEditForm({...editForm, desc: e.target.value})} /></div>
              <div className="space-y-1 text-left"><label className="text-[9px] font-bold text-[#B7AEA5] ml-2 uppercase flex items-center gap-1"><StickyNote size={10} /> Detailed Note</label><textarea className="w-full bg-white border-none p-4 rounded-2xl text-sm font-medium shadow-sm outline-none min-h-[120px] resize-none" placeholder="輸入詳細備註..." value={editForm.note} onChange={(e)=>setEditForm({...editForm, note: e.target.value})} /></div>
              <div className="space-y-1 text-left"><label className="text-[9px] font-bold text-[#B7AEA5] ml-2 uppercase tracking-widest">Google Map Link</label><input type="text" className="w-full bg-white border-none p-4 rounded-2xl text-sm font-bold shadow-sm outline-none" value={editForm.link} onChange={(e)=>setEditForm({...editForm, link: e.target.value})} /></div>
              <div className="bg-white p-6 rounded-[35px] shadow-sm space-y-4 border border-white">
                <p className="text-[10px] font-black text-[#F2B94B] uppercase tracking-widest text-center">Voucher Photo</p>
                <div className="relative w-full rounded-2xl border-2 border-dashed border-[#B7AEA5]/20 flex items-center justify-center overflow-hidden bg-[#F6F3EE] min-h-[200px]">
                  {editForm.bookingImg ? (
                    <>
                      <img src={editForm.bookingImg} className="w-full h-auto object-contain max-h-[350px]" alt="Voucher" />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button onClick={() => setPreviewImg(editForm.bookingImg)} className="bg-white/90 p-2 rounded-full shadow-md text-[#5B4636] active:scale-90"><Maximize2 size={16}/></button>
                        <label className="bg-white/90 p-2 rounded-full shadow-md text-[#6FAF8E] cursor-pointer active:scale-90"><Pencil size={16}/><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'bookingImg')} className="hidden" /></label>
                      </div>
                    </>
                  ) : <label className="flex flex-col items-center text-[#B7AEA5] cursor-pointer"><FileText size={28}/><span className="text-[10px] mt-2 font-bold uppercase tracking-widest text-center">Upload Ticket Photo</span><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'bookingImg')} className="hidden" /></label>}
                </div>
                <div className="space-y-3 pt-2">
                   <input type="text" className="w-full bg-[#F6F3EE] border-none p-3 rounded-xl text-xs font-bold outline-none shadow-inner" placeholder="Order / Booking No." value={editForm.bookingNo} onChange={(e)=>setEditForm({...editForm, bookingNo: e.target.value})} />
                   <input type="text" className="w-full bg-[#F6F3EE] border-none p-3 rounded-xl text-xs font-bold outline-none shadow-inner" placeholder="Google Drive / Cloud Link" value={editForm.bookingLink} onChange={(e)=>setEditForm({...editForm, bookingLink: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex flex-col gap-3">
                <button onClick={saveChange} className="w-full bg-[#6FAF8E] text-white py-5 rounded-[25px] font-black shadow-xl active:scale-95 transition-all text-center">Save Everything</button>
                <button onClick={() => setEditingItem(null)} className="w-full text-[#B7AEA5] font-bold text-sm text-center">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 預覽視窗 (不變) */}
      {previewImg && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300" onClick={() => setPreviewImg(null)}>
          <button className="absolute top-10 right-10 text-white p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"><X size={32} /></button>
          <img src={previewImg} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl shadow-white/5" alt="Full Preview" />
        </div>
      )}
    </div>
  );
}