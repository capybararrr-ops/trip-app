import { useState, useEffect } from 'react';
import { Home, Calendar, ShoppingBag, Ticket, Wallet } from 'lucide-react';
import './index.css';
import homeIllustration from './assets/home-trip.png';

// 引入所有子分頁組件
import ScheduleTab from './components/ScheduleTab';
import BookingTab from './components/BookingTab';
import ShoppingTab from './components/ShoppingTab';
import ExpenseTab from './components/ExpenseTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // --- 本地資料讀取函式 ---
  const getInitialData = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [scheduleData, setScheduleData] = useState(() => getInitialData('thai_schedule', [
    { 
      day: 'DAY 1', 
      date: '02/12', 
      items: [{ time: '14:00', icon: '🏨', task: 'Check-in Hotel', desc: '市中心設計旅店', note: '記得寄存行李', link: '', img: '', bookingLink: '', bookingNo: '', bookingImg: '' }] 
    }
  ]));

  const [flights, setFlights] = useState(() => getInitialData('thai_flights', [
    { 
      type: 'Departure', flightNum: 'JX741', from: 'TPE', to: 'BKK', 
      date: '02/12', gate: 'B7', time: '10:40', seat: '24K', imgUrl: '', pdfUrl: '' 
    },
    { 
      type: 'Return', flightNum: 'JX742', from: 'BKK', to: 'TPE', 
      date: '02/17', gate: 'F3', time: '18:50', seat: '12A', imgUrl: '', pdfUrl: '' 
    }
  ]));

  const [isBookingEditing, setIsBookingEditing] = useState(false);
  const [shoppingList, setShoppingList] = useState(() => getInitialData('thai_shopping', []));
  const [expenseList, setExpenseList] = useState(() => getInitialData('thai_expense', []));

  useEffect(() => { localStorage.setItem('thai_schedule', JSON.stringify(scheduleData)); }, [scheduleData]);
  useEffect(() => { localStorage.setItem('thai_flights', JSON.stringify(flights)); }, [flights]);
  useEffect(() => { localStorage.setItem('thai_shopping', JSON.stringify(shoppingList)); }, [shoppingList]);
  useEffect(() => { localStorage.setItem('thai_expense', JSON.stringify(expenseList)); }, [expenseList]);

  const addDay = () => {
    const nextDayNum = scheduleData.length + 1;
    const lastDate = new Date(`2026/${scheduleData[scheduleData.length - 1].date}`);
    lastDate.setDate(lastDate.getDate() + 1);
    const m = (lastDate.getMonth() + 1).toString().padStart(2, '0');
    const d = lastDate.getDate().toString().padStart(2, '0');
    setScheduleData([...scheduleData, { day: `DAY ${nextDayNum}`, date: `${m}/${d}`, items: [] }]);
  };

  const removeDay = () => {
    if (scheduleData.length <= 1) return;
    if (window.confirm(`確定要刪除最後一天 (${scheduleData[scheduleData.length - 1].day}) 嗎？`)) {
      setScheduleData(scheduleData.slice(0, -1));
    }
  };

  const updateFlight = (field: string, value: string, index: number) => {
    const newFlights = [...flights];
    newFlights[index] = { ...newFlights[index], [field]: value };
    setFlights(newFlights);
  };

  const allDays = scheduleData.map((d: any) => d.day);

  // --- 備份與還原邏輯 ---
  const handleBackup = () => {
    const allData = {
      schedule: scheduleData,
      flights: flights,
      shopping: shoppingList,
      expense: expenseList
    };
    const jsonString = JSON.stringify(allData);
    navigator.clipboard.writeText(jsonString).then(() => {
      alert("✅ 資料密碼已複製！請去 Line 貼上保存（不含照片）。");
    });
  };

  const handleRestore = () => {
    const backup = prompt("請貼入之前的資料密碼：");
    if (backup) {
      try {
        const parsed = JSON.parse(backup);
        if (parsed.schedule) setScheduleData(parsed.schedule);
        if (parsed.flights) setFlights(parsed.flights);
        if (parsed.shopping) setShoppingList(parsed.shopping);
        if (parsed.expense) setExpenseList(parsed.expense);
        alert("🎉 所有資料已還原成功！");
      } catch (e) {
        alert("❌ 格式不正確，請檢查是否複製完整。");
      }
    }
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-screen flex flex-col relative font-sans bg-[#F6F3EE] shadow-2xl border-x border-gray-100 text-left text-[#5B4636]">
      
      <header className="w-full px-10 pt-12 pb-2 flex justify-between items-start z-20 text-left">
        <div className="flex flex-col space-y-0.5 text-left">
          <h1 className="text-3xl font-bold italic leading-none text-[#F2B94B] font-serif text-left">Thailand</h1>
          <span className="text-[10px] tracking-[0.15em] font-bold opacity-80 uppercase tracking-widest text-[#B7AEA5] text-left">2026/02/12 - 02/17</span>
        </div>
        <div className="w-10 h-10 border-[1.5px] border-[#5B4636] rounded-full flex items-center justify-center text-[10px] font-bold bg-white shadow-sm">TH</div>
      </header>

      <main className="w-full px-10 flex-1 flex flex-col z-10 pb-40">
        <br />
        
        {activeTab === 'home' && (
          <div className="flex flex-col text-left animate-in fade-in duration-700">
            <div className="mt-2 mb-6 text-left">
              <h2 className="text-[40px] leading-[1.1] font-serif text-left">Happy <span className="text-[#8A7F73] font-light italic text-[32px]">Trip</span><br/>Planning</h2>
              <div className="mt-4 text-left">
                <p className="text-[13px] font-bold text-[#5B4636] text-left">2026 泰國孝女行</p>
                <p className="text-[11px] text-[#8A7F73] text-left">記錄下與家人最珍貴的冒險時光</p>
              </div>
            </div>
            
            <div onClick={() => setActiveTab('schedule')} className="illustration-card w-full flex flex-col items-center p-8 pb-10 cursor-pointer transition-transform active:scale-95 bg-white rounded-[40px] shadow-sm mb-12">
              <img src={homeIllustration} alt="Home" className="w-full h-auto max-h-[300px] object-contain drop-shadow-2xl mb-8" />
              <div className="w-full flex justify-center">
                <button className="btn-pill-start text-[12px] uppercase py-3.5 px-14 font-black bg-[#6FAF8E] text-white rounded-full shadow-lg">Tap to start</button>
              </div>
            </div>

            {/* 資料備份區塊 */}
            <div className="bg-[#5B4636]/5 p-6 rounded-[35px] border border-dashed border-[#5B4636]/20">
              <h4 className="text-[10px] font-black text-[#B7AEA5] uppercase tracking-widest mb-4 text-center">Data Security</h4>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleBackup}
                  className="bg-white py-4 rounded-2xl text-[12px] font-black text-[#5B4636] shadow-sm active:scale-95 transition-all flex flex-col items-center gap-1"
                >
                  <span>📤 備份資料</span>
                  <span className="text-[9px] opacity-40 font-bold">複製密碼</span>
                </button>
                <button 
                  onClick={handleRestore}
                  className="bg-white py-4 rounded-2xl text-[12px] font-black text-[#6FAF8E] shadow-sm active:scale-95 transition-all flex flex-col items-center gap-1"
                >
                  <span>📥 還原資料</span>
                  <span className="text-[9px] opacity-40 font-bold">貼上密碼</span>
                </button>
              </div>
              <p className="text-[9px] text-[#B7AEA5] font-bold mt-4 leading-relaxed text-center">
                備份僅含文字內容，不含照片。<br/>重要照片請務必儲存至手機相簿。
              </p>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && <ScheduleTab scheduleData={scheduleData} setScheduleData={setScheduleData} addDay={addDay} removeDay={removeDay} />}
        {activeTab === 'shopping' && <ShoppingTab shoppingList={shoppingList} setShoppingList={setShoppingList} />}
        {activeTab === 'bookings' && <BookingTab flights={flights} updateFlight={updateFlight} isEditing={isBookingEditing} setIsEditing={setIsBookingEditing} />}
        {activeTab === 'expense' && <ExpenseTab allDays={allDays} expenseList={expenseList} setExpenseList={setExpenseList} />}
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 px-10">
        <nav className="w-full h-16 bg-white/90 backdrop-blur-xl border border-white/40 rounded-[35px] flex justify-around items-center px-2 shadow-xl shadow-[#5B4636]/10">
          <NavButton Icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavButton Icon={Calendar} active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
          <NavButton Icon={ShoppingBag} active={activeTab === 'shopping'} onClick={() => setActiveTab('shopping')} />
          <NavButton Icon={Ticket} active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
          <NavButton Icon={Wallet} active={activeTab === 'expense'} onClick={() => setActiveTab('expense')} />
        </nav>
      </div>
    </div>
  );
}

function NavButton({ Icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 outline-none">
      <div className={`p-2.5 rounded-2xl transition-all ${active ? 'bg-[#6FAF8E]/15 scale-110' : 'bg-transparent hover:bg-gray-50'}`}>
        <Icon size={24} className={active ? 'text-[#6FAF8E]' : 'text-[#B7AEA5]'} strokeWidth={active ? 2.5 : 1.8} />
      </div>
    </button>
  );
}
