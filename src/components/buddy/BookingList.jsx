const BookingList = () => {
  const bookings = [
    { id: 1, guest: "Nguyễn Văn A", date: "25/01/2026", time: "08:00", status: "pending", guests: 2 },
    { id: 2, guest: "Trần Thị B", date: "28/01/2026", time: "14:00", status: "approved", guests: 1 }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b font-bold text-gray-800">Yêu cầu đặt lịch</div>
      <div className="divide-y">
        {bookings.map(book => (
          <div key={book.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600">{book.guest[0]}</div>
              <div>
                <h4 className="font-bold text-gray-900">{book.guest}</h4>
                <p className="text-sm text-gray-500">{book.date} • {book.time} • {book.guests} khách</p>
              </div>
            </div>
            <div className="flex gap-2">
              {book.status === 'pending' ? (
                <>
                  <button className="px-4 py-1.5 bg-orange-500 text-white text-sm font-bold rounded-lg">Duyệt</button>
                  <button className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-lg">Từ chối</button>
                </>
              ) : (
                <span className="text-green-500 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">Đã xác nhận</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BookingList;