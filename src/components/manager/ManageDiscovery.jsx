import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../components/firebase';
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import {
  Plus, Edit3, Trash2, Eye, Star, MapPin, Search,
  FileText, Image as ImageIcon, Tag, DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageDiscovery = () => {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Check if user is manager
  if (!user || user.role !== 'manager') {
    return <div className="p-20 text-center font-bold">Bạn không có quyền truy cập trang này.</div>;
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log("Fetching reviews for user:", user);
        console.log("User UID:", user?.uid);
        const q = query(collection(db, "discovery_posts"), where("authorId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        console.log("Query snapshot:", querySnapshot);
        const reviewsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched reviews:", reviewsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchReviews();
    }
  }, [user]);

  const filteredReviews = reviews.filter(r => {
    const matchesFilter = activeFilter === 'all' || r.category === activeFilter;
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      try {
        await deleteDoc(doc(db, "discovery_posts", id));
        setReviews(reviews.filter(r => r.id !== id));
        alert('Bài viết đã được xóa thành công!');
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">Đang tải danh sách bài viết...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-500 text-white rounded-[20px] shadow-lg shadow-orange-200">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Quản lý nội dung khám phá</h1>
              <p className="text-slate-400 text-sm font-medium">Quản lý các bài viết review & chia sẻ</p>
            </div>
          </div>

          <Link
            to="/manager/add-discovery"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-200"
          >
            <Plus size={18} /> Thêm bài viết mới
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center flex-1 bg-gray-50 rounded-2xl px-4 py-3">
              <Search className="text-gray-400 h-5 w-5 mr-3" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="bg-transparent outline-none w-full text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'food', label: 'Ẩm thực' },
                { id: 'stay', label: 'Lưu trú' },
                { id: 'culture', label: 'Văn hóa' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
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
        </div>

        {/* Content Grid */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] shadow-sm border border-slate-100">
            <FileText size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">Không tìm thấy bài viết nào.</p>
            <Link
              to="/manager/add-discovery"
              className="inline-flex items-center gap-2 mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold transition-all"
            >
              <Plus size={18} /> Tạo bài viết đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map(review => (
              <div key={review.id} className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">

                {/* Image */}
                <div className="h-48 overflow-hidden relative">
                  <img src={review.image} alt={review.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                      review.category === 'food' ? 'bg-red-100 text-red-600' :
                      review.category === 'stay' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {review.category === 'food' ? 'Ẩm thực' :
                       review.category === 'stay' ? 'Lưu trú' : 'Văn hóa'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-black text-slate-800 mb-2 line-clamp-2">{review.title}</h3>

                  <div className="flex items-center text-slate-500 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {review.location}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {review.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {review.tags.length > 2 && (
                      <span className="text-xs font-medium text-slate-400">+{review.tags.length - 2}</span>
                    )}
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {review.content}
                  </p>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mr-2">
                        {review.author.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-600">{review.author}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Chi phí</p>
                      <p className="text-orange-600 font-bold">{review.cost}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                    <Link
                      to={`/review/${review.id}`}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <Eye size={14} /> Xem
                    </Link>
                    <Link
                      to={`/manager/edit-discovery/${review.id}`}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <Edit3 size={14} /> Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDiscovery;
