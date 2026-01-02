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
  }, [tripTitle, startDate, endDate, homeImage, homeHeadline, homeSubtext, scheduleData, flights, shoppingList
