const BuddyWallet = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-3xl text-white shadow-xl shadow-orange-100">
      <p className="opacity-80 text-sm font-medium">Số dư khả dụng</p>
      <h2 className="text-4xl font-black mt-1">4.500.000đ</h2>
      <button className="mt-6 bg-white text-orange-600 px-6 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-orange-50 transition">Rút tiền về ngân hàng</button>
    </div>
    
    <div className="bg-white rounded-2xl border p-4">
      <h3 className="font-bold mb-4">Lịch sử giao dịch</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm border-b pb-2">
          <span>Dẫn tour khách Nguyễn Văn A</span>
          <span className="text-green-600 font-bold">+450,000đ</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b pb-2">
          <span>Phí sàn (10%)</span>
          <span className="text-red-500 font-bold">-50,000đ</span>
        </div>
      </div>
    </div>
  </div>
);
export default BuddyWallet;