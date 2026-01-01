import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import BookingTab from './components/BookingTab';
import ScheduleTab from './components/ScheduleTab';
import MapTab from './components/MapTab';

// 預設資料：若使用者第一次開啟，會看到這些內容
const INITIAL_FLIGHTS = [
  {
    flightNum: 'JX741',
    from: 'TPE',
    to: 'BKK',
    date: 'DEC 24, 2025',
    gate: 'B7',
    time: '08:15',
    seat: '12A',
    imgUrl: '',
    pdfUrl: ''
  }
];

const INITIAL_SCHEDULE = [
  {
    day: 'DAY 01',
    date: 'DEC 24',
    location: 'Bangkok',
    activities: [
      { time: '12:30', title: 'Arrival & Hotel Check-in', detail: 'The Standard, Bangkok' },
      { time: '18:00', title: 'Dinner at Jodd Fairs', detail: 'Night market food tour' }
    ]
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [isEditing, setIsEditing] = useState(false);

  // --- 核心邏輯：從本地儲存讀取資料 ---
  const [flights, setFlights] = useState(() => {
    const saved = localStorage.getItem('trip_flights');
    return saved ? JSON.parse(saved) : INITIAL_FLIGHTS;
  });

  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('trip_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [tripName, setTripName] = useState(() => {
    return localStorage.getItem('trip_name') || 'BANGKOK WINTER';
  });

  // --- 核心邏輯：當資料變動時，自動存入本地儲存 ---
  useEffect(() => {
    localStorage.setItem('trip_flights', JSON.stringify(flights));
  }, [flights]);

  useEffect(() => {
    localStorage.setItem('trip_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('trip_name', tripName);
  }, [tripName]);

  return (
    <div className="min-h-screen bg-[#F5F3EE] text-[#2F2F2F] font-sans selection:bg-[#8E735B]/20">
      {/* 頂部導航欄 */}
      <nav className="fixed top-0 left-0 right-0 bg-[#F5F3EE]/80 backdrop-blur-md z-[100] border-b border-[#E2DFD8]">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          {isEditing ? (
            <input 
              className="text-sm font-bold tracking-[0.3em] uppercase bg-white border border-[#C6B8A6] px-2 py-1 outline-none rounded"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />
          ) : (
            <h1 className="text-[11px] font-bold tracking-[0.4em] uppercase opacity-60">
              {tripName}
            </h1>
          )}
          <div className="flex gap-4">
            {/* 這裡可以放頭像或其他小圖示 */}
            <div className="w-8 h-8 rounded-full bg-[#E2DFD8] overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </div>
        </div>
      </nav>

      {/* 主要內容區 */}
      <main className="max-w-md mx-auto px-6 pt-24 pb-32">
        {activeTab === 'bookings' && (
          <BookingTab 
            flights={flights} 
            setFlights={setFlights} 
            isEditing={isEditing} 
            setIsEditing={setIsEditing} 
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleTab 
            schedule={schedule} 
            setSchedule={setSchedule} 
            isEditing={isEditing} 
            setIsEditing={setIsEditing} 
          />
        )}

        {activeTab === 'map' && (
          <MapTab />
        )}
      </main>

      {/* 底部導航按鈕 */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
