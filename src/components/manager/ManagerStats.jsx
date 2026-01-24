const ManagerStats = ({ destinations }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase">Tổng lượt tương tác</p>
        <p className="text-3xl font-black text-gray-800 mt-1">1,284</p>
        <div className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1">↑ 12% so với tháng trước</div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase">Đánh giá trung bình</p>
        <p className="text-3xl font-black text-gray-800 mt-1">4.8 / 5</p>
        <div className="flex gap-1 mt-2 text-yellow-400">★★★★★</div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase">Yêu cầu liên hệ</p>
        <p className="text-3xl font-black text-gray-800 mt-1">24</p>
        <div className="text-blue-500 text-xs font-bold mt-2 underline cursor-pointer">Xem danh sách</div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">Biểu đồ lượt xem (Demo)</h3>
      <div className="h-48 bg-gray-50 rounded-2xl flex items-end justify-between p-4 gap-2">
        {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
          <div key={i} style={{ height: `${h}%` }} className="w-full bg-orange-400 rounded-t-lg opacity-80 hover:opacity-100 transition-all"></div>
        ))}
      </div>
    </div>
  </div>
);
export default ManagerStats;