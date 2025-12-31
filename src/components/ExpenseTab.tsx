import { useState } from 'react';
import { Plus, Camera, ChevronDown, X, Maximize2, Pencil } from 'lucide-react';

const currencies = [
  { label: '泰銖', symbol: '฿' },
  { label: '台幣', symbol: 'NT$' },
  { label: '美金', symbol: '$' },
  { label: '韓圜', symbol: '₩' },
  { label: '日幣', symbol: '¥' },
  { label: '歐元', symbol: '€' },
  { label: '英鎊', symbol: '£' }
];

export default function ExpenseTab({ allDays, expenseList: expenses, setExpenseList: setExpenses }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  
  const [newItem, setNewItem] = useState({ 
    date: allDays[0] || '', // 這裡就是歸類的關鍵
    item: '', 
    thb: '', 
    currency: '฿',
    splitCount: 2, 
    note: '',
    img: null as any 
  });

  const calculateDayTotal = (dayExpenses: any[]) => {
    const totals = dayExpenses.reduce((acc: any, e: any) => {
      const curr = e.currency || '฿';
      const amount = Number(e.thb) || 0;
      acc[curr] = (acc[curr] || 0) + amount;
      return acc;
    }, {});
    return Object.entries(totals).map(([symbol, amount]) => ({ symbol, amount }));
  };

  const saveExpense = () => {
    if (!newItem.item || !newItem.thb) return;
    const expense = { 
      ...newItem, 
      id: Date.now(), 
      thb: parseFloat(newItem.thb as string),
      currency: newItem.currency 
    };
    setExpenses([expense, ...expenses]);
    setIsAdding(false);
    // 重置時保留最後一次選的日期，方便連續輸入
    setNewItem({ ...newItem, item: '', thb: '', img: null, splitCount: 2, note: '' });
  };

  const updateItem = (id: number, field: string, value: any) => {
    setExpenses(expenses.map((e: any) => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleCapture = (e: any, id?: number) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (id) updateItem(id, 'img', url);
      else setNewItem({ ...newItem, img: url });
    }
  };

  const deleteItem = (id: number) => {
    setExpenses(expenses.filter((e: any) => e.id !== id));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 text-left pb-32 px-1">
      <div className="flex justify-between items-end mb-8 px-2">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#5B4636] italic">Expense</h2>
          <p className="text-[10px] text-[#B7AEA5] font-bold uppercase tracking-widest mt-1">Daily Ledger</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="w-12 h-12 bg-[#6FAF8E] text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
          <Plus size={28} strokeWidth={3} />
        </button>
      </div>

      <div className="space-y-4 px-2">
        {allDays.map((day: string) => {
          const dayExpenses = expenses.filter((e: any) => e.date === day);
          const totalAmounts = calculateDayTotal(dayExpenses);
          
          return (
            <details key={day} className="group bg-white rounded-[35px] shadow-xl shadow-[#5B4636]/5 overflow-hidden border border-white" open>
              <summary className="list-none p-6 min-h-[110px] flex justify-between items-center cursor-pointer outline-none text-left">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-[#B7AEA5] uppercase tracking-[2px] mb-1">{day}</p>
                  <p className="text-[20px] font-black text-[#5B4636]">Daily Total</p>
                </div>
                
                <div className="text-right flex flex-col justify-center items-end gap-1 flex-shrink-0 min-w-[130px]">
                  {totalAmounts.length > 0 ? (
                    totalAmounts.map((item: any) => (
                      <p key={item.symbol} className="text-[18px] font-black text-[#6FAF8E] whitespace-nowrap leading-tight">
                        {item.symbol} {item.amount.toLocaleString()}
                      </p>
                    ))
                  ) : (
                    <p className="text-[18px] font-black text-[#B7AEA5]">No Expense</p>
                  )}
                  {totalAmounts.length > 0 && <div className="w-8 h-[2px] bg-[#6FAF8E]/20 mt-1 rounded-full" />}
                </div>
                <ChevronDown size={18} className="text-[#B7AEA5] ml-3 transition-transform group-open:rotate-180" />
              </summary>
              
              <div className="px-4 pb-6 space-y-4 border-t border-[#F6F3EE] pt-6 bg-[#F6F3EE]/20">
                {dayExpenses.map((exp: any) => (
                  <div key={exp.id} className="bg-white p-5 rounded-[30px] shadow-sm relative border border-white/50">
                    <div className="flex gap-4">
                      <div className="relative w-16 h-16 bg-[#F6F3EE] rounded-2xl flex-shrink-0 overflow-hidden border-2 border-white shadow-sm mt-1">
                        {exp.img ? (
                          <>
                            <img src={exp.img} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <button onClick={() => setPreviewImg(exp.img)} className="bg-white/90 p-1.5 rounded-full text-[#5B4636] mr-1"><Maximize2 size={12}/></button>
                                <label className="bg-white/90 p-1.5 rounded-full text-[#6FAF8E] cursor-pointer"><Pencil size={12}/><input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e, exp.id)} className="hidden" /></label>
                            </div>
                          </>
                        ) : (
                          <label className="w-full h-full flex items-center justify-center cursor-pointer">
                            <Camera size={18} className="text-[#B7AEA5]" />
                            <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e, exp.id)} className="hidden" />
                          </label>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col gap-2.5 min-w-0 text-left">
                        <input type="text" value={exp.item} onChange={(e) => updateItem(exp.id, 'item', e.target.value)} className="w-full bg-transparent border-none text-[16px] font-black text-[#5B4636] p-0 outline-none" />
                        
                        <div className="flex items-center">
                          <div className="flex items-center gap-1.5 bg-[#6FAF8E]/10 px-3 py-1.5 rounded-xl border border-[#6FAF8E]/10">
                            <select value={exp.currency || '฿'} onChange={(e) => updateItem(exp.id, 'currency', e.target.value)} className="appearance-none bg-transparent text-[12px] font-black text-[#6FAF8E] outline-none">
                              {currencies.map(c => <option key={c.symbol} value={c.symbol}>{c.symbol}</option>)}
                            </select>
                            <input type="number" value={exp.thb} onChange={(e) => updateItem(exp.id, 'thb', parseFloat(e.target.value) || 0)} className="bg-transparent border-none text-[16px] font-black text-[#6FAF8E] w-24 outline-none" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#B7AEA5] font-black uppercase tracking-widest">Split:</span>
                          <select value={exp.splitCount} onChange={(e) => updateItem(exp.id, 'splitCount', parseInt(e.target.value))} className="bg-[#F6F3EE] text-[10px] font-black text-[#5B4636] px-3 py-1 rounded-lg outline-none appearance-none">
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} PPL (除以 {n})</option>)}
                          </select>
                        </div>

                        <div className="pt-2 border-t border-[#F6F3EE] mt-1">
                          <p className="text-[12px] text-[#F2B94B] font-black italic uppercase tracking-tight leading-tight">
                            Each: {exp.currency} {Math.round(Number(exp.thb) / (exp.splitCount || 1)).toLocaleString()}
                          </p>
                          {exp.note && (
                            <p className="text-[10px] text-[#B7AEA5] font-bold mt-1">
                              Note: {exp.note}
                            </p>
                          )}
                        </div>
                      </div>
                      <button onClick={() => deleteItem(exp.id)} className="absolute -top-2 -right-2 bg-white shadow-md rounded-full p-2 text-[#B7AEA5] border border-[#F6F3EE] z-10"><X size={12}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-[#5B4636]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-[#F6F3EE] w-full max-w-sm p-8 rounded-[40px] shadow-2xl relative text-left animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-serif italic font-bold text-[#5B4636] mb-6">New Expense</h3>
            
            <div className="space-y-4">
              {/* --- 新增：日期選擇器 (解決歸類錯誤的問題) --- */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-[#B7AEA5] ml-2 uppercase tracking-widest block">Choose Day</label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {allDays.map((d: string) => (
                    <button
                      key={d}
                      onClick={() => setNewItem({ ...newItem, date: d })}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl font-black text-[10px] transition-all ${
                        newItem.date === d 
                          ? 'bg-[#6FAF8E] text-white shadow-md' 
                          : 'bg-white text-[#B7AEA5] border border-[#B7AEA5]/10'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <input 
                type="text" 
                placeholder="品項名稱" 
                value={newItem.item} 
                onChange={e => setNewItem({...newItem, item: e.target.value})} 
                className="w-full bg-white p-4 rounded-2xl text-sm font-bold shadow-sm outline-none border-none text-[#5B4636]" 
              />
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex bg-white rounded-2xl overflow-hidden shadow-sm">
                  <select 
                    value={newItem.currency} 
                    onChange={(e) => setNewItem({...newItem, currency: e.target.value})} 
                    className="bg-[#6FAF8E]/10 px-2 text-xs font-black text-[#6FAF8E] border-none outline-none"
                  >
                    {currencies.map(c => <option key={c.symbol} value={c.symbol}>{c.symbol}</option>)}
                  </select>
                  <input 
                    type="number" 
                    placeholder="金額" 
                    value={newItem.thb} 
                    onChange={e => setNewItem({...newItem, thb: e.target.value})} 
                    className="flex-1 p-4 text-sm font-bold outline-none border-none text-[#5B4636] w-full" 
                  />
                </div>
                
                <select 
                  value={newItem.splitCount} 
                  onChange={e => setNewItem({...newItem, splitCount: parseInt(e.target.value)})} 
                  className="w-full bg-white p-4 rounded-2xl text-sm font-bold shadow-sm outline-none border-none text-[#5B4636]"
                >
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>Divide by {n}</option>)}
                </select>
              </div>

              <input 
                type="text" 
                placeholder="備註 (如: 與 A, B 分)" 
                value={newItem.note} 
                onChange={e => setNewItem({...newItem, note: e.target.value})} 
                className="w-full bg-white p-4 rounded-2xl text-[12px] font-bold shadow-sm outline-none border-none text-[#8A7F73]" 
              />

              <div className="pt-4 space-y-3">
                <button 
                  onClick={saveExpense} 
                  className="w-full bg-[#6FAF8E] text-white py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all"
                >
                  Record
                </button>
                <button 
                  onClick={() => setIsAdding(false)} 
                  className="w-full text-[#B7AEA5] font-bold text-sm text-center py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewImg && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}
