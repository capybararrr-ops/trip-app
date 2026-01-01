import { useState, useEffect } from 'react'; // 移除了 useRef
import { Home, Calendar, ShoppingBag, Ticket, Wallet } from 'lucide-react'; // 移除了 Camera, Share2, Download
import './index.css';

import ScheduleTab from './components/ScheduleTab';
import BookingTab from './components/BookingTab';
import ShoppingTab from './components/ShoppingTab';
import ExpenseTab from './components/ExpenseTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const getInitialData = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    try { return saved ? JSON.parse(saved) : defaultValue; } catch { return defaultValue; }
  };

  const [tripTitle, setTripTitle] = useState(() => getInitialData('intl_trip_title', 'THAILAND JOURNEY'));
  const [startDate, setStartDate] = useState(() => getInitialData('intl_start_date', '2026-02-12'));
  const [endDate, setEndDate] = useState(() => getInitialData('intl_end_date', '2026-02-17'));
  const [homeHeadline] = useState(() => getInitialData('intl_home_headline', 'Travel Protocol.'));
  const [homeSubtext] = useState(() => getInitialData('intl_home_subtext', 'Minimalist Journey Design.'));
  
  const [isEditingTab, setIsEditingTab] = useState(false);

  const [scheduleData, setScheduleData] = useState(() => getInitialData('thai_schedule', []));
  const [flights, setFlights] = useState(() => getInitialData('thai_flights', [
    { from: 'TPE', to: 'BKK', flightNum: 'JX741', date: '02/12', time: '10:40', gate: 'B7', seat: '24K', imgUrl: '' }
  ]));
  const [shoppingList, setShoppingList] = useState(() => getInitialData('thai_shopping', []));
  const [expenseList, setExpenseList] = useState(() => getInitialData('thai_expense', []));

  useEffect(() => {
    const data = { intl_trip_title: tripTitle, intl_start_date: startDate, intl_end_date: endDate, thai_schedule: scheduleData, thai_flights: flights, thai_shopping: shoppingList, thai_expense: expenseList };
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
  }, [tripTitle, startDate, endDate, scheduleData, flights, shoppingList, expenseList]);

  return (
    <div className="max-w-[430px] mx-auto min-h-screen flex flex-col relative font-inter bg-[#F5F3EE] text-[#2F2F2F] text-left">
      {activeTab === 'home' && (
        <header className="w-full px-10 pt-24 pb-4 flex flex-col items-start animate-in fade-in">
          <input 
            className="text-[28px] font-semibold tracking-[0.12em] uppercase leading-tight bg-transparent border-b border-transparent focus:border-[#A69685] outline-none w-full" 
            value={tripTitle} 
            onChange={(e) => setTripTitle(e.target.value)} 
          />
          <div className="flex gap-2 mt-2">
            <input className="text-[13px] bg-transparent w-20 outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span className="text-[13px]">—</span>
            <input className="text-[13px] bg-transparent w-20 outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </header>
      )}

      <main className={`w-full px-10 flex-1 pb-48 ${activeTab !== 'home' ? 'pt-16' : ''}`}>
        {activeTab === 'home' && (
          <div className="flex flex-col animate-in fade-in">
            <div className="mt-12 space-y-4">
              <h2 className="text-[22px] font-semibold tracking-tight">{homeHeadline}</h2>
              <p className="text-[16px] leading-relaxed font-light text-[#5A5A5A]">{homeSubtext}</p>
              <button onClick={() => setActiveTab('schedule')} className="w-full py-5 rounded-[16px] text-[15px] font-semibold uppercase bg-[#A69685] text-white mt-6 transition-all active:scale-95">START JOURNEY</button>
            </div>
          </div>
        )}
        {activeTab === 'bookings' && <BookingTab flights={flights} setFlights={setFlights} isEditing={isEditingTab} setIsEditing={setIsEditingTab} />}
        {activeTab === 'schedule' && <ScheduleTab scheduleData={scheduleData} setScheduleData={setScheduleData} />}
        {activeTab === 'shopping' && <ShoppingTab shoppingList={shoppingList} setShoppingList={setShoppingList} />}
        {activeTab === 'expense' && <ExpenseTab expenseList={expenseList} setExpenseList={setExpenseList} />}
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[390px] h-20 bg-white/95 backdrop-blur-md rounded-[24px] border border-[#E2DFD8] flex justify-around items-center px-4 z-50">
        <NavBtn Icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavBtn Icon={Calendar} active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
        <NavBtn Icon={ShoppingBag} active={activeTab === 'shopping'} onClick={() => setActiveTab('shopping')} />
        <NavBtn Icon={Ticket} active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
        <NavBtn Icon={Wallet} active={activeTab === 'expense'} onClick={() => setActiveTab('expense')} />
      </nav>
    </div>
  );
}

function NavBtn({ Icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 relative outline-none">
      <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-[#F5F3EE] scale-110' : 'opacity-30'}`}>
        <Icon size={22} strokeWidth={active ? 2.2 : 1.5} color={active ? '#8E735B' : '#2F2F2F'} />
      </div>
      {active && <div className="absolute -bottom-1 w-1 h-1 bg-[#8E735B] rounded-full"></div>}
    </button>
  );
}
