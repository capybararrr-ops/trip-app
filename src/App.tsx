import { useState, useEffect } from 'react';
import { Home, Calendar, ShoppingBag, Ticket, Wallet } from 'lucide-react';
import './index.css';
import homeIllustration from './assets/home-trip.png';

// 子組件引入
import ScheduleTab from './components/ScheduleTab';
import BookingTab from './components/BookingTab';
import ShoppingTab from './components/ShoppingTab';
import ExpenseTab from './components/ExpenseTab';

// --- 一、國際版配色規範 (Global Safe Palette) ---
const GLOBAL_THEME = {
  bgBase: '#F5F3EE',       // 中性奶油白
  primary: '#C6B8A6',      // 灰調暖駝色 (主品牌色)
  secondary: '#9DA8A1',    // 灰霧藍綠 (輔助色)
  highlight: '#D2A48C',    // 暖沙色 (強調色)
  textMain: '#2F2F2F',     // 主文字
  textSub: '#6B6B6B',      // 次要文字
  textHint: '#9A9A9A',     // 輔助說明
  white: '#FFFFFF',
  border: '#E2DFD8'        // 基於奶油白的細邊框
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const getInitialData = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    try { return saved ? JSON.parse(saved) : defaultValue; } catch { return defaultValue; }
  };

  // --- 狀態設定 ---
  const [tripTitle, setTripTitle] = useState(() => getInitialData('intl_trip_title', 'Thailand Journey'));
  const [startDate, setStartDate] = useState(() => getInitialData('intl_start_date', '2026-02-12'));
  const [endDate, setEndDate] = useState(() => getInitialData('intl_end_date', '2026-02-17'));
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);

  // 數據狀態
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

  useEffect(() => {
    const data = { intl_trip_title: tripTitle, intl_start_date: startDate, intl_end_date: endDate, 
                   thai_schedule: scheduleData, thai_flights: flights, thai_shopping: shoppingList, thai_expense: expenseList };
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
  }, [tripTitle, startDate, endDate, scheduleData, flights, shoppingList, expenseList]);

  return (
    <div 
      className="max-w-[430px] mx-auto min-h-screen flex flex-col relative transition-all duration-500"
      style={{ 
        backgroundColor: GLOBAL_THEME.bgBase, 
        color: GLOBAL_THEME.textMain,
        fontFamily: "'Inter', 'Noto Sans JP', sans-serif" // 二、字體建議
      }}
    >
      {/* --- Header: 國際 UI 標準排版 --- */}
      <header className="w-full px-8 pt-20 pb-12 flex justify-between items-start">
        <div className="flex flex-col flex-1">
          {isEditingTitle ? (
            <input
              autoFocus
              className="text-2xl font-semibold tracking-tight bg-transparent border-b-2 border-[#C6B8A6] outline-none w-full"
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
            />
          ) : (
            <h1 className="text-2xl font-semibold tracking-tight uppercase cursor-pointer" onClick={() => setIsEditingTitle(true)}>
              {tripTitle}
            </h1>
          )}

          <div className="mt-3">
            {isEditingDate ? (
              <div className="flex items-center gap-2" onBlur={() => setIsEditingDate(false)}>
                <input type="date" className="text-sm bg-white border border-[#E2DFD8] p-1 rounded-md" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span className="opacity-30">—</span>
                <input type="date" className="text-sm bg-white border border-[#E2DFD8] p-1 rounded-md" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            ) : (
              <p className="text-sm tracking-widest font-medium cursor-pointer" style={{ color: GLOBAL_THEME.textSub }} onClick={() => setIsEditingDate(true)}>
                {formatDateDisplay(startDate, endDate)}
                <span className="ml-2 font-bold" style={{ color: GLOBAL_THEME.highlight }}>
                  {calculateDays(startDate, endDate)}D
                </span>
              </p>
            )}
          </div>
        </div>
      </header>

      {/* --- Main Area: 重視 Breathing Space --- */}
      <main className="w-full px-8 flex-1 pb-40">
        {activeTab === 'home' && (
          <div className="flex flex-col animate-in fade-in duration-700">
            {/* 卡片圓角 14px */}
            <div className="w-full aspect-[4/5] bg-white rounded-[14px] border border-[#E2DFD8] flex items-center justify-center p-10 mb-10 overflow-hidden shadow-sm">
              <img src={homeIllustration} alt="Trip" className="w-full h-auto grayscale-[15%] object-contain" />
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">Travel Protocol.</h2>
                <p className="text-sm leading-relaxed" style={{ color: GLOBAL_THEME.textSub }}>
                  Design your journey with a rational and minimalist perspective.
                </p>
              </div>
              
              <button 
                onClick={() => setActiveTab('schedule')}
                className="w-full py-4 rounded-[12px] text-sm tracking-[0.15em] font-bold uppercase transition-all active:scale-[0.98]"
                style={{ backgroundColor: GLOBAL_THEME.primary, color: GLOBAL_THEME.white }}
              >
                Start Journey
              </button>
            </div>
          </div>
        )}

        {/* 子組件區域 */}
        {activeTab === 'schedule' && <ScheduleTab scheduleData={scheduleData} setScheduleData={setScheduleData} />}
        {activeTab === 'shopping' && <ShoppingTab shoppingList={shoppingList} setShoppingList={setShoppingList} />}
        {activeTab === 'bookings' && <BookingTab flights={flights} setFlights={setFlights} isEditing={false} setIsEditing={() => {}} />}
        {activeTab === 'expense' && <ExpenseTab expenseList={expenseList} setExpenseList={setExpenseList} />}
      </main>

      {/* --- Navigation: 純色 + 留白 --- */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[390px] h-18 bg-white/90 backdrop-blur-md rounded-[20px] border border-[#E2DFD8] flex justify-around items-center px-4 z-50 shadow-xl shadow-black/5">
        <NavButton Icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavButton Icon={Calendar} active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
        <NavButton Icon={ShoppingBag} active={activeTab === 'shopping'} onClick={() => setActiveTab('shopping')} />
        <NavButton Icon={Ticket} active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
        <NavButton Icon={Wallet} active={activeTab === 'expense'} onClick={() => setActiveTab('expense')} />
      </nav>
    </div>
  );
}

// --- NavButton: 線條感 1.5px ---
function NavButton({ Icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 transition-all outline-none">
      <div className={`p-2.5 rounded-xl transition-colors ${active ? '' : 'bg-transparent'}`}>
        <Icon 
          size={22} 
          strokeWidth={1.8} // 1.5-2px 的理性感
          style={{ color: active ? GLOBAL_THEME.primary : GLOBAL_THEME.textHint }} 
        />
      </div>
    </button>
  );
}
