import { useState, useEffect, useRef } from 'react';
import { Home, Calendar, ShoppingBag, Ticket, Wallet, Camera, Share2, Download } from 'lucide-react';
import './index.css';
import defaultHomeIllustration from './assets/home-trip.png';

// 引入子分頁組件（請確保你的路徑正確）
import ScheduleTab from './components/ScheduleTab';
import BookingTab from './components/BookingTab';
import ShoppingTab from './components/ShoppingTab';
import ExpenseTab from './components/ExpenseTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 資料讀取邏輯 (完全保留) ---
  const getInitialData = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    try { 
      const parsed = saved ? JSON.parse(saved) : null;
      // 針對航班資料做基本檢核，確保格式正確
      if (key === 'thai_flights' && (!parsed || parsed.length < 2)) return defaultValue;
      return parsed || defaultValue;
    } catch { return defaultValue; }
  };

  const defaultFlights = [
    { from: 'TPE', to: 'BKK', flightNum: 'JX741', date: '02/12', time: '10:40', gate: 'B7', seat: '24K', imgUrl: '' },
    { from: 'BKK', to: 'TPE', flightNum: 'JX742', date: '02/17', time: '15:20', gate: 'F1', seat: '24K', imgUrl: '' }
  ];

  // --- 狀態定義 (名稱與你原本的完全一致) ---
  const [tripTitle, setTripTitle] = useState(() => getInitialData('intl_trip_title', '我的泰國之旅'));
  const [startDate, setStartDate] = useState(() => getInitialData('intl_start_date', '2026-02-12'));
  const [endDate, setEndDate] = useState(() => getInitialData('intl_end_date', '2026-02-17'));
  const [homeImage, setHomeImage] = useState(() => getInitialData('intl_home_image', defaultHomeIllustration));
  const [homeHeadline, setHomeHeadline] = useState(() => getInitialData('intl_home_headline', '開啟你的美好旅程'));
  const [homeSubtext, setHomeSubtext] = useState(() => getInitialData('intl_home_subtext', '用最簡約的方式，記錄下與家人最珍貴的冒險。'));
  
  // 編輯模式狀態
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [isEditingSubtext, setIsEditingSubtext] = useState(false);
  const [isEditingTab, setIsEditingTab] = useState(false);

  // 子頁面資料狀態
  const [scheduleData, setScheduleData] = useState(() => getInitialData('thai_schedule', []));
  const [flights, setFlights] = useState(() => getInitialData('thai_flights', defaultFlights));
  const [shoppingList, setShoppingList] = useState(() => getInitialData('thai_shopping', []));
  const [expenseList, setExpenseList] = useState(() => getInitialData('thai_expense', []));

  // --- 功能邏輯 (完全保留) ---
  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diff) ? 0 : diff;
  };

  const handleBackup = () => {
    const data = { tripTitle, startDate, endDate, homeImage, homeHeadline, homeSubtext, scheduleData, flights, shoppingList, expenseList };
    navigator.clipboard.writeText(JSON.stringify(data)).then(() => alert("✅ 所有資料已複製到剪貼簿"));
  };

  const handleRestore = () => {
    const backup = prompt("請貼入備份資料字串：");
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
        if (p.flights) setFlights(p.flights);
        if (p.shoppingList) setShoppingList(p.shoppingList);
        if (p.expenseList) setExpenseList(p.expenseList);
        alert("🎉 資料還原成功");
      } catch (e) { alert("❌ 資料格式錯誤，還原失敗"); }
    }
  };

  // --- 自動儲存 (LocalStorage) ---
  useEffect(() => {
    const data = { 
      intl_trip_title: tripTitle, 
      intl_start_date: startDate, 
      intl_end_date: endDate, 
      intl_home_image: homeImage, 
      intl_home_headline: homeHeadline, 
      intl_home_subtext: homeSubtext, 
      thai_schedule: scheduleData, 
      thai_flights: flights, 
      thai_shopping: shoppingList, 
      thai_expense: expenseList 
    };
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
  }, [tripTitle, startDate, endDate, homeImage, homeHeadline, homeSubtext, scheduleData, flights, shoppingList, expenseList]);

  return (
    <div className="max-w-[430px] mx-auto min-h-screen flex flex-col font-sans bg-[#FDF8F5] text-[#333]">
      
      {/* 頁首：首頁專用 */}
      {activeTab === 'home' && (
        <header className="px-6 pt-20 pb-4 animate-in fade-in slide-in-from-top-4">
          {isEditingTitle ? (
            <input 
              autoFocus
              className="text-[26px] font-bold bg-white border border-[#A02828]/30 rounded px-2 w-full outline-none"
              value={tripTitle} 
              onChange={(e) => setTripTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
            />
          ) : (
            <h1 className="text-[26px] font-bold tracking-tight text-[#A02828] cursor-pointer" onClick={() => setIsEditingTitle(true)}>
              {tripTitle}
            </h1>
          )}
          
          <div className="mt-1 text-[13px] font-medium text-gray-500 cursor-pointer" onClick={() => setIsEditingDate(true)}>
            {isEditingDate ? (
              <div className="flex gap-2 items-center" onBlur={() => setIsEditingDate(false)}>
                <input type="date" className="bg-white border rounded p-1 text-xs" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span>→</span>
                <input type="date" className="bg-white border rounded p-1 text-xs" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            ) : (
              <p>
                {startDate.replace(/-/g, '.')} — {endDate.replace(/-/g, '.').split('-').slice(1).join('.')} • 
                <span className="text-[#A02828] font-bold ml-1">{calculateDays(startDate, endDate)} 天行程</span>
              </p>
            )}
          </div>
        </header>
      )}

      {/* 主內容區：將 px-10 縮減為 px-5 以換取更多橫向空間 */}
      <main className={`px-5 flex-1 pb-40 ${activeTab !== 'home' ? 'pt-12' : ''}`}>
        {activeTab === 'home' && (
          <div className="flex flex-col animate-in fade-in duration-500">
            {/* 封面圖片卡片 */}
            <div className="relative w-full aspect-[4/5] mt-6 bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white">
              <img src={homeImage} className="w-full h-full object-cover" alt="封面圖片" />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="absolute bottom-5 right-5 p-3.5 bg-white/95 rounded-full shadow-lg active:scale-90 transition-transform"
              >
                <Camera size={20} className="text-[#A02828]"/>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                hidden 
                accept="image/*" 
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if(f){ const r = new FileReader(); r.onloadend = () => { if(r.result) setHomeImage(r.result as string); }; r.readAsDataURL(f); }
                }} 
              />
            </div>

            {/* 文字說明區 */}
            <div className="mt-10 space-y-8">
              <div className="space-y-3 px-1">
                {isEditingHeadline ? (
                  <input 
                    autoFocus
                    className="text-[22px] font-bold w-full bg-transparent border-b border-[#A02828]"
                    value={homeHeadline} 
                    onChange={(e) => setHomeHeadline(e.target.value)} 
                    onBlur={() => setIsEditingHeadline(false)}
                  />
                ) : (
                  <h2 className="text-[22px] font-bold text-[#333] cursor-pointer" onClick={() => setIsEditingHeadline(true)}>{homeHeadline}</h2>
                )}

                {isEditingSubtext ? (
                  <textarea 
                    autoFocus
                    className="text-[15px] leading-relaxed w-full bg-transparent border border-[#A02828]/20 p-2 rounded"
                    value={homeSubtext} 
                    onChange={(e) => setHomeSubtext(e.target.value)} 
                    onBlur={() => setIsEditingSubtext(false)}
                  />
                ) : (
                  <p className="text-[15px] leading-relaxed text-gray-500 font-medium cursor-pointer" onClick={() => setIsEditingSubtext(true)}>{homeSubtext}</p>
                )}
              </div>

              {/* 主要動作按鈕 */}
              <button 
                onClick={() => setActiveTab('schedule')} 
                className="w-full py-4.5 rounded-[20px] text-[17px] font-bold bg-[#A02828] text-white shadow-[0_10px_25px_-5px_rgba(160,40,40,0.4)] active:scale-[0.97] transition-all"
              >
                開啟行程規劃
              </button>

              {/* 工具按鈕 */}
              <div className="flex justify-center gap-10 pt-6 border-t border-gray-100">
                <button onClick={handleBackup} className="text-[12px] font-bold text-gray-400 flex items-center gap-2 hover:text-[#A02828] transition-colors">
                  <Share2 size={14}/> 備份資料
                </button>
                <button onClick={handleRestore} className="text-[12px] font-bold text-gray-400 flex items-center gap-2 hover:text-[#A02828] transition-colors">
                  <Download size={14}/> 還原資料
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 切換分頁 */}
        {activeTab === 'schedule' && <ScheduleTab scheduleData={scheduleData} setScheduleData={setScheduleData} />}
        {activeTab === 'bookings' && <BookingTab flights={flights} setFlights={setFlights} isEditing={isEditingTab} setIsEditing={setIsEditingTab} />}
        {activeTab === 'shopping' && <ShoppingTab shoppingList={shoppingList} setShoppingList={setShoppingList} />}
        {activeTab === 'expense' && <ExpenseTab expenseList={expenseList} setExpenseList={setExpenseList} />}
      </main>

      {/* 導覽列：採用懸浮感設計 */}
      <nav className="fixed bottom-7 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] h-18 bg-white/90 backdrop-blur-xl rounded-[32px] border border-white/60 flex justify-around items-center px-2 z-50 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
        <NavBtn Icon={Home} label="首頁" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavBtn Icon={Calendar} label="行程" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
        <NavBtn Icon={ShoppingBag} label="購物" active={activeTab === 'shopping'} onClick={() => setActiveTab('shopping')} />
        <NavBtn Icon={Ticket} label="訂單" active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
        <NavBtn Icon={Wallet} label="記帳" active={activeTab === 'expense'} onClick={() => setActiveTab('expense')} />
      </nav>
    </div>
  );
}

// 導覽按鈕組件
function NavBtn({ Icon, label, active, onClick }: { Icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 transition-all relative">
      <div className={`p-2.5 rounded-[14px] transition-all duration-300 ${active ? 'bg-[#A02828] shadow-md' : 'opacity-30'}`}>
        <Icon size={22} strokeWidth={active ? 2.5 : 2} color={active ? '#FFFFFF' : '#333333'} />
      </div>
      {/* 只有作用中才顯示文字，保持簡潔 */}
      <span className={`text-[10px] mt-1 font-bold transition-all duration-300 ${active ? 'text-[#A02828] opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        {label}
      </span>
    </button>
  );
}
