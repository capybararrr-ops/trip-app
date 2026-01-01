import { useState, useEffect, useRef } from 'react';
import { Home, Calendar, ShoppingBag, Ticket, Wallet, Camera } from 'lucide-react';
import './index.css';
import defaultHomeIllustration from './assets/home-trip.png';

// 子組件引入
import ScheduleTab from './components/ScheduleTab';
import BookingTab from './components/BookingTab';
import ShoppingTab from './components/ShoppingTab';
import ExpenseTab from './components/ExpenseTab';

// --- 一、國際版配色規範 ---
const GLOBAL_THEME = {
  bgBase: '#F5F3EE',       
  primary: '#C6B8A6',      
  secondary: '#9DA8A1',    
  highlight: '#D2A48C',    
  textMain: '#2F2F2F',     
  textSub: '#6B6B6B',      
  textHint: '#9A9A9A',     
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

  // --- 狀態設定 ---
  const [tripTitle, setTripTitle] = useState(() => getInitialData('intl_trip_title', 'Thailand Journey'));
  const [startDate, setStartDate] = useState(() => getInitialData('intl_start_date', '2026-02-12'));
  const [endDate, setEndDate] = useState(() => getInitialData('intl_end_date', '2026-02-17'));
  const [homeImage, setHomeImage] = useState(() => getInitialData('intl_home_image', defaultHomeIllustration));
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);

  // 數據狀態 (未使用 set 方法可加底線避免 TS 報錯)
  const [scheduleData, setScheduleData] = useState(() => getInitialData('thai_schedule', []));
  const [flights, setFlights] = useState(() => getInitialData('thai_flights', []));
  const [shoppingList, setShoppingList] = useState(() => getInitialData('thai_shopping', []));
  const [expenseList, setExpenseList] = useState(() => getInitialData('thai_expense', []));

  // --- 邏輯計算 ---
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

  // --- 圖片更換邏輯 ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHomeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const data = { 
      intl_trip_title: tripTitle, intl_start_date: startDate, intl_end_date: endDate, 
      intl_home_image: homeImage, thai_schedule: scheduleData, thai_flights: flights, 
      thai_shopping: shoppingList, thai_expense: expenseList 
    };
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
  }, [tripTitle, startDate, endDate, homeImage, scheduleData, flights, shoppingList, expenseList]);

  return (
    <div 
      className="max-w-[430px] mx-auto min-h-screen flex flex-col relative transition-all duration-500 font-inter"
      style={{ backgroundColor: GLOBAL_THEME.bgBase, color: GLOBAL_THEME.textMain }}
    >
      {/* --- Header: 字體 Semibold --- */}
      <header className="w-full px-8 pt-20 pb-10 flex flex-col items-start">
        {isEditingTitle ? (
          <input
            autoFocus
            className="text-[28px] font-semibold tracking-tight bg-transparent border-b-2 border-[#C6B8A6] outline-none w-full"
            value={tripTitle}
            onChange={(e) => setTripTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
          />
        ) : (
          <h1 className="text-[28px] font-semibold tracking-tight uppercase cursor-pointer leading-tight" onClick={() => setIsEditingTitle(true)}>
            {tripTitle}
          </h1>
        )}

        <div className="mt-4">
          {isEditingDate ? (
            <div className="flex items-center gap-3" onBlur={() => setIsEditingDate(false)}>
              <input type="date" className="text-base bg-white border border-[#E2DFD8] p-2 rounded-lg" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <span className="opacity-30">—</span>
              <input type="date" className="text-base bg-white border border-[#E2DFD8] p-2 rounded-lg" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          ) : (
            <p className="text-[15px] tracking-[0.15em] font-regular cursor-pointer flex items-center" style={{ color: GLOBAL_THEME.textSub }} onClick={() => setIsEditingDate(true)}>
              {formatDateDisplay(startDate, endDate)}
              <span className="ml-3 font-bold px-2 py-0.5 rounded bg-[#D2A48C]/10 text-[#D2A48C]">
                {calculateDays(startDate, endDate)} DAYS
              </span>
            </p>
          )}
        </div>
      </header>

      {/* --- Main Area --- */}
      <main className="w-full px-8 flex-1 pb-44">
        {activeTab === 'home' && (
          <div className="flex flex-col animate-in fade-in duration-700">
            {/* 圖片區域：增加更換按鈕 */}
            <div className="relative group w-full aspect-[4/5] bg-white rounded-[14px] border border-[#E2DFD8] flex items-center justify-center overflow-hidden shadow-sm">
              <img src={homeImage} alt="Trip" className="w-full h-full object-cover" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={20} color={GLOBAL_THEME.textMain} />
              </button>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
            </div>

            <div className="mt-10 space-y-8">
              <div className="space-y-3">
                <h2 className="text-[22px] font-semibold tracking-tight">Travel Protocol.</h2>
                <p className="text-[16px] font-regular leading-relaxed" style={{ color: GLOBAL_THEME.textSub }}>
                  Design your journey with a rational and minimalist perspective.
                </p>
              </div>
              
              <button 
                onClick={() => setActiveTab('schedule')}
                className="w-full py-5 rounded-[12px] text-base tracking-[0.2em] font-semibold uppercase transition-all active:scale-[0.98]"
                style={{ backgroundColor: GLOBAL_THEME.primary, color: GLOBAL_THEME.white }}
              >
                Start Journey
              </button>
            </div>
          </div>
        )}

        {/* 子組件 */}
        {activeTab === 'schedule' && <ScheduleTab scheduleData={scheduleData} setScheduleData={setScheduleData} />}
        {activeTab === 'shopping' && <ShoppingTab shoppingList={shoppingList} setShoppingList={setShoppingList} />}
        {activeTab === 'bookings' && <BookingTab flights={flights} setFlights={setFlights} isEditing={false} setIsEditing={() => {}} />}
        {activeTab === 'expense' && <ExpenseTab expenseList={expenseList} setExpenseList={setExpenseList} />}
      </main>

      {/* --- Navigation --- */}
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
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 outline-none">
      <div className={`p-3 rounded-2xl transition-all ${active ? 'scale-110' : 'opacity-40'}`}>
        <Icon size={24} strokeWidth={1.8} style={{ color: active ? GLOBAL_THEME.primary : GLOBAL_THEME.textMain }} />
      </div>
    </button>
  );
}
