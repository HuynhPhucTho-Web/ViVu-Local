
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, DollarSign, ArrowLeft, Calendar, User, Send, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, updateDoc, arrayUnion, getDocs } from 'firebase/firestore';
import { db } from '../components/firebase';

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('Anonymous User');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const docRef = doc(db, "discovery_posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setReview({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Không tìm thấy bài viết");
        }
      } catch (err) {
        console.error("Error fetching review:", err);
        setError("Lỗi khi tải bài viết");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const commentsRef = collection(db, "discovery_posts", id, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    }, (error) => {
      console.error("Error fetching comments:", error);
    });

    return () => unsubscribe();
  }, [id]);

  const handleRating = async (rating) => {
    if (submittingRating) return;

    setSubmittingRating(true);
    try {
      const reviewRef = doc(db, "discovery_posts", id);
      const ratingData = {
        rating,
        userId: "anonymous", // In a real app, this would be the authenticated user ID
        createdAt: new Date()
      };

      await updateDoc(reviewRef, {
        ratings: arrayUnion(ratingData)
      });

      setUserRating(rating);
      // Update local review state to reflect the new rating
      setReview(prev => ({
        ...prev,
        ratings: [...(prev.ratings || []), ratingData]
      }));
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (submittingComment || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const commentsRef = collection(db, "discovery_posts", id, "comments");
      const commentData = {
        author: commentAuthor.trim() || "Anonymous",
        content: newComment.trim(),
        createdAt: new Date()
      };

      await addDoc(commentsRef, commentData);
      setNewComment('');
      setCommentAuthor('Anonymous User');
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-500 font-bold">Đang tải bài viết...</p>
      </div>
    );
  }

  if (error || !review) {
    return <div className="text-center py-20">{error || "Không tìm thấy bài viết"}</div>;
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
              {review.rating && (
                <div className="flex items-center text-yellow-400">
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <span className="font-bold">{review.rating}</span>
                </div>
              )}
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

      <div className="max-w-4xl mx-auto px-4 -mt-5 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Chi tiết trải nghiệm</h2>
              <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                {review.fullContent || review.content}
              </div>

              {review.tags && review.tags.length > 0 && (
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
              )}
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

        {/* Rating Section */}
        <div className="bg-white rounded-xl shadow-xl p-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Đánh giá bài viết</h3>
            <div className="flex items-center text-yellow-500">
              <Star className="h-5 w-5 fill-current mr-1" />
              <span className="font-bold text-lg">
                {review.ratings && review.ratings.length > 0
                  ? (review.ratings.reduce((sum, r) => sum + r.rating, 0) / review.ratings.length).toFixed(1)
                  : 'Chưa có đánh giá'
                }
              </span>
              <span className="text-gray-500 ml-2">
                ({review.ratings ? review.ratings.length : 0} đánh giá)
              </span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-gray-600 mb-4">Bạn đánh giá bài viết này như thế nào?</p>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={submittingRating}
                  className="focus:outline-none disabled:opacity-50"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || userRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-4 text-gray-600">
                {hoverRating > 0 ? `${hoverRating} sao` : userRating > 0 ? `${userRating} sao` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-xl p-8 mt-8">
          <div className="flex items-center mb-6">
            <MessageCircle className="h-6 w-6 text-gray-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Bình luận</h3>
            <span className="ml-2 text-gray-500">({comments.length})</span>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="Tên của bạn"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex gap-4 mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                rows="3"
                required
              />
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                {submittingComment ? 'Đang gửi...' : 'Gửi'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">
                          {comment.createdAt?.toDate
                            ? comment.createdAt.toDate().toLocaleDateString('vi-VN')
                            : 'Vừa xong'
                          }
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
