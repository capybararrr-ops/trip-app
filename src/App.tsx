import { useState, useEffect, useRef } from 'react';
import { Home, Calendar, ShoppingBag, Ticket, Wallet, Camera, Share2, Download } from 'lucide-react';
import './index.css';
import defaultHomeIllustration from './assets/home-trip.png';

import ScheduleTab from './components/ScheduleTab';
import BookingTab from './components/BookingTab';
import ShoppingTab from './components/ShoppingTab';
import ExpenseTab from './components/ExpenseTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 核心：修正拼寫為 getInitialData
  const getInitialData = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    try { return saved ? JSON.parse(saved) : defaultValue; } catch { return defaultValue; }
  };

  const [tripTitle, setTripTitle] = useState(() => getInitialData('intl_trip_title', 'THAILAND JOURNEY'));
  const [startDate, setStartDate] = useState(() => getInitialData('intl_start_date', '2026-02-12'));
  const [endDate, setEndDate] = useState(() => getInitialData('intl_end_date', '2026-02-17'));
  const [homeImage, setHomeImage] = useState(() => getInitialData('intl_home_image', defaultHomeIllustration));
  const [homeHeadline, setHomeHeadline] = useState(() => getInitialData('intl_home_headline', 'Travel Protocol.'));
  const [homeSubtext, setHomeSubtext] = useState(() => getInitialData('intl_home_subtext', 'Design your journey with a rational and minimalist perspective.'));
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [isEditingSubtext, setIsEditingSubtext] = useState(false);
  const [isEditingTab, setIsEditingTab] = useState(false);

  const [scheduleData, setScheduleData] = useState(() => getInitialData('thai_schedule', []));
  const [flights, setFlights] = useState(() => getInitialData('thai_flights', [
    { from: 'TPE', to: 'BKK', flightNum: 'JX741', date: '02/12', time: '10:40', gate: 'B7', seat: '24K', imgUrl: '' }
  ]));
  const [shoppingList, setShoppingList] = useState(() => getInitialData('thai_shopping', []));
  const [expenseList, setExpenseList] = useState(() => getInitialData('thai_expense', []));

  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diff) ? 0 : diff;
  };

  const handleBackup = () => {
    const data = { tripTitle, startDate, endDate, homeImage, homeHeadline, homeSubtext, scheduleData, flights, shoppingList, expenseList };
    navigator.clipboard.writeText(JSON.stringify(data)).then(() => alert("✅ 資料密碼已複製！"));
  };

  const handleRestore = () => {
    const backup = prompt("請貼入資料密碼：");
    if (backup) {
      try {
        const p = JSON.parse(backup);
        if (p.tripTitle) setTripTitle(p.tripTitle);
        if (p.flights) setFlights(p.flights);
        if (p.scheduleData) setScheduleData(p.scheduleData);
        alert("🎉 資料已還原！");
      } catch (e) { alert("❌ 格式不正確"); }
    }
  };

  useEffect(() => {
    const data = { intl_trip_title: tripTitle, intl_start_date: startDate, intl_end_date: endDate, intl_home_image: homeImage, intl_home_headline: homeHeadline, intl_home_subtext: homeSubtext, thai_schedule: scheduleData, thai_flights: flights, thai_shopping: shoppingList, thai_expense: expenseList };
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
  }, [tripTitle, startDate, endDate, homeImage, homeHeadline, homeSubtext, scheduleData, flights, shoppingList, expenseList]);

  return (
    <div className="max-w-[430px] mx-auto min-h-screen flex flex-col relative font-inter bg-[#F5F3EE] text-[#2F2F2F] text-left">
      <header className="w-full px-10 pt-24 pb-4 flex flex-col items-start">
        <h1 className="text-[28px] font-semibold tracking-[0.12em] uppercase cursor-pointer" onClick={() => setIsEditingTitle(true)}>{tripTitle}</h1>
        <p className="text-[13px] font-medium tracking-[0.15em] uppercase text-[#5A5A5A] mt-2">
          {startDate.replace(/-/g, '.')} — {endDate.split('-').pop()} — <span className="text-[#8E735B]">{calculateDays(startDate, endDate)} DAYS</span>
        </p>
      </header>

      <main className="w-full px-10 flex-1 pb-48">
        {activeTab === 'home' && (
          <div className="flex flex-col">
            <div className="relative w-full aspect-[3/4] mt-10 bg-white rounded-[16px] border border-[#E2DFD8] overflow-hidden">
              <img src={homeImage} className="w-full h-full object-cover" />
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-4 right-4 p-3 bg-white/90 rounded-full shadow-sm"><Camera size={18}/></button>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0];
                if(f){ const r = new FileReader(); r.onloadend = () => setHomeImage(r.result as string); r.readAsDataURL(f); }
              }} />
            </div>
            <div className="mt-12 space-y-10">
              <div className="space-y-4">
                <h2 className="text-[22px] font-semibold tracking-tight">{homeHeadline}</h2>
                <p className="text-[16px] leading-relaxed font-light text-[#5A5A5A]">{homeSubtext}</p>
              </div>
              <button onClick={() => setActiveTab('schedule')} className="w-full py-5 rounded-[16px] text-[15px] font-semibold uppercase bg-[#A69685] text-white">START JOURNEY</button>
              <div className="flex justify-center gap-8 pt-2">
                <button onClick={handleBackup} className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-40 flex items-center gap-2"><Share2 size={12}/> Backup</button>
                <button onClick={handleRestore} className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-40 flex items-center gap-2"><Download size={12}/> Restore</button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'bookings' && <BookingTab flights={flights} setFlights={setFlights} isEditing={isEditingTab} setIsEditing={setIsEditingTab} />}
        {activeTab === 'schedule' && <ScheduleTab scheduleData={scheduleData} setScheduleData={setScheduleData} />}
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
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 outline-none relative">
      <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-[#F5F3EE] scale-110' : 'opacity-30'}`}>
        <Icon size={22} strokeWidth={active ? 2.2 : 1.5} color={active ? '#8E735B' : '#2F2F2F'} />
      </div>
      {active && <div className="absolute -bottom-1 w-1 h-1 bg-[#8E735B] rounded-full"></div>}
    </button>
  );
}
