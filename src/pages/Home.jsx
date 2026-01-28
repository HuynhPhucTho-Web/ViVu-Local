import { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Star, DollarSign, Search, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../components/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [budget, setBudget] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Lấy dữ liệu thật từ Firebase - random destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const q = query(
          collection(db, "destinations"),
          where("status", "==", "approved") // Chỉ lấy bài đã duyệt
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Shuffle array randomly
        const shuffled = data.sort(() => 0.5 - Math.random());
        // Take first 12 for sliding effect
        setDestinations(shuffled.slice(0, 12));
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // 2. Xử lý tìm kiếm thông minh
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (budget) params.append('budget', budget);
    
    navigate(`/discovery?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="relative h-[650px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80"
          alt="Vietnam Landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto animate-in fade-in zoom-in duration-700">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic">
            ViVuLocal – Chạm vào bản sắc
          </h1>
          <p className="text-xl md:text-2xl mb-12 font-medium text-gray-100">
            Đi như người bản địa, trải nghiệm như người bản xứ
          </p>
          
          {/* Smart Search Bar */}
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-[32px] shadow-2xl flex flex-col md:flex-row items-center max-w-3xl mx-auto border border-white/20">
            <div className="flex-1 flex items-center px-6 py-4 w-full border-b md:border-b-0 md:border-r border-gray-100">
              <MapPin className="text-orange-500 mr-3 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Bạn muốn đi đâu?" 
                className="w-full outline-none text-gray-800 placeholder-gray-400 bg-transparent font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex-1 flex items-center px-6 py-4 w-full">
              <DollarSign className="text-green-500 mr-3 h-5 w-5" />
              <select 
                className="w-full outline-none text-gray-800 bg-transparent cursor-pointer font-bold appearance-none"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="">Tất cả ngân sách</option>
                <option value="low">Tiết kiệm (Dưới 500k)</option>
                <option value="medium">Trung bình (500k - 2Tr)</option>
                <option value="high">Sang trọng (Trên 2Tr)</option>
              </select>
            </div>
            <button 
              onClick={handleSearch}
              className="bg-orange-500 text-white px-10 py-4 rounded-[24px] font-black hover:bg-orange-600 transition-all m-1 w-full md:w-auto shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <Search size={20} /> KHÁM PHÁ
            </button>
          </div>
        </div>
      </header>

      {/* Section 1: Featured Destinations */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Điểm đến tiêu biểu</h2>
            <p className="text-gray-500 font-medium">Những vùng đất đang được cộng đồng yêu thích nhất</p>
          </div>
          <Link to="/discovery" className="bg-white border border-gray-200 px-6 py-3 rounded-2xl text-orange-500 font-bold flex items-center hover:bg-orange-50 transition-all shadow-sm">
            Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-orange-500" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {destinations.slice(0, 8).map((place) => (
              <Link
                key={place.id}
                to={`/destination/${place.id}`}
                className="group relative rounded-[32px] overflow-hidden shadow-xl h-[350px] cursor-pointer block hover:-translate-y-2 transition-all duration-500"
              >
                <img
                  src={place.image || "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80"}
                  alt={place.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-orange-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {place.category || 'Du lịch'}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-yellow-400">
                      <Star size={14} fill="currentColor" /> {place.rating || '5.0'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-2 leading-tight line-clamp-2">{place.title}</h3>
                  <div className="flex items-center gap-1 text-gray-300 text-sm font-medium">
                    <MapPin size={14} /> {place.location}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Local Buddy Teaser */}
      <section className="bg-slate-900 py-24 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80" 
              alt="Local Buddy" 
              className="rounded-[40px] shadow-2xl w-full object-cover h-[550px] relative z-10 border border-white/10" 
            />
          </div>
          <div className="md:w-1/2">
            <span className="text-orange-500 font-black tracking-widest uppercase text-sm">Kết nối bản địa</span>
            <h2 className="text-5xl font-black mt-4 mb-8 leading-tight">Khám phá qua đôi mắt người bản xứ</h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Quên đi những tấm bản đồ vô hồn. Hãy để các <b>Local Buddy</b> đồng hành cùng bạn trên những con hẻm nhỏ, quán ăn không tên nhưng vị ngon khó cưỡng.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <Star className="h-8 w-8 text-yellow-400 fill-current mb-3" />
                <h4 className="font-bold text-xl mb-1">Tin cậy 100%</h4>
                <p className="text-sm text-gray-500">Đánh giá thật từ khách đã trải nghiệm</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <DollarSign className="h-8 w-8 text-green-500 mb-3" />
                <h4 className="font-bold text-xl mb-1">Giá linh hoạt</h4>
                <p className="text-sm text-gray-500">Đặt theo giờ hoặc theo hành trình</p>
              </div>
            </div>
            
            <Link to="/buddy" className="inline-block bg-orange-500 text-white px-10 py-4 rounded-full font-black hover:bg-orange-600 transition shadow-xl shadow-orange-500/20 active:scale-95 uppercase tracking-tighter">
              Tìm Buddy ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Footer đơn giản */}
      <footer className="py-10 text-center text-gray-400 text-sm border-t">
        <p>© 2024 ViVuLocal - Trải nghiệm du lịch bản sắc Việt</p>
      </footer>
    </div>
  );
};

export default Home;