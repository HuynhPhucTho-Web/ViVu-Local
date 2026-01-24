import { useState } from 'react';
import {
  Heart,
  MessageCircle,
  MapPin,
  MoreVertical,
  Edit2,
  Trash2,
  Send
} from 'lucide-react';

const PostCard = ({
  post,
  onLike,
  onComment,
  onEdit,
  onDelete,
  currentUser
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.id);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">

      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold mr-3">
            {post.author?.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{post.author}</h3>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {post.location} •{' '}
              {new Date(post.timestamp).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        {post.author === currentUser && (
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                <button
                  onClick={() => {
                    setShowOptions(false);
                    onEdit(post);
                  }}
                  className="w-full px-4 py-2 text-sm hover:bg-gray-50 flex items-center"
                >
                  <Edit2 className="h-4 w-4 mr-2" /> Chỉnh sửa
                </button>
                <button
                  onClick={() => {
                    setShowOptions(false);
                    onDelete(post.id);
                  }}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Xóa bài viết
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <h4 className="font-bold text-lg mb-2">{post.title}</h4>
        <p className="text-gray-600 whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="w-full h-64 bg-gray-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t flex justify-between">
        <div className="flex space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes + (isLiked ? 1 : 0)}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
          >
            <MessageCircle className="h-6 w-6" />
            <span>{post.comments?.length || 0}</span>
          </button>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="bg-gray-50 px-4 py-4 border-t">
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
            {post.comments?.length === 0 ? (
              <p className="text-center text-gray-400 text-sm">
                Chưa có bình luận nào
              </p>
            ) : (
              post.comments.map((c) => (
                <div key={c.id} className="flex space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                    {c.user.charAt(0)}
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm flex-1">
                    <p className="text-xs font-bold">{c.user}</p>
                    <p className="text-sm">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmitComment} className="flex space-x-2">
            <input
              className="flex-1 border rounded-full px-4 py-2 text-sm"
              placeholder="Viết bình luận..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              disabled={!commentText.trim()}
              className="p-2 bg-orange-500 text-white rounded-full disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
