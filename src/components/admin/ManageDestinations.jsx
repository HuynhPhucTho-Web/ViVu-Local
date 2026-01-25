const ManageDestinations = () => {
  // Logic tương tự: query collection "destinations" where status == "pending"
  // Action: updateDoc status thành "approved"
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {/* Card hiển thị hình ảnh khu du lịch, địa chỉ và nút Duyệt/Xóa */}
       <div className="bg-white p-4 rounded-2xl border flex gap-4">
          <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden">
            <img src="https://via.placeholder.com/100" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
             <h3 className="font-bold">Khu du lịch Mỹ Khánh</h3>
             <p className="text-xs text-gray-500">Người đăng: Manager A</p>
             <div className="mt-3 flex gap-2">
                <button className="flex-1 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold">Duyệt bài</button>
                <button className="flex-1 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">Xem chi tiết</button>
             </div>
          </div>
       </div>
    </div>
  );
}
export default ManageDestinations;