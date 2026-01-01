import { useState, useEffect, useRef } from 'react';
import { Home, Calendar, ShoppingBag, Ticket, Wallet, Camera } from 'lucide-react';
import './index.css';
import defaultHomeIllustration from './assets/home-trip.png';

import ScheduleTab from './components/ScheduleTab';
import BookingTab from './components/BookingTab';
import ShoppingTab from './components/ShoppingTab';
import ExpenseTab from './components/ExpenseTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitialData = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    try { return saved ? JSON.parse(saved) : defaultValue; } catch { return defaultValue; }
  };

  // 狀態全數保留
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

  useEffect(() => {
    const data = { 
      intl_trip_title: tripTitle, intl_start_date: startDate, intl_end_date: endDate, 
      intl_home_image: homeImage, intl_home_headline: homeHeadline, intl_home_subtext: homeSubtext,
      thai_schedule: scheduleData, thai_flights: flights, thai_shopping: shoppingList, thai_expense: expenseList 
    };
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
  }, [tripTitle, startDate, endDate, homeImage, homeHeadline, homeSubtext, scheduleData, flights, shoppingList, expenseList]);

  return (
    <div className="max-w-[430px] mx-auto min-h-screen flex flex-col relative font-inter bg-[#F5F3EE] text-[#2F2F2F] text-left">
      
      {/* 1. 只有首頁顯示大標題 */}
      {activeTab === 'home' && (
        <header className="w-full px-10 pt-24 pb-4 flex flex-col items-start animate-in fade-in duration-500">
          {isEditingTitle ? (
            <input autoFocus className="text-[28px] font-semibold tracking-[0.12em] bg-transparent border-b border-[#A69685] outline-none w-full uppercase" value={tripTitle} onChange={(e) => setTripTitle(e.target.value)} onBlur={() => setIsEditingTitle(false)} />
          ) : (
            <h1 className="text-[28px] font-semibold tracking-[0.12em] uppercase cursor-pointer" onClick={() => setIsEditingTitle(true)}>{tripTitle}</h1>
          )}
          <div className="mt-2">
            {isEditingDate ? (
              <div className="flex gap-2" onBlur={() => setIsEditingDate(false)}>
                <input className="text-xs bg-white p-1 rounded border" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input className="text-xs bg-white p-1 rounded border" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            ) : (
              <p className="text-[13px] font-medium tracking-[0.15em] uppercase text-[#5A5A5A]" onClick={() => setIsEditingDate(true)}>
                {startDate.replace(/-/g, '.')} — {endDate.split('-').pop()}
              </p>
            )}
          </div>
        </header>
      )}

      <main className={`w-full px-10 flex-1 pb-48 ${activeTab !== 'home' ? 'pt-16' : ''}`}>
        {activeTab === 'home' && (
          <div className="flex flex-col animate-in fade-in">
            {/* 2. 封面圖片上傳功能補回 */}
            <div className="relative group w-full aspect-[3/4] mt-10 bg-white rounded-[16px] border border-[#E2DFD8] overflow-hidden shadow-sm">
              <img src={homeImage} alt="Trip" className="w-full h-full object-cover" />
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-4 right-4 p-3 bg-white/90 rounded-full shadow-md"><Camera size={18}/></button>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0];
                if(f){ const r = new FileReader(); r.onloadend = () => setHomeImage(r.result as string); r.readAsDataURL(f); }
              }} />
            </div>

            <div className="mt-12 space-y-10">
              <div className="space-y-4">
                {isEditingHeadline ? (
                  <input autoFocus className="text-[22px] font-semibold tracking-tight bg-transparent border-b border-[#A69685] outline-none w-full" value={homeHeadline} onChange={(e) => setHomeHeadline(e.target.value)} onBlur={() => setIsEditingHeadline(false)} />
                ) : (
                  <h2 className="text-[22px] font-semibold tracking-tight" onClick={() => setIsEditingHeadline(true)}>{homeHeadline}</h2>
                )}
                {isEditingSubtext ? (
                  <textarea autoFocus className="text-[16px] leading-relaxed font-light bg-transparent border border-[#E2DFD8] p-2 rounded outline-none w-full" rows={3} value={homeSubtext} onChange={(e) => setHomeSubtext(e.target.value)} onBlur={() => setIsEditingSubtext(false)} />
                ) : (
                  <p className="text-[16px] leading-relaxed font-light text-[#5A5A5A]" onClick={() => setIsEditingSubtext(true)}>{homeSubtext}</p>
                )}
              </div>
              <button onClick={() => setActiveTab('schedule')} className="w-full py-5 rounded-[16px] text-[15px] font-semibold uppercase bg-[#A69685] text-white transition-all active:scale-95">START JOURNEY</button>
            </div>
          </div>
        )}

        {/* 3. 機票分頁對接 */}
        {activeTab === 'bookings' && <BookingTab flights={flights} setFlights={setFlights} isEditing={isEditingTab} setIsEditing={setIsEditingTab} />}
        {activeTab === 'schedule' && <ScheduleTab scheduleData={scheduleData} setScheduleData={setScheduleData} />}
        {activeTab === 'shopping' && <ShoppingTab shoppingList={shoppingList} setShoppingList={setShoppingList} />}
        {activeTab === 'expense' && <ExpenseTab expenseList={expenseList} setExpenseList={setExpenseList} />}
      </main>

      {/* 底部導航 */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[390px] h-20 bg-white/95 backdrop-blur-md rounded-[24px] border border-[#E2DFD8] flex justify-around items-center px-4 z-50 shadow-lg">
        <NavBtn Icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavBtn Icon={Calendar} active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
        <NavBtn Icon={ShoppingBag} active={activeTab === 'shopping'} onClick={() => setActiveTab('shopping')} />
        <NavBtn Icon={Ticket} active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
        <NavBtn Icon={Wallet} active={activeTab === 'expense'} onClick={() => setActiveTab('expense')} />
      </nav>
    </div>
  );
}

function NavBtn({ Icon, active, onClick }: { Icon: any, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 relative outline-none">
      <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-[#F5F3EE] scale-110' : 'opacity-30'}`}>
        <Icon size={22} strokeWidth={active ? 2.2 : 1.5} color={active ? '#8E735B' : '#2F2F2F'} />
      </div>
      {active && <div className="absolute -bottom-1 w-1 h-1 bg-[#8E735B] rounded-full"></div>}
    </button>
  );
}
