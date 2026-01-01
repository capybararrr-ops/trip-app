import { useState, useEffect } from 'react';
import { Home, Calendar, ShoppingBag, Ticket, Wallet } from 'lucide-react';
import './index.css';
import homeIllustration from './assets/home-trip.png';

// 假設子組件路徑不變
import ScheduleTab from './components/ScheduleTab';
import BookingTab from './components/BookingTab';
import ShoppingTab from './components/ShoppingTab';
import ExpenseTab from './components/ExpenseTab';

// --- MUJI 風格顏色定義 ---
const MUJI_COLORS = {
  bgLight: '#F7F2ED',     // 預設米砂色
  bgLighter: '#EFEBE0',   // 淺木質色
  textMain: '#333333',    // 深炭灰
  textSub: '#8C8C8C',     // 灰褐色
  border: '#E0DDD5'       // 極細邊框
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // --- 本地資料讀取 ---
  const getInitialData = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    try {
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // --- 狀態設定 ---
  const [tripTitle, setTripTitle] = useState(() => getInitialData('muji_trip_title', 'Thailand Trip'));
  const [startDate, setStartDate] = useState(() => getInitialData('muji_start_date', '2026-02-12'));
  const [endDate, setEndDate] = useState(() => getInitialData('muji_end_date', '2026-02-17'));
  const [currentMujiBg, setCurrentMujiBg] = useState(() => getInitialData('muji_theme', MUJI_COLORS.bgLight));
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);

  // 數據狀態
  const [scheduleData, setScheduleData] = useState(() => getInitialData('thai_schedule', [
    { day: 'DAY 1', date: '02/12', items: [{ time: '14:00', task: 'Check-in', desc: 'Hotel' }] }
  ]));
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
    const s = start.replace(/-/g, ' . ');
    const e = end.split('-').slice(1).join(' . ');
    return `${s} — ${e}`;
  };

  // --- 資料持久化 ---
  useEffect(() => {
    localStorage.setItem('muji_trip_title', JSON.stringify(tripTitle));
    localStorage.setItem('muji_start_date', JSON.stringify(startDate));
    localStorage.setItem('muji_end_date', JSON.stringify(endDate));
    localStorage.setItem('muji_theme', JSON.stringify(currentMujiBg));
    localStorage.setItem('thai_schedule', JSON.stringify(scheduleData));
    localStorage.setItem('thai_flights', JSON.stringify(flights));
    localStorage.setItem('thai_shopping', JSON.stringify(shoppingList));
    localStorage.setItem('thai_expense', JSON.stringify(expenseList));
  }, [tripTitle, startDate, endDate, currentMujiBg, scheduleData, flights, shoppingList, expenseList]);

  // --- 功能函式 ---
  const handleBackup = () => {
    const allData = { tripTitle, startDate, endDate, currentMujiBg, scheduleData, flights, shoppingList, expenseList };
    navigator.clipboard.writeText(JSON.stringify(allData)).then(() => alert("✅ 資料密碼已複製！"));
  };

  const handleRestore = () => {
    const backup = prompt("請貼入之前的資料密碼：");
    if (backup) {
      try {
        const p = JSON.parse(backup);
        if (p.tripTitle) setTripTitle(p.tripTitle);
        if (p.startDate) setStartDate(p.startDate);
        if (p.endDate) setEndDate(p.endDate);
        if (p.scheduleData) setScheduleData(p.scheduleData);
        if (p.flights) setFlights(p.flights);
        if (p.shoppingList) setShoppingList(p.shoppingList);
        if (p.expenseList) setExpenseList(p.expenseList);
        alert("🎉 資料還原成功！");
      } catch (e) { alert("❌ 格式錯誤"); }
    }
  };

  return (
    <div 
      className="max-w-[430px] mx-auto min-h-screen flex flex-col relative transition-colors duration-700 font-sans"
      style={{ backgroundColor: currentMujiBg, color: MUJI_COLORS.textMain }}
    >
      <header className="w-full px-10 pt-20 pb-10 flex justify-between items-start">
        <div className="flex flex-col flex-1">
          {isEditingTitle ? (
            <input
              autoFocus
              className="text-xl font-medium tracking-[0.2em] bg-transparent border-b border-[#333333] outline-none w-full"
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
            />
          ) : (
            <h1 className="text-xl font-medium tracking-[0.2em] uppercase cursor-pointer" onClick={() => setIsEditingTitle(true)}>
              {tripTitle}
            </h1>
          )}

          <div className="mt-3 min-h-[20px]">
            {isEditingDate ? (
              <div className="flex items-center gap-2" onBlur={() => setIsEditingDate(false)}>
                <input type="date" className="text-[10px] bg-transparent border-b border-gray-400 outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span className="text-[10px] opacity-30">—</span>
                <input type="date" className="text-[10px] bg-transparent border-b border-gray-400 outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            ) : (
              <p className="text-[10px] tracking-[0.2em] font-light cursor-pointer opacity-60 hover:opacity-100" onClick={() => setIsEditingDate(true)}>
                {formatDateDisplay(startDate, endDate)}
                <span className="ml-2">({calculateDays(startDate, endDate)} Days)</span>
              </p>
            )}
          </div>
        </div>

        <button 
          onClick={() => setCurrentMujiBg(currentMujiBg === MUJI_COLORS.bgLight ? MUJI_COLORS.bgLighter : MUJI_COLORS.bgLight)}
          className="w-8 h-8 border border-gray-300 flex items-center justify-center text-[10px] opacity-60"
        >
          {currentMujiBg === MUJI_COLORS.bgLight ? 'B1' : 'B2'}
        </button>
      </header>

      <main className="w-full px-10 flex-1 pb-40">
        {activeTab === 'home' && (
          <div className="flex flex-col animate-in fade-in duration-1000">
            <div className="w-full aspect-[3/4] bg-white border border-[#E0DDD5] flex items-center justify-center p-12 mb-12 shadow-sm">
              <img src={homeIllustration} alt="Trip" className="w-full h-auto grayscale-[20%] opacity-90 object-contain" />
            </div>

            <div className="space-y-8">
              <h2 className="text-lg font-light leading-relaxed tracking-wide">
                旅の記録。<br/>
                <span className="text-[12px] opacity-40 tracking-widest uppercase">Memory of Adventure</span>
              </h2>
              
              <button 
                onClick={() => setActiveTab('schedule')}
                className="w-full py-4 border border-[#333333] text-[11px] tracking-[0.5em] font-medium uppercase hover:bg-[#333333] hover:text-white transition-all"
              >
                Start Journey
              </button>

              <div className="grid grid-cols-2 gap-4 mt-12">
                <button onClick={handleBackup} className="py-4 border border-gray-300 text-[10px] tracking-widest opacity-60">BACKUP</button>
                <button onClick={handleRestore} className="py-4 border border-gray-300 text-[10px] tracking-widest opacity-60">RESTORE</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && <ScheduleTab scheduleData={scheduleData} setScheduleData={setScheduleData} />}
        {activeTab === 'shopping' && <ShoppingTab shoppingList={shoppingList} setShoppingList={setShoppingList} />}
        {activeTab === 'bookings' && <BookingTab flights={flights} setFlights={setFlights} isEditing={false} setIsEditing={() => {}} />}
        {activeTab === 'expense' && <ExpenseTab expenseList={expenseList} setExpenseList={setExpenseList} />}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-20 bg-white border-t border-[#E0DDD5] flex justify-around items-center px-4 z-50">
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
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 transition-all outline-none">
      <div className={`p-2 ${active ? 'bg-[#E0DDD5]' : ''}`}>
        <Icon size={20} strokeWidth={1.2} color={active ? '#333333' : '#8C8C8C'} />
      </div>
    </button>
  );
}
