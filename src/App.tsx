import { useState, useEffect, useRef } from 'react';
import { Home, Calendar, ShoppingBag, Ticket, Wallet, Camera, Share2, Download } from 'lucide-react';
import './index.css';
import defaultHomeIllustration from './assets/home-trip.png';

// 子組件引入 (請確保路徑正確)
import ScheduleTab from './components/ScheduleTab';
import BookingTab from './components/BookingTab';
import ShoppingTab from './components/ShoppingTab';
import ExpenseTab from './components/ExpenseTab';

// --- 一、國際版優化配色規範 ---
const GLOBAL_THEME = {
  bgBase: '#F5F3EE',       
  primary: '#BFAF9A',      // 強化後的主色 (深 5-8%)
  secondary: '#9DA8A1',    
  highlight: '#D2A48C',    
  textMain: '#2F2F2F',     // 主標：深暖灰
  textSub: '#6B6B6B',      // 次要：暖灰
  textHint: '#9A9A9A',     // 說明：灰米
  white: '#FFFFFF',
  border: '#E2DFD8'        
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitialData = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    try { return saved ? JSON.parse(saved) : defaultValue; } catch { return defaultValue; }
  };

  const [tripTitle, setTripTitle] = useState(() => getInitialData('intl_trip_title', 'Thailand Journey'));
  const [startDate, setStartDate] = useState(() => getInitialData('intl_start_date', '2026-02-12'));
  const [endDate, setEndDate] = useState(() => getInitialData('intl_end_date', '2026-02-17'));
  const [homeImage, setHomeImage] = useState(() => getInitialData('intl_home_image', defaultHomeIllustration));
  const [homeHeadline, setHomeHeadline] = useState(() => getInitialData('intl_home_headline', 'Travel Protocol.'));
  const [homeSubtext, setHomeSubtext] = useState(() => getInitialData('intl_home_subtext', 'Design your journey with a rational and minimalist perspective.'));
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [isEditingSubtext, setIsEditingSubtext] = useState(false);

  const [scheduleData, setScheduleData] = useState(() => getInitialData('thai_schedule', []));
  const [flights, setFlights] = useState(() => getInitialData('thai_flights', []));
  const [shoppingList, setShoppingList] = useState(() => getInitialData('thai_shopping', []));
  const [expenseList, setExpenseList] = useState(() => getInitialData('thai_expense', []));

  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diff) ? 0 : diff;
  };

  const formatDateDisplay = (start: string, end: string) => {
    const s = start.replace(/-/g, '.');
    const e = end.split('-').slice(1).join('.');
    return `${s} — ${e}`;
  };

  const handleBackup = () => {
    const jsonString = JSON.stringify({ tripTitle, startDate, endDate, homeImage, homeHeadline, homeSubtext, scheduleData, flights, shoppingList, expenseList });
    navigator.clipboard.writeText(jsonString).then(() => alert("✅ 資料密碼已複製！"));
  };

  const handleRestore = () => {
    const backup = prompt("請貼入之前的資料密碼：");
    if (backup) {
      try {
        const p = JSON.parse(backup);
        if (p.tripTitle) setTripTitle(p.tripTitle);
        if (p.startDate) setStartDate(p.startDate);
        if (p.endDate) setEndDate(p.endDate);
        if (p.homeImage) setHomeImage(p.homeImage);
        if (p.homeHeadline) setHomeHeadline(p.homeHeadline);
        if (p.homeSubtext) setHomeSubtext(p.homeSubtext);
        if (p.scheduleData) setScheduleData(p.scheduleData);
        alert("🎉 資料已全數還原！");
      } catch (e) { alert("❌ 格式不正確"); }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHomeImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const data = { intl_trip_title: tripTitle, intl_start_date: startDate, intl_end_date: endDate, intl_home_image: homeImage, intl_home_headline: homeHeadline, intl_home_subtext: homeSubtext, thai_schedule: scheduleData, thai_flights: flights, thai_shopping: shoppingList, thai_expense: expenseList };
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
  }, [tripTitle, startDate, endDate, homeImage, homeHeadline, homeSubtext, scheduleData, flights, shoppingList, expenseList]);

  return (
    <div 
      className="max-w-[430px] mx-auto min-h-screen flex flex-col relative transition-all duration-500 font-inter text-left"
      style={{ backgroundColor: GLOBAL_THEME.bgBase, color: GLOBAL_THEME.textMain }}
    >
      {/* --- Header: 資訊收緊 (標題區) --- */}
      <header className="w-full px-10 pt-20 pb-4 flex flex-col items-start">
        {isEditingTitle ? (
          <input autoFocus className="text-[32px] font-semibold tracking-tighter bg-transparent border-b-2 border-[#C6B8A6] outline-none w-full" value={tripTitle} onChange={(e) => setTripTitle(e.target.value)} onBlur={() => setIsEditingTitle(false)} />
        ) : (
          <h1 className="text-[32px] font-semibold tracking-tighter uppercase cursor-pointer leading-tight" onClick={() => setIsEditingTitle(true)}>{tripTitle}</h1>
        )}
        <div className="mt-1 flex items-center gap-2">
          {isEditingDate ? (
            <div className="flex items-center gap-2" onBlur={() => setIsEditingDate(false)}>
              <input type="date" className="text-xs bg-white border border-[#E2DFD8] p-1 rounded" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <input type="date" className="text-xs bg-white border border-[#E2DFD8] p-1 rounded" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          ) : (
            <p className="text-[12px] font-medium tracking-[0.2em] uppercase opacity-60" onClick={() => setIsEditingDate(true)}>
              {formatDateDisplay(startDate, endDate)} — {calculateDays(startDate, endDate)} DAYS
            </p>
          )}
        </div>
      </header>

      {/* --- Main Area: 圖片最鬆 (呼吸感核心) --- */}
      <main className="w-full px-10 flex-1 pb-48">
        {activeTab === 'home' && (
          <div className="flex flex-col animate-in fade-in duration-1000">
            {/* 圖片優化：3:4 比例、圓角縮小至 12px、取消重陰影 */}
            <div className="relative group w-full aspect-[3/4] mt-8 bg-white rounded-[12px] border border-[#E2DFD8] flex items-center justify-center overflow-hidden transition-all">
              <img src={homeImage} alt="Trip" className="w-full h-full object-cover grayscale-[10%]" />
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={18} color={GLOBAL_THEME.textMain} /></button>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
            </div>

            {/* 行程資訊區 (收緊) */}
            <div className="mt-12 space-y-8">
              <div className="space-y-2">
                {isEditingHeadline ? (
                  <input autoFocus className="text-[22px] font-semibold tracking-tight bg-transparent border-b border-[#C6B8A6] outline-none w-full" value={homeHeadline} onChange={(e) => setHomeHeadline(e.target.value)} onBlur={() => setIsEditingHeadline(false)} />
                ) : (
                  <h2 className="text-[22px] font-semibold tracking-tight" onClick={() => setIsEditingHeadline(true)}>{homeHeadline}</h2>
                )}
                {isEditingSubtext ? (
                  <textarea autoFocus className="text-[15px] leading-relaxed bg-transparent border border-[#E2DFD8] p-2 rounded outline-none w-full" style={{ color: GLOBAL_THEME.textHint }} value={homeSubtext} onChange={(e) => setHomeSubtext(e.target.value)} onBlur={() => setIsEditingSubtext(false)} rows={3} />
                ) : (
                  <p className="text-[15px] leading-relaxed font-normal" style={{ color: GLOBAL_THEME.textHint }} onClick={() => setIsEditingSubtext(true)}>{homeSubtext}</p>
                )}
              </div>
              
              <button onClick={() => setActiveTab('schedule')} className="w-full py-5 rounded-[10px] text-[15px] tracking-[0.25em] font-semibold uppercase transition-all active:scale-[0.98]" style={{ backgroundColor: GLOBAL_THEME.primary, color: '#FFFFFF' }}>Start Journey</button>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button onClick={handleBackup} className="flex items-center justify-center gap-2 py-3 border border-[#E2DFD8] rounded-[10px] text-[11px] font-semibold tracking-widest text-[#9A9A9A] hover:bg-white transition-all"><Share2 size={14} /> BACKUP</button>
                <button onClick={handleRestore} className="flex items-center justify-center gap-2 py-3 border border-[#E2DFD8] rounded-[10px] text-[11px] font-semibold tracking-widest text-[#9A9A9A] hover:bg-white transition-all"><Download size={14} /> RESTORE</button>
              </div>
            </div>
          </div>
        )}

        {/* 子分頁... */}
        {activeTab === 'schedule' && <ScheduleTab scheduleData={scheduleData} setScheduleData={setScheduleData} />}
        {activeTab === 'shopping' && <ShoppingTab shoppingList={shoppingList} setShoppingList={setShoppingList} />}
        {activeTab === 'bookings' && <BookingTab flights={flights} setFlights={setFlights} isEditing={false} setIsEditing={() => {}} />}
        {activeTab === 'expense' && <ExpenseTab expenseList={expenseList} setExpenseList={setExpenseList} />}
      </main>

      {/* --- Navigation: 懸浮輕量化 --- */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[390px] h-18 bg-white/95 backdrop-blur rounded-[20px] border border-[#E2DFD8] flex justify-around items-center px-4 z-50 shadow-sm">
        <NavButton Icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavButton Icon={Calendar} active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
        <NavButton Icon={ShoppingBag} active={activeTab === 'shopping'} onClick={() => setActiveTab('shopping')} />
        <NavButton Icon={Ticket} active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
        <NavButton Icon={Wallet} active={activeTab === 'expense'} onClick={() => setActiveTab('expense')} />
      </nav>
    </div>
  );
}

function NavButton({ Icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 outline-none">
      <div className={`p-3 rounded-xl transition-all ${active ? 'bg-[#F5F3EE]' : 'opacity-30'}`}>
        <Icon size={22} strokeWidth={1.5} style={{ color: active ? '#BFAF9A' : '#2F2F2F' }} />
      </div>
    </button>
  );
}
