export default function HomeTab({ onStart }: any) {
  return (
    /* 修正：justify-start 配合 pt-16 讓標題有呼吸感，pb-40 徹底解決導覽列遮擋問題 */
    <div className="flex flex-col items-center justify-start min-h-screen text-center animate-in fade-in duration-500 pt-16 pb-40 px-6">
      
      <div className="bg-white p-10 rounded-[30px] shadow-[--shadow-soft] border-2 border-[--color-thai-sand] w-full max-w-sm">
        <h1 className="text-4xl font-bold text-[#F4A261] mb-4">🇹🇭 2026<br/>泰國孝女行</h1>
        
        {/* 象群動畫區 */}
        <div className="text-7xl my-10 animate-bounce">🐘</div>
        
        <p className="text-[--color-thai-brown] mb-10 font-medium">
          帶著爸媽去旅行<br/>是最棒的禮物！
        </p>
        
        {/* 這顆按鈕現在會離螢幕底部很遠，絕對點得到 */}
        <button 
          onClick={onStart} 
          className="bg-[#2A9D8F] text-white w-full py-4 rounded-full text-xl font-bold shadow-lg active:scale-95 transition-all"
        >
          開始規劃行程
        </button>
      </div>

    </div>
  );
}
