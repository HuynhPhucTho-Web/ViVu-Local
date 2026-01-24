import { useState, useRef } from 'react';
import { Heart, MessageCircle, MapPin, MoreVertical, Edit2, Trash2, Send, ThumbsUp } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../components/firebase';

const REACTIONS = [
  { label: 'Thích', icon: '👍', color: 'text-blue-500', value: 'like' },
  { label: 'Yêu', icon: '❤️', color: 'text-red-500', value: 'love' },
  { label: 'Haha', icon: '😆', color: 'text-yellow-500', value: 'haha' },
  { label: 'Wow', icon: '😮', color: 'text-orange-500', value: 'wow' }
];

// Component con để hiển thị Comment đệ quy
const CommentItem = ({ comment, onReply, onLikeComment, depth = 0, currentUser }) => {
  const [showReactions, setShowReactions] = useState(false);
  const reactionTimeout = useRef(null);

  const userReaction = comment.reactions?.find(r => r.userId === currentUser?.uid);

  // Xử lý hiện/ẩn reaction mượt mà
  const handleMouseEnter = () => {
    if (reactionTimeout.current) clearTimeout(reactionTimeout.current);
    setShowReactions(true);
  };

  const handleMouseLeave = () => {
    reactionTimeout.current = setTimeout(() => {
      setShowReactions(false);
    }, 500);
  };

  const handleReact = (type) => {
    onLikeComment(comment.id, type);
    setShowReactions(false);
  };

  return (
    <div className={`mt-3 ${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex gap-2 group/item">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold uppercase">
          {comment.user.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="bg-white px-3 py-2 rounded-2xl shadow-sm inline-block max-w-[95%] border border-gray-100">
            <p className="text-[11px] font-bold text-gray-800">{comment.user}</p>
            <p className="text-sm text-gray-600">{comment.text}</p>
          </div>
          <div className="flex gap-4 ml-2 mt-1 text-[10px] font-bold text-gray-400 relative">
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`flex items-center gap-1 px-2 py-1 rounded-full font-bold text-xs transition ${userReaction ? REACTIONS.find(r => r.value === userReaction.type).color : 'text-gray-500 hover:bg-gray-100'}`}>
                {userReaction ? REACTIONS.find(r => r.value === userReaction.type).icon : <ThumbsUp size={14} />}
                {userReaction ? REACTIONS.find(r => r.value === userReaction.type).label : 'Thích'}
              </button>

              {showReactions && (
                <div
                  className="absolute bottom-full left-0 mb-1 bg-white shadow-lg border rounded-full px-1 py-1 flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50"
                  onMouseEnter={handleMouseEnter}
                >
                  {REACTIONS.map(r => (
                    <button key={r.value} onClick={() => handleReact(r.value)} className="hover:scale-125 transition-transform text-lg p-1">
                      {r.icon}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => onReply(comment)} className="hover:text-orange-500 transition-colors">Phản hồi</button>
          </div>

          {/* Đệ quy: Tự gọi lại chính nó nếu có replies */}
          {comment.replies?.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLikeComment={onLikeComment}
              currentUser={currentUser}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PostCard = ({ post, currentUser, onEdit, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null); 
  const [showReactions, setShowReactions] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const reactionTimeout = useRef(null);

  const userReaction = post.reactions?.find(r => r.userId === currentUser?.uid);

  // Xử lý hiện/ẩn reaction mượt mà
  const handleMouseEnter = () => {
    if (reactionTimeout.current) clearTimeout(reactionTimeout.current);
    setShowReactions(true);
  };

  const handleMouseLeave = () => {
    reactionTimeout.current = setTimeout(() => {
      setShowReactions(false);
    }, 500); // Đợi 0.5s mới mất để người dùng kịp di chuột vào bảng chọn
  };

  const handleReact = async (type) => {
    if (!currentUser) return alert("Vui lòng đăng nhập!");
    const postRef = doc(db, 'posts', post.id);
    const otherReactions = (post.reactions || []).filter(r => r.userId !== currentUser.uid);
    await updateDoc(postRef, { reactions: [...otherReactions, { userId: currentUser.uid, type }] });
    setShowReactions(false);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const postRef = doc(db, 'posts', post.id);

    // Hàm đệ quy để tìm và chèn reply vào đúng cấp
    const addReplyRecursive = (comments) => {
      return comments.map(c => {
        if (c.id === replyTo.id) {
          return { ...c, replies: [...(c.replies || []), { id: Date.now(), user: currentUser.name, text: commentText, reactions: [], replies: [], createdAt: new Date().toISOString() }] };
        }
        if (c.replies?.length > 0) return { ...c, replies: addReplyRecursive(c.replies) };
        return c;
      });
    };

    const newComments = replyTo
      ? addReplyRecursive(post.comments)
      : [...(post.comments || []), { id: Date.now(), user: currentUser.name, text: commentText, reactions: [], replies: [], createdAt: new Date().toISOString() }];

    await updateDoc(postRef, { comments: newComments });
    setCommentText('');
    setReplyTo(null);
  };

  const handleCommentReact = async (commentId, type) => {
    if (!currentUser) return alert("Vui lòng đăng nhập!");
    const postRef = doc(db, 'posts', post.id);

    // Hàm đệ quy để cập nhật reaction cho comment
    const updateCommentReactionRecursive = (comments) => {
      return comments.map(c => {
        if (c.id === commentId) {
          const otherReactions = (c.reactions || []).filter(r => r.userId !== currentUser.uid);
          return { ...c, reactions: [...otherReactions, { userId: currentUser.uid, type }] };
        }
        if (c.replies?.length > 0) return { ...c, replies: updateCommentReactionRecursive(c.replies) };
        return c;
      });
    };

    const updatedComments = updateCommentReactionRecursive(post.comments);
    await updateDoc(postRef, { comments: updatedComments });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      {/* ... Header & Content giữ nguyên ... */}

      {/* Ảnh bài viết */}
      {post.image && (
        <div className="w-full bg-gray-50 border-y">
          <img src={post.image} alt="post" className="w-full max-h-[500px] object-contain mx-auto" />
        </div>
      )}

      {/* Actions */}
      <div className="p-2 flex gap-4 border-t relative">
        <div 
          className="relative" 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
        >
          <button className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition ${userReaction ? REACTIONS.find(r => r.value === userReaction.type).color : 'text-gray-500 hover:bg-gray-100'}`}>
            {userReaction ? REACTIONS.find(r => r.value === userReaction.type).icon : <ThumbsUp size={18} />}
            {userReaction ? REACTIONS.find(r => r.value === userReaction.type).label : 'Thích'}
          </button>

          {showReactions && (
            <div 
              className="absolute bottom-full left-0 mb-2 bg-white shadow-2xl border rounded-full px-2 py-1.5 flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50"
              onMouseEnter={handleMouseEnter} // Giữ lại khi di chuột vào bảng icon
            >
              {REACTIONS.map(r => (
                <button key={r.value} onClick={() => handleReact(r.value)} className="hover:scale-150 transition-transform text-2xl p-1">
                  {r.icon}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-500 font-bold text-sm transition">
          <MessageCircle size={18} />
          <span>{post.comments?.length || 0} Bình luận</span>
        </button>
      </div>

      {/* Comments Area */}
      {showComments && (
        <div className="bg-gray-50/80 p-4 border-t">
          <div className="space-y-2 mb-4 max-h-[500px] overflow-y-auto custom-scrollbar">
            {post.comments?.map((c) => (
              <CommentItem 
                key={c.id} 
                comment={c} 
                onReply={(parent) => { setReplyTo(parent); setCommentText(`@${parent.user} `); }}
                onLikeComment={(id) => console.log("Like comment id:", id)} // Bạn có thể viết thêm logic like comment tương tự like post
              />
            ))}
          </div>
          
          <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center bg-white p-1 rounded-full shadow-sm border">
            <input 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={replyTo ? `Phản hồi ${replyTo.user}...` : "Viết bình luận..."} 
              className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
            />
            <button className="p-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all active:scale-90">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;