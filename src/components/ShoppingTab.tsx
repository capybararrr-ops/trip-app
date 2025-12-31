import { useState } from 'react';
import { Plus, Camera, Trash2, Check, Maximize2, Tag, Pencil, ChevronDown } from 'lucide-react';

const categories = ['必買', '代購', '零食', '美妝'];
const currencies = [
  { label: '泰銖', symbol: '฿' },
  { label: '美金', symbol: '$' },
  { label: '台幣', symbol: 'NT$' },
  { label: '韓圜', symbol: '₩' },
  { label: '日幣', symbol: '¥' },
  { label: '歐元', symbol: '€' },
  { label: '英鎊', symbol: '£' }
];

export default function ShoppingTab({ shoppingList: items, setShoppingList: setItems }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ 
    name: '', 
    price: '', 
    currency: '฿',
    category: categories[0], 
    img: null as any 
  });

  const handlePhoto = (e: any, id?: number) => {
    const file = e.target.files[0];
    if (file) { 
      const url = URL.createObjectURL(file);
      if (id) {
        updateItem(id, 'img', url);
      } else {
        setNewItem({ ...newItem, img: url }); 
      }
    }
  };

  const saveItem = () => {
    if (!newItem.name) return;
    const item = { 
      id: Date.now(), 
      task: newItem.name, 
      category: newItem.category, 
      price: newItem.price, 
      currency: newItem.currency,
      done: false, 
      img: newItem.img 
    };
    setItems([item, ...items]);
    setIsAdding(false);
    setNewItem({ name: '', price: '', currency: '฿', category: categories[0], img: null });
  };

  const deleteItem = (id: number) => {
    setItems(items.filter((i: any) => i.id !== id));
  };

  const toggleDone = (id: number) => {
    setItems(items.map((i: any) => i.id === id ? { ...i, done: !i.done } : i));
  };

  const updateItem = (id: number, field: string, value: string) => {
    setItems(items.map((i: any) => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 text-left pb-32 px-1">
      {/* 標題區域 */}
      <div className="px-2 mb-8 flex justify-between items-end text-left">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#5B4636] italic text-left">Shopping List</h2>
          <p className="text-[10px] text-[#B7AEA5] font-bold uppercase tracking-widest mt-1 text-left">Wishlist & Souvenirs</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-12 h-12 bg-[#F2B94B] text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
        >
          <Plus size={28} strokeWidth={3} />
        </button>
      </div>

      {/* 分類清單顯示 */}
      <div className="space-y-10">
        {categories.map(cat => {
          const catItems = items.filter((i: any) => i.category === cat);
          if (catItems.length === 0) return null;

          return (
            <div key={cat} className="animate-in fade-in duration-500">
              <div className="flex items-center gap-2 mb-4 px-2">
                <Tag size={12} className="text-[#6FAF8E]" />
                <p className="text-[12px] font-black text-[#5B4636] uppercase tracking-[2px]">{cat}</p>
                <div className="h-[1px] flex-1 bg-[#5B4636]/10 ml-2" />
              </div>

              <div className="space-y-6">
                {catItems.map((item: any) => (
                  <div 
                    key={item.id} 
                    className={`bg-white p-6 rounded-[35px] shadow-xl shadow-[#5B4636]/5 border-2 transition-all duration-300 ${
                      item.done ? 'border-transparent opacity-60' : 'border-white'
                    }`}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-4 text-left">
                        <button 
                          onClick={() => toggleDone(item.id)}
                          className={`mt-1 w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                            item.done ? 'bg-[#6FAF8E] text-white' : 'bg-[#F6F3EE] text-transparent'
                          }`}
                        >
                          <Check size={16} strokeWidth={4} />
                        </button>

                        <div className="flex-1 space-y-3 text-left">
                          <input 
                            type="text"
                            value={item.task}
                            onChange={(e) => updateItem(item.id, 'task', e.target.value)}
                            className={`w-full bg-transparent border-none text-[17px] font-black outline-none p-0 text-[#5B4636] ${item.done ? 'line-through' : ''}`}
                            placeholder="商品名稱"
                          />
                          
                          <div className="flex items-center gap-1 bg-[#F6F3EE] w-fit px-2 py-1 rounded-full border border-[#B7AEA5]/10">
                            <div className="relative flex items-center">
                              <select 
                                value={item.currency || '฿'} 
                                onChange={(e) => updateItem(item.id, 'currency', e.target.value)}
                                className="appearance-none bg-transparent pl-2 pr-5 text-[11px] font-black text-[#6FAF8E] outline-none cursor-pointer z-10"
                              >
                                {currencies.map(c => (
                                  <option key={c.symbol} value={c.symbol}>{c.symbol} ({c.label})</option>
                                ))}
                              </select>
                              <ChevronDown size={10} className="absolute right-1 text-[#6FAF8E] pointer-events-none" />
                            </div>
                            <div className="w-[1px] h-3 bg-[#B7AEA5]/30 mx-1" />
                            <input 
                              type="text"
                              value={item.price}
                              onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                              className="bg-transparent border-none text-[12px] font-black w-20 outline-none text-[#6FAF8E]"
                              placeholder="金額"
                            />
                          </div>
                        </div>

                        <button onClick={() => deleteItem(item.id)} className="text-[#B7AEA5] p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#F6F3EE] border-2 border-dashed border-[#B7AEA5]/20 flex items-center justify-center group text-left">
                        {item.img ? (
                          <>
                            <img src={item.img} className="w-full h-full object-cover" alt="item" />
                            <div className="absolute top-3 right-3 flex gap-2">
                              <button onClick={() => setPreviewImg(item.img)} className="bg-white/90 p-2 rounded-full shadow-lg text-[#5B4636] active:scale-90"><Maximize2 size={16}/></button>
                              <label className="bg-white/90 p-2 rounded-full shadow-lg text-[#6FAF8E] cursor-pointer active:scale-90">
                                <Pencil size={16}/><input type="file" accept="image/*" onChange={(e) => handlePhoto(e, item.id)} className="hidden" />
                              </label>
                            </div>
                          </>
                        ) : (
                          <label className="flex flex-col items-center text-[#B7AEA5] cursor-pointer w-full h-full justify-center">
                            <Camera size={24} strokeWidth={1.5} />
                            <span className="text-[9px] font-bold mt-1 uppercase">Upload Product Photo</span>
                            <input type="file" accept="image/*" onChange={(e) => handlePhoto(e, item.id)} className="hidden" />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 新增商品彈窗 - 修改為置中卡片設計 */}
      {isAdding && (
        <div className="fixed inset-0 bg-[#5B4636]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-[#F6F3EE] w-full max-w-sm p-8 rounded-[40px] shadow-2xl relative text-left animate-in zoom-in-95 duration-300 overflow-y-auto no-scrollbar max-h-[90vh]">
            <h3 className="text-2xl font-serif italic font-bold text-[#5B4636] mb-6 text-left">Add Souvenir</h3>
            
            <div className="space-y-5">
              <div className="relative h-48 bg-white rounded-[30px] border-2 border-dashed border-[#B7AEA5]/30 flex items-center justify-center overflow-hidden shadow-inner">
                {newItem.img ? (
                  <img src={newItem.img} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[#B7AEA5] flex flex-col items-center">
                    <Camera size={24}/>
                    <span className="text-[10px] mt-2 font-bold uppercase">Product Image</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handlePhoto(e)} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#B7AEA5] ml-2 uppercase tracking-widest text-left block">Item Name</label>
                <input type="text" placeholder="商品名稱" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-white border-none p-4 rounded-2xl text-sm font-bold shadow-sm outline-none text-[#5B4636]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#B7AEA5] ml-2 uppercase tracking-widest text-left block">Price</label>
                  <div className="flex bg-white rounded-2xl overflow-hidden shadow-sm">
                    <select 
                      value={newItem.currency} 
                      onChange={(e) => setNewItem({...newItem, currency: e.target.value})}
                      className="bg-[#F6F3EE] px-3 text-xs font-black text-[#6FAF8E] border-none outline-none"
                    >
                      {currencies.map(c => (
                        <option key={c.symbol} value={c.symbol}>{c.symbol}</option>
                      ))}
                    </select>
                    <input type="text" placeholder="0" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="flex-1 bg-white border-none p-4 text-sm font-bold outline-none text-[#5B4636] w-full" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#B7AEA5] ml-2 uppercase tracking-widest text-left block">Category</label>
                  <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-white border-none p-4 rounded-2xl text-sm font-bold shadow-sm outline-none text-[#5B4636] appearance-none">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button onClick={saveItem} className="w-full bg-[#6FAF8E] text-white py-5 rounded-[25px] font-black shadow-xl active:scale-95 transition-all">Save to List</button>
                <button onClick={() => setIsAdding(false)} className="w-full text-[#B7AEA5] font-bold text-sm text-center">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 放大預覽 */}
      {previewImg && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}
