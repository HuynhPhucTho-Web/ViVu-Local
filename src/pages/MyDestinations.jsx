const MyDestinations = () => {
  const { user } = useAuthStore();
  const [myPlaces, setMyPlaces] = useState([]);

  // Lấy danh sách điểm đến mà Manager này đã đăng
  useEffect(() => {
    const q = query(
      collection(db, "destinations"), 
      where("managerId", "==", user.id)
    );
    // ... fetch dữ liệu ...
  }, [user.id]);

  return (
    <div>
      {myPlaces.map(place => (
        <div key={place.id}>
          <h4>{place.title}</h4>
          <span>Trạng thái: {place.status === 'pending' ? '⏳ Chờ Admin duyệt' : '✅ Đã hiển thị'}</span>
          <button>Chỉnh sửa thông tin</button>
        </div>
      ))}
    </div>
  )
}