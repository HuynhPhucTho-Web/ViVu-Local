const ManagerReviews = () => (
  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
    <div className="p-6 border-b font-bold text-gray-800">Khách du lịch nói gì về bạn</div>
    <div className="divide-y">
      {[1, 2].map((r) => (
        <div key={r} className="p-6 flex gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex-shrink-0"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800 text-sm">Nguyễn Văn Khách</span>
              <span className="text-yellow-400 text-xs">★★★★★</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">"Khu du lịch rất sạch sẽ, đồ ăn ngon và nhân viên phục vụ cực kỳ tận tình. Sẽ quay lại!"</p>
            <button className="mt-3 text-[11px] font-bold text-orange-500 hover:underline">Phản hồi lại khách</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export default ManagerReviews;