import { useState, useEffect, useRef } from 'react';
import { Home, Calendar, ShoppingBag, Ticket, Wallet, Camera, Share2, Download } from 'lucide-react';
import './index.css';
import defaultHomeIllustration from './assets/home-trip.png';

// 子組件引入 (請確認路徑正確)
import ScheduleTab from './components/ScheduleTab';
import BookingTab from './components/BookingTab';
import ShoppingTab from './components/ShoppingTab';
import ExpenseTab from './components/ExpenseTab';

const THEME = {
  bgBase: '#F5F3EE',       
  primary: '#A69685',      
  highlight: '#8E735B',    
  textMain: '#2F2F2F',     
  textSub: '#5A5A5A',      
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

  const [scheduleData, setScheduleData] = useState(() => getInitialData('thai_schedule', []));
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
    const s = start.replace(/-/g, '.');
    const e = end.split('-').slice(1).join('.');
    return `${s} — ${e}`;
  };

  const handleBackup = () => {
    const allData = { tripTitle, startDate, endDate, homeImage, homeHeadline, homeSubtext, scheduleData, flights, shoppingList, expenseList };
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
        if (p.homeImage) setHomeImage(p.homeImage);
        if (p.homeHeadline) setHomeHeadline(p.homeHeadline);
        if (p.homeSubtext) setHomeSubtext(p.homeSubtext);
        if (p.scheduleData) setScheduleData(p.scheduleData);
        if (p.flights) setFlights(p.flights);
        if (p.shoppingList) setShoppingList(p.shoppingList);
        if (p.expenseList) setExpenseList(p.expenseList);
        alert("🎉 資料還原成功！");
      } catch (e) { alert("❌ 格式不正確"); }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHomeImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const data = { 
      intl_trip_title: tripTitle, intl_start_date: startDate, intl_end_date: endDate, 
      intl_home_image: homeImage, intl_home_headline: homeHeadline, intl_home_subtext: homeSubtext,
      thai_schedule: scheduleData, thai_flights: flights, thai_shopping: shoppingList, thai_expense: expenseList 
    };
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
  }, [tripTitle, startDate, endDate, homeImage, homeHeadline, homeSubtext, scheduleData, flights, shoppingList, expenseList]);

  return (
    <div className="max-w-[430px] mx-auto min-h-screen flex flex-col relative font-inter text-left" style={{ backgroundColor: THEME.bgBase, color: THEME.textMain }}>
      <header className="w-full px-10 pt-24 pb-4 flex flex-col items-start">
        {isEditingTitle ? (
          <input autoFocus className="
