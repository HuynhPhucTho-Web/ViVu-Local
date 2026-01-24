
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, DollarSign, ArrowLeft, Calendar, User } from 'lucide-react';
import { reviews } from '../data/mockData';

const ReviewDetail = () => {
  const { id } = useParams();
  const review = reviews.find(r => r.id === Number(id));

  if (!review) {
    return <div className="text-center py-20">Không tìm thấy bài viết</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Image */}
      <div className="h-[400px] relative">
        <img src={review.image} alt={review.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-6 left-6">
          <Link to="/discovery" className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center hover:bg-white/30 transition">
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-2">
              <span className="bg-orange-500 text-xs font-bold px-2 py-1 rounded mr-3 uppercase">{review.category}</span>
              <div className="flex items-center text-yellow-400">
                <Star className="h-4 w-4 fill-current mr-1" />
                <span className="font-bold">{review.rating}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{review.title}</h1>
            <div className="flex items-center text-gray-200 text-sm">
              <MapPin className="h-4 w-4 mr-1" /> {review.location}
              <span className="mx-3">•</span>
              <User className="h-4 w-4 mr-1" /> {review.author}
              <span className="mx-3">•</span>
              <Calendar className="h-4 w-4 mr-1" /> 2 ngày trước
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Chi tiết trải nghiệm</h2>
              <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                {review.fullContent}
              </div>
              
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-bold text-lg mb-4">Tags</h3>
                <div className="flex gap-2">
                  {review.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:w-1/3">
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 sticky top-24">
                <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-orange-500" />
                  Tổng chi phí
                </h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">{review.cost}</div>
                <p className="text-sm text-gray-500 mb-6">Đã bao gồm ăn uống và vé tham quan cơ bản.</p>
                
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition mb-3">
                  Lưu bài viết
                </button>
                <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition">
                  Chia sẻ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
