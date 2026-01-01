import { useState, useEffect, useRef } from 'react';
import { Home, Calendar, ShoppingBag, Ticket, Wallet, Camera, Share2, Download } from 'lucide-react';
import './index.css';
import defaultHomeIllustration from './assets/home-trip.png';

// 子組件引入
import ScheduleTab from './components/ScheduleTab';
import BookingTab from './components/BookingTab';
import ShoppingTab from './components/ShoppingTab';
import ExpenseTab from './components/ExpenseTab';

// --- 一、精細化配色與間距規範 (Spacing System: 8px) ---
const THEME = {
  bgBase: '#F5F3EE',       
  primary: '#A69685',      // 加深焦糖駝色，提升按鈕對比
  primaryDark: '#2F2F2F',  // 主文字深灰
  secondary: '#9DA8A1',    
  highlight: '#8E735B',    // 行動色/強調色
  textMain: '#2F2F2F',     
  textSub: '#5A5A5A',      // 提升 15% 對比度的次要文字
  textHint: '#9A9A9A',     
  white: '#FFFFFF',
  border: '#E2DFD8',
  radius: '16px'           // 統一圓角規範
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitialData = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    try { return saved ? JSON.parse(saved) : defaultValue; } catch { return defaultValue; }
  };

  const [tripTitle, setTripTitle] = useState(() => getInitialData('intl_trip_title', 'THAILAND JOURNEY'));
  const [startDate, setStartDate] = useState(() => getInitialDate('intl_start_date', '2026-02-12'));
  const [endDate, setEndDate] = useState(() => getInitialDate('intl_end_date', '2026-02-17'));
  const [homeImage, setHomeImage] = useState(() => getInitialData('intl_home_image', defaultHomeIllustration));
  const [homeHeadline, setHomeHeadline] = useState(() => getInitialData('intl_home_headline', 'Travel Protocol.'));
  const [homeSubtext, setHomeSubtext] = useState(() => getInitialData('intl_home_subtext', 'Design your journey with a rational and minimalist perspective.'));
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [isEditingSubtext, setIsEditingSubtext] = useState(false);

  // 數據狀態
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

  useEffect(() => {
    const data = { intl_trip_title: tripTitle, intl_start_date: startDate, intl_end_date: endDate, intl_home_image: homeImage, intl_home_headline: homeHeadline, intl_home_subtext: homeSubtext, thai_schedule: scheduleData, thai_flights: flights, thai_shopping: shoppingList, thai_expense: expenseList };
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
  }, [tripTitle, startDate, endDate, homeImage, homeHeadline, homeSubtext, scheduleData, flights, shoppingList, expenseList]);

  return (
    <div 
      className="max-w-[430px] mx-auto min-h-screen flex flex-col relative transition-all duration-500 font-inter text-left"
      style={{ backgroundColor: THEME.bgBase, color: THEME.textMain }}
    >
      {/* --- Header: 字距優化 (雜誌質感) --- */}
      <header className="w-full px-10 pt-24 pb-4 flex flex-col items-start">
        {isEditingTitle ? (
          <input autoFocus className="text-[28px] font-semibold tracking-[0.1em] bg-transparent border-b-2 border-[#A69685] outline-none w-full" value={tripTitle} onChange={(e) => setTripTitle(e.target.value)} onBlur={() => setIsEditingTitle(false)} />
        ) : (
          <h1 className="text-[28px] font-semibold tracking-[0.12em] uppercase cursor-pointer leading-tight" onClick={() => setIsEditingTitle(true)}>{tripTitle}</h1>
        )}
        <div className="mt-2 min-h-[20px]">
          {isEditingDate ? (
            <div className="flex items-center gap-2" onBlur={() => setIsEditingDate(false)}>
              <input type="date" className="text-xs bg-white border border-[#E2DFD8] p-1 rounded" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <input type="date" className="text-xs bg-white border border-[#E2DFD8] p-1 rounded" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          ) : (
            <p className="text-[13px] font-medium tracking-[0.15em] uppercase" style={{ color: THEME.textSub }} onClick={() => setIsEditingDate(true)}>
              {formatDateDisplay(startDate, endDate)} <span className="mx-2 opacity-30">|</span> 
              <span style={{ color: THEME.highlight }}>{calculateDays(startDate, endDate)} DAYS</span>
            </p>
          )}
        </div>
      </header>

      {/* --- Main Area: 3:4 比例圖片 --- */}
      <main className="w-full px-10 flex-1 pb-48">
        {activeTab === 'home' && (
          <div className="flex flex-col animate-in fade-in duration-1000">
            <div className="relative group w-full aspect-[3/4] mt-10 bg-white rounded-[16px] border border-[#E2DFD8] flex items-center justify-center overflow-hidden transition-all shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
              <img src={homeImage} alt="Trip" className="w-full h-full object-cover grayscale-[5%] hover:grayscale-0 transition-all duration-700" />
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={18} color={THEME.textMain} /></button>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (file) {
                   const reader = new FileReader();
                   reader.onloadend = () => setHomeImage(reader.result as string);
                   reader.readAsDataURL(file);
                 }
              }} />
            </div>

            <div className="mt-12 space-y-10">
              <div className="space-y-4">
                {isEditingHeadline ? (
                  <input autoFocus className="text-[22px] font-semibold tracking-tight bg-transparent border-b border-[#A69685] outline-none w-full" value={homeHeadline} onChange={(e) => setHomeHeadline(e.target.value)} onBlur={() => setIsEditingHeadline(false)} />
                ) : (
                  <h2 className="text-[22px] font-semibold tracking-tight text-[#2F2F2F]" onClick={() => setIsEditingHeadline(true)}>{homeHeadline}</h2>
                )}
                {isEditingSubtext ? (
                  <textarea autoFocus className="text-[16px] leading-relaxed font-light bg-transparent border border-[#E2DFD8] p-2 rounded outline-none w-full text-[#6B6B6B]" value={homeSubtext} onChange={(e) => setHomeSubtext(e.target.value)} onBlur={() => setIsEditingSubtext(false)} rows={3} />
                ) : (
                  <p className="text-[16px] leading-relaxed font-light" style={{ color: THEME.textSub }} onClick={() => setIsEditingSubtext(true)}>{homeSubtext}</p>
                )}
              </div>
              
              <button onClick={() => setActiveTab('schedule')} className="w-full py-5 rounded-[16px] text-[15px] tracking-[0.25em] font-semibold uppercase transition-all active:scale-[0.98] shadow-sm" style={{ backgroundColor: THEME.primary, color: THEME.white }}>START JOURNEY</button>

              <div className="flex justify-center gap-8 pt-2">
                <button onClick={handleBackup} className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2"><Share2 size={12}/> Backup</button>
                <button onClick={handleRestore} className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2"><Download size={12}/> Restore</button>
              </div>
            </div>
          </div>
        )}

        {/* 子分頁保持正確的數據傳遞 */}
        {activeTab === 'schedule' && <ScheduleTab scheduleData={scheduleData} setScheduleData={setScheduleData} />}
        {activeTab === 'shopping' && <ShoppingTab shoppingList={shoppingList} setShoppingList={setShoppingList} />}
        {activeTab === 'bookings' && <BookingTab flights={flights} setFlights={setFlights} isEditing={false} setIsEditing={() => {}} />}
        {activeTab === 'expense' && <ExpenseTab expenseList={expenseList} setExpenseList={setExpenseList} />}
      </main>

      {/* --- Navigation: Active State 強化 --- */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[390px] h-20 bg-white/95 backdrop-blur-md rounded-[24px] border border-[#E2DFD8] flex justify-around items-center px-4 z-50 shadow-2xl shadow-black/5">
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
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 outline-none relative">
      <div className={`p-3 rounded-2xl transition-all duration-300 ${active ? 'bg-[#F5F3EE] scale-110' : 'bg-transparent opacity-30'}`}>
        <Icon size={22} strokeWidth={active ? 2.2 : 1.5} style={{ color: active ? '#8E735B' : '#2F2F2F' }} />
      </div>
      {active && <div className="absolute -bottom-1 w-1 h-1 bg-[#8E735B] rounded-full"></div>}
    </button>
  );
}
