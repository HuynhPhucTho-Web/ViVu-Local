import { useState, useEffect } from 'react';
import { Search, Star, MapPin } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../components/firebase';

const Discovery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Khám phá & Review</h1>
          <p className="text-gray-600">Những chia sẻ chân thực nhất từ cộng đồng ViVuLocal</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
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
