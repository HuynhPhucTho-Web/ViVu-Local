import { useState } from 'react';
import { MapPin, ArrowRight, Star, DollarSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { destinations } from '../data/mockData'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/discovery?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="relative h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80"
          alt="Vietnam Landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            ViVuLocal – Chạm vào bản sắc
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Đi như người bản địa, trải nghiệm như người bản xứ
          </p>
          
          {/* Smart Search */}
          <div className="bg-white p-2 rounded-full shadow-2xl flex flex-col md:flex-row items-center max-w-3xl mx-auto">
            <div className="flex-1 flex items-center px-6 py-3 w-full border-b md:border-b-0 md:border-r border-gray-200">
              <MapPin className="text-gray-400 mr-3 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Bạn muốn đi đâu?" 
                className="w-full outline-none text-gray-800 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex-1 flex items-center px-6 py-3 w-full border-b md:border-b-0 md:border-r border-gray-200">
              <DollarSign className="text-gray-400 mr-3 h-5 w-5" />
              <select className="w-full outline-none text-gray-800 bg-transparent cursor-pointer">
                <option value="">Ngân sách</option>
                <option value="low">Tiết kiệm</option>
                <option value="medium">Trung bình</option>
                <option value="high">Sang trọng</option>
              </select>
            </div>
            <button 
              onClick={handleSearch}
              className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all m-1 w-full md:w-auto shadow-md"
            >
              Khám phá
            </button>
          </div>
        </div>
      </header>

      {/* Section 1: Featured Destinations */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Điểm đến tiêu biểu</h2>
            <p className="text-gray-600">Những vùng đất đang được cộng đồng yêu thích nhất</p>
          </div>
          <Link to="/discovery" className="text-orange-500 font-semibold flex items-center hover:underline">
            Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((place) => (
            <Link key={place.id} to={`/destination/${place.id}`} className="group relative rounded-2xl overflow-hidden shadow-lg h-80 cursor-pointer block">
              <img src={place.img} alt={place.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{place.name}</h3>
                <p className="text-gray-200 text-sm">{place.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 2: Local Buddy Teaser */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80" alt="Local Buddy" className="rounded-2xl shadow-2xl w-full object-cover h-[500px]" />
          </div>
          <div className="md:w-1/2">
            <span className="text-orange-500 font-bold tracking-wider uppercase text-sm">Local Buddy</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">Tìm người dẫn đường am hiểu địa phương</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Thay vì những tour đoàn cứng nhắc, hãy đặt các "Local Buddy" – những người bạn địa phương am hiểu từng ngóc ngách, quán ăn ngon và câu chuyện lịch sử thú vị.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                  <Star className="h-6 w-6 text-yellow-400 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Đánh giá thực tế</h4>
                  <p className="text-sm text-gray-500">Chỉ khách đã đi mới được review</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Chi phí minh bạch</h4>
                  <p className="text-sm text-gray-500">Giá niêm yết theo giờ hoặc theo ngày</p>
                </div>
              </div>
            </div>
            
            <Link to="/buddy" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">
              Tìm Buddy ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Discovery Teaser */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Review "Chất" từ cộng đồng</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá những địa điểm ăn uống, vui chơi được đánh giá chân thực nhất với thông tin chi phí cụ thể.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link to="/review/1" className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition block">
            <div className="h-48 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1626015094736-249ac895f6fd?auto=format&fit=crop&w=800&q=80" alt="Banh Mi" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">#Ngon_Bổ_Rẻ</span>
                <span className="flex items-center text-yellow-500 text-sm font-bold">
                  <Star className="h-4 w-4 fill-current mr-1" /> 4.8
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Bánh mì Phượng - Hội An</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                Vị nước sốt đậm đà, pate béo ngậy. Xếp hàng hơi lâu nhưng rất đáng công chờ đợi.
              </p>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-gray-500 text-sm">Tổng chi phí:</span>
                <span className="text-orange-600 font-bold">35.000đ</span>
              </div>
            </div>
          </Link>
          
          {/* More mock cards would go here */}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/discovery" className="text-orange-500 font-bold hover:underline">
            Xem thêm hàng ngàn review khác
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
