import { useState, useEffect } from 'react';
import { Home, Calendar, ShoppingBag, Ticket, Wallet } from 'lucide-react';
import './index.css';
import homeIllustration from './assets/home-trip.png';

// 假設子組件路徑與名稱正確
import ScheduleTab from './components/ScheduleTab';
import BookingTab from './components/BookingTab';
import ShoppingTab from './components/ShoppingTab';
import ExpenseTab from './components/ExpenseTab';

// --- MUJI 風格顏色定義 ---
const MUJI_COLORS = {
  bgLight: '#F7F2ED',     
  bgLighter: '#EFEBE0',   
  textMain: '#333333',    
  textSub: '#666666',     // 調深一點增加對比度，原本的 8C8C8C 太淡
  border: '#D1CDC5'       // 邊框稍微加深
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

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
        alert("🎉 資料還原成功！");
      } catch (e) { alert("❌ 格式錯誤"); }
    }
  };

  return (
    <div 
      className="max-w-[430px] mx-auto min-h-screen flex flex-col relative transition-colors duration-700 font-sans text-base"
      style={{ backgroundColor: currentMujiBg, color: MUJI_COLORS.textMain }}
    >
      {/* --- Header 區域 --- */}
      <header className="w-full px-8 pt-16 pb-8 flex justify-between items-start">
        <div className="flex flex-col flex-1">
          {isEditingTitle ? (
            <input
              autoFocus
              className="text-2xl font-bold tracking-tight bg-transparent border-b border-[#333333] outline-none w-full text-left"
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
            />
          ) : (
            <h1 className="text-2xl font-bold tracking-tight uppercase cursor-pointer text-left leading-tight" onClick={() => setIsEditingTitle(true)}>
              {tripTitle}
            </h1>
          )}

          <div className="mt-3 min-h-[24px] text-left">
            {isEditingDate ? (
              <div className="flex items-center gap-3" onBlur={() => setIsEditingDate(false)}>
                <input type="date" className="text-sm bg-transparent border-b border-gray-400 outline-none p-1" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span className="text-sm opacity-40">—</span>
                <input type="date" className="text-sm bg-transparent border-b border-gray-400 outline-none p-1" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            ) : (
              <p className="text-sm tracking-widest font-medium cursor-pointer opacity-70 hover:opacity-100" onClick={() => setIsEditingDate(true)}>
                {formatDateDisplay(startDate, endDate)}
                <span className="ml-2 font-bold text-[#A69076]">({calculateDays(startDate, endDate)} Days)</span>
              </p>
            )}
          </div>
        </div>

        <button 
          onClick={() => setCurrentMujiBg(currentMujiBg === MUJI_COLORS.bgLight ? MUJI_COLORS.bgLighter : MUJI_COLORS.bgLight)}
          className="w-10 h-10 border border-gray-300 flex items-center justify-center text-xs font-bold transition-all active:bg-white"
        >
          {currentMujiBg === MUJI_COLORS.bgLight ? 'B1' : 'B2'}
        </button>
      </header>

      {/* --- Main 區域 --- */}
      <main className="w-full px-8 flex-1 pb-40">
        {activeTab === 'home' && (
          <div className="flex flex-col animate-in fade-in duration-700">
            <div className="w-full aspect-[3/4] bg-white border border-[#D1CDC5] flex items-center justify-center p-8 mb-10 shadow-sm" onClick={() => setActiveTab('schedule')}>
              <img src={homeIllustration} alt="Trip" className="w-full h-auto opacity-95 object-contain" />
            </div>

            <div className="space-y-6 text-left">
              <h2 className="text-xl font-normal leading-snug tracking-wide">
                旅の記録。<br/>
                <span className="text-sm opacity-60 tracking-widest uppercase font-medium">Memory of Adventure</span>
              </h2>
              
              <button 
                onClick={() => setActiveTab('schedule')}
                className="w-full py-5 border-2 border-[#333333] text-sm tracking-[0.3em] font-bold uppercase hover:bg-[#333333] hover:text-white transition-all active:scale-[0.98]"
              >
                Start Journey
              </button>

              <div className="grid grid-cols-2 gap-4 mt-12">
                <button onClick={handleBackup} className="py-4 border border-gray-300 text-xs font-bold tracking-widest opacity-70">BACKUP</button>
                <button onClick={handleRestore} className="py-4 border border-gray-300 text-xs font-bold tracking-widest opacity-70">RESTORE</button>
              </div>
            </div>
          </div>
        )}

        {/* 子分頁組件注入 */}
        {activeTab === 'schedule' && <ScheduleTab scheduleData={scheduleData} setScheduleData={setScheduleData} />}
        {activeTab === 'shopping' && <ShoppingTab shoppingList={shoppingList} setShoppingList={setShoppingList} />}
        {activeTab === 'bookings' && <BookingTab flights={flights} setFlights={setFlights} isEditing={false} setIsEditing={() => {}} />}
        {activeTab === 'expense' && <ExpenseTab expenseList={expenseList} setExpenseList={setExpenseList} />}
      </main>

      {/* --- Navigation 區域 --- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-20 bg-white border-t border-[#D1CDC5] flex justify-around items-center px-4 z-50">
        <NavButton Icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} label="首頁" />
        <NavButton Icon={Calendar} active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} label="行程" />
        <NavButton Icon={ShoppingBag} active={activeTab === 'shopping'} onClick={() => setActiveTab('shopping')} label="清單" />
        <NavButton Icon={Ticket} active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} label="機票" />
        <NavButton Icon={Wallet} active={activeTab === 'expense'} onClick={() => setActiveTab('expense')} label="記帳" />
      </nav>
    </div>
  );
}

function NavButton({ Icon, active, onClick, label }: any) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 transition-all outline-none gap-1">
      <div className={`p-2 transition-colors ${active ? 'bg-[#E0DDD5]' : 'bg-transparent'}`}>
        <Icon size={24} strokeWidth={active ? 2 : 1.5} color={active ? '#333333' : '#999999'} />
      </div>
      <span className={`text-[10px] font-bold ${active ? 'text-[#333333]' : 'text-[#999999]'}`}>{label}</span>
    </button>
  );
}
