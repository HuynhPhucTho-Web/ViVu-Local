import { useState, useEffect } from 'react';
import { Search, Star, MapPin, Filter } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../components/firebase';

const Discovery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [foodFilter, setFoodFilter] = useState('all');
  const [drinkFilter, setDrinkFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, "discovery_posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const reviewsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Post ID:", doc.id, "Author ID:", data.authorId, "Author:", data.author);
          return {
            id: doc.id,
            ...data
          };
        });
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(r => {
    const matchesFilter = activeFilter === 'all' || r.category === activeFilter;
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFood = foodFilter === 'all' || r.foodType === foodFilter;
    const matchesDrink = drinkFilter === 'all' || r.drinkType === drinkFilter;
    const matchesInterest = interestFilter === 'all' || r.interests?.includes(interestFilter);
    const matchesLocation = locationFilter === 'all' || r.location.toLowerCase().includes(locationFilter);

    let matchesPrice = true;
    if (priceFilter !== 'all') {
      const cost = parseCost(r.cost);
      if (priceFilter === 'low') matchesPrice = cost < 500000;
      else if (priceFilter === 'medium') matchesPrice = cost >= 500000 && cost <= 2000000;
      else if (priceFilter === 'high') matchesPrice = cost > 2000000;
    }

    return matchesFilter && matchesSearch && matchesFood && matchesDrink && matchesInterest && matchesLocation && matchesPrice;
  });

  const parseCost = (costString) => {
    if (!costString || costString === 'Chưa cập nhật') return 0;
    const cleaned = costString.replace(/[^\d.,]/g, '').replace(',', '.');
    const match = cleaned.match(/(\d+(?:\.\d+)?)(k|m)?/i);
    if (!match) return 0;
    let value = parseFloat(match[1]);
    if (match[2]?.toLowerCase() === 'k') value *= 1000;
    else if (match[2]?.toLowerCase() === 'm') value *= 1000000;
    return value;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Khám phá & Review</h1>
          <p className="text-gray-600">Những chia sẻ chân thực nhất từ cộng đồng ViVuLocal</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center w-full md:w-auto bg-gray-100 rounded-lg px-4 py-2">
              <Search className="text-gray-400 h-5 w-5 mr-2" />
              <input
                type="text"
                placeholder="Tìm địa điểm, món ăn..."
                className="bg-transparent outline-none w-full text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'food', label: 'Ẩm thực' },
                { id: 'stay', label: 'Lưu trú' },
                { id: 'culture', label: 'Văn hóa' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <Filter className="text-gray-400 h-5 w-5" />
            <select
              value={foodFilter}
              onChange={(e) => setFoodFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Món ăn: Tất cả</option>
              <optgroup label="🍜 Nhóm món chính">
                <option value="mon-com">Món cơm</option>
                <option value="mon-bun">Món bún</option>
                <option value="mon-pho">Món phở</option>
                <option value="mon-mi-mien">Món mì – miến</option>
                <option value="mon-chao">Món cháo</option>
                <option value="mon-lau">Món lẩu</option>
                <option value="mon-nuong">Món nướng</option>
                <option value="mon-chien">Món chiên</option>
                <option value="mon-xao">Món xào</option>
                <option value="mon-hap">Món hấp</option>
              </optgroup>
              <optgroup label="🥩 Nhóm theo nguyên liệu">
                <option value="mon-ga">Món gà</option>
                <option value="mon-bo">Món bò</option>
                <option value="mon-heo">Món heo</option>
                <option value="mon-hai-san">Món hải sản</option>
                <option value="mon-chay">Món chay</option>
              </optgroup>
              <optgroup label="🍲 Món ăn kèm & phụ">
                <option value="mon-an-vat">Món ăn vặt</option>
                <option value="mon-khai-vi">Món khai vị</option>
                <option value="mon-an-kem">Món ăn kèm (rau, dưa chua, trứng…)</option>
                <option value="canh-sup">Canh – súp</option>
              </optgroup>
              <optgroup label="🍰 Tráng miệng">
                <option value="banh-ngot">Bánh ngọt</option>
                <option value="che">Chè</option>
                <option value="kem">Kem</option>
                <option value="trai-cay">Trái cây</option>
              </optgroup>
              <optgroup label="🌏 Theo vùng / phong cách">
                <option value="mon-viet">Món Việt</option>
                <option value="mon-a">Món Á</option>
                <option value="mon-au">Món Âu</option>
                <option value="mon-han">Món Hàn</option>
                <option value="mon-nhat">Món Nhật</option>
                <option value="mon-thai">Món Thái</option>
                <option value="fast-food">Fast Food</option>
              </optgroup>
            </select>

            <select
              value={drinkFilter}
              onChange={(e) => setDrinkFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Đồ uống: Tất cả</option>
              <option value="nuoc-ngot">Nước ngọt</option>
              <option value="tra-tra-sua">Trà – trà sữa</option>
              <option value="ca-phe">Cà phê</option>
              <option value="sinh-to-nuoc-ep">Sinh tố – nước ép</option>
              <option value="bia-do-uong-co-con">Bia – đồ uống có cồn</option>
            </select>

            {/* <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Sở thích: Tất cả</option>
              <option value="adventure">Phiêu lưu</option>
              <option value="culture">Văn hóa</option>
              <option value="nature">Thiên nhiên</option>
              <option value="food">Ẩm thực</option>
              <option value="shopping">Mua sắm</option>
            </select> */}

            {/* <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Địa điểm: Tất cả</option>
              <option value="hanoi">Hà Nội</option>
              <option value="hochiminh">TP.HCM</option>
              <option value="danang">Đà Nẵng</option>
              <option value="nhatrang">Nha Trang</option>
              <option value="dalat">Đà Lạt</option>
            </select> */}

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Giá cả: Tất cả</option>
              <option value="low">Dưới 500k</option>
              <option value="medium">500k - 2M</option>
              <option value="high">Trên 2M</option>
            </select>
          </div>
        </div>

        {/* Review Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-500 font-bold animate-pulse">Đang tải bài viết...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Không tìm thấy kết quả nào phù hợp.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map(review => (
              <Link key={review.id} to={`/review/${review.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 block">
                <div className="h-48 overflow-hidden relative">
                  <img src={review.image} alt={review.title} className="w-full h-full object-cover" />
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {review.tags?.map((tag, idx) => (
                      <span key={idx} className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{review.title}</h3>

                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {review.location}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    "{review.content}"
                  </p>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mr-2">
                        {review.author?.charAt(0) || '?'}
                      </div>
                      <span className="text-sm text-gray-600">{review.author || 'Anonymous'}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Tổng chi phí</p>
                      <p className="text-orange-600 font-bold">{review.cost || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discovery;
