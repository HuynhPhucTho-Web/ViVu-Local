import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, MapPin, MoreVertical, Edit2,
  Trash2, Send, ThumbsUp, CheckCircle, Share2, X, Upload
} from 'lucide-react';
import { doc, updateDoc, deleteDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../components/firebase';

const REACTIONS = [
  { label: 'Thích', icon: '👍', color: 'text-blue-500', value: 'like' },
  { label: 'Yêu', icon: '❤️', color: 'text-red-500', value: 'love' },
  { label: 'Haha', icon: '😆', color: 'text-yellow-500', value: 'haha' },
  { label: 'Wow', icon: '😮', color: 'text-orange-500', value: 'wow' }
];

const CommentItem = ({ comment, onReply, onLikeComment, depth = 0, currentUser }) => {
  const [showReactions, setShowReactions] = useState(false);
  const userReaction = comment.reactions?.find(r => r.userId === currentUser?.id);

  return (
    <div className={`mt-3 ${depth > 0 ? 'ml-8 border-l-2 border-orange-100 pl-4' : ''}`}>
      <div className="flex gap-2 group/item">
        <img src={comment.userAvatar || `https://ui-avatars.com/api/?name=${comment.user}`} className="h-8 w-8 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1">
          <div className="bg-gray-100 px-3 py-2 rounded-2xl inline-block max-w-[95%]">
            <p className="text-[11px] font-black text-gray-900">{comment.user}</p>
            <p className="text-sm text-gray-700">{comment.text}</p>
          </div>
          <div className="flex gap-4 ml-2 mt-1 text-[10px] font-bold text-gray-400 relative">
            <div className="relative" onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}>
              <button className={`hover:text-orange-500 ${userReaction ? 'text-orange-500' : ''}`}>
                {userReaction ? REACTIONS.find(r => r.value === userReaction.type).icon : 'Thích'}
              </button>
              {showReactions && (
                <div className="absolute bottom-full left-0 mb-1 bg-white shadow-xl border rounded-full px-1 py-1 flex gap-2 z-[60]">
                  {REACTIONS.map(r => (
                    <button key={r.value} onClick={() => { onLikeComment(comment.id, r.value); setShowReactions(false); }} className="hover:scale-125 transition-transform text-sm">{r.icon}</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => onReply(comment)} className="hover:text-orange-500">Phản hồi</button>
          </div>
          {comment.replies?.map(reply => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} onLikeComment={onLikeComment} currentUser={currentUser} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PostCard = ({ post, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editTitle, setEditTitle] = useState(post.title || '');
  const [editImages, setEditImages] = useState(post.images || (post.image ? [post.image] : []));

  const userReaction = post.reactions?.find(r => r.userId === currentUser?.id);

  // Auto-close options after 5 seconds
  useEffect(() => {
    if (showOptions) {
      const timer = setTimeout(() => {
        setShowOptions(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showOptions]);

  // Function to count all comments including replies recursively
  const countComments = (comments) => {
    return comments.reduce((total, comment) => {
      return total + 1 + countComments(comment.replies || []);
    }, 0);
  };

  // FIX LIKE POST: Cập nhật đúng mảng reaction
  const handleReact = async (type) => {
    if (!currentUser) return alert("Vui lòng đăng nhập!");
    const postRef = doc(db, 'posts', post.id);
    const otherReactions = (post.reactions || []).filter(r => r.userId !== currentUser.id);
    try {
      await updateDoc(postRef, { reactions: [...otherReactions, { userId: currentUser.id, type }] });
    } catch (e) {
      alert("Lỗi khi thích bài viết!");
      console.error(e);
    }
    setShowReactions(false);
  };

  // FIX LIKE COMMENT: Đệ quy tìm comment để update reaction
  const handleCommentReact = async (commentId, type) => {
    const postRef = doc(db, 'posts', post.id);
    const updateRecursive = (list) => list.map(c => {
      if (c.id === commentId) {
        const others = (c.reactions || []).filter(r => r.userId !== currentUser.id);
        return { ...c, reactions: [...others, { userId: currentUser.id, type }] };
      }
      return { ...c, replies: updateRecursive(c.replies || []) };
    });
    try {
      await updateDoc(postRef, { comments: updateRecursive(post.comments || []) });
    } catch (e) {
      alert("Lỗi khi thích bình luận!");
      console.error(e);
    }
  };

  const handleUpdatePost = async () => {
    await updateDoc(doc(db, 'posts', post.id), {
      title: editTitle,
      content: editContent,
      images: editImages
    });
    setIsEditing(false);
    setShowOptions(false);
  };

  const handleDeletePost = async () => {
    if (confirm("Xóa bài viết này?")) await deleteDoc(doc(db, 'posts', post.id));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const postRef = doc(db, 'posts', post.id);
    const newComment = {
      id: Date.now(),
      user: currentUser.displayName || currentUser.email.split('@')[0],
      userAvatar: currentUser.photoURL || '',
      text: commentText,
      reactions: [],
      replies: [],
      createdAt: new Date().toISOString()
    };
    const addReplyRecursive = (list) => list.map(c =>
      c.id === replyTo?.id ? { ...c, replies: [...(c.replies || []), newComment] } : { ...c, replies: addReplyRecursive(c.replies || []) }
    );
    const updated = replyTo ? addReplyRecursive(post.comments || []) : [...(post.comments || []), newComment];
    try {
      await updateDoc(postRef, { comments: updated });
      setCommentText('');
      setReplyTo(null);
    } catch (e) {
      alert("Lỗi khi gửi bình luận!");
      console.error(e);
    }
  };

  return (
    <div className="bg-white rounded-[24px] shadow-sm border mb-6 overflow-visible">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={post.authorAvatar || `https://ui-avatars.com/api/?name=${post.authorName}`} className="h-10 w-10 rounded-full border" />
          <div>
            <h4 className="font-black text-sm">{post.authorName}</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{post.location} • {new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        {currentUser?.id === post.authorId && (
          <div className="relative">
            <button onClick={() => setShowOptions(!showOptions)} className="p-2"><MoreVertical size={18}/></button>
            {showOptions && (
              <div className="absolute right-0 mt-2 bg-white border shadow-xl rounded-xl z-50 py-1 w-32 font-bold text-sm">
                <button onClick={() => setIsEditing(true)} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"><Edit2 size={14}/> Sửa</button>
                <button onClick={handleDeletePost} className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"><Trash2 size={14}/> Xóa</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-3">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tiêu đề</label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 border rounded-xl text-sm outline-none focus:border-orange-500"
                placeholder="Tiêu đề bài viết..."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nội dung</label>
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-2 border rounded-xl text-sm outline-none focus:border-orange-500" rows="3" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Hình ảnh</label>
              {editImages && editImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {editImages.map((imageUrl, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden border border-gray-100 shadow-inner group bg-gray-100">
                      <img src={imageUrl} className="w-full h-16 object-cover" alt={`edit-${index}`} />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setEditImages(prev => prev.filter((_, i) => i !== index))}
                          className="bg-red-500 text-white p-1 rounded-full hover:scale-110 transition-transform shadow-lg"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <label className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer group">
                <Upload size={20} className="text-gray-400 group-hover:text-orange-500 mb-1" />
                <span className="text-xs text-gray-500">Thêm ảnh</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if (files.length === 0) return;

                    try {
                      const uploadPromises = files.map(file => uploadToCloudinary(file));
                      const results = await Promise.all(uploadPromises);
                      const newImageUrls = results.map(result => result.secure_url);
                      setEditImages(prev => [...(prev || []), ...newImageUrls]);
                    } catch (err) {
                      alert("Lỗi tải ảnh!");
                    }
                  }}
                />
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setIsEditing(false)} className="text-xs font-bold px-3 py-1">Hủy</button>
              <button onClick={handleUpdatePost} className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-lg">Lưu</button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {post.title && (
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{post.title}</h3>
            )}
            <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p>
          </div>
        )}
      </div>

      {(post.images && post.images.length > 0) && (
        <div className="border-y">
          {post.images.length === 1 ? (
            <img src={post.images[0]} className="w-full max-h-96 object-cover" />
          ) : (
            <div className="grid grid-cols-2 gap-1 p-1">
              {post.images.slice(0, 4).map((imageUrl, index) => (
                <img key={index} src={imageUrl} className="w-full h-32 object-cover rounded-lg" />
              ))}
              {post.images.length > 4 && (
                <div className="relative">
                  <img src={post.images[4]} className="w-full h-32 object-cover rounded-lg" />
                  {post.images.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">+{post.images.length - 5}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {post.image && !post.images && <img src={post.image} className="w-full border-y max-h-96 object-cover" />}

      <div className="p-2 flex gap-4 relative border-t">
        <div className="relative" onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}>
          <button className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm transition ${userReaction ? REACTIONS.find(r => r.value === userReaction.type).color : 'text-gray-500'}`}>
            {userReaction ? REACTIONS.find(r => r.value === userReaction.type).icon : <ThumbsUp size={18} />}
            {userReaction ? REACTIONS.find(r => r.value === userReaction.type).label : 'Thích'}
          </button>
          {showReactions && (
            <div className="absolute bottom-full left-0 mb-2 bg-white shadow-2xl border rounded-full px-2 py-1.5 flex gap-3 animate-in fade-in slide-in-from-bottom-2 z-50">
              {REACTIONS.map(r => (
                <button key={r.value} onClick={() => handleReact(r.value)} className="hover:scale-150 transition-transform text-2xl">{r.icon}</button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-gray-500 font-black text-sm"><MessageCircle size={18}/> {countComments(post.comments || [])}</button>
      </div>

      {showComments && (
        <div className="bg-gray-50/50 p-4 border-t">
          {post.comments?.map(c => (
            <CommentItem key={c.id} comment={c} currentUser={currentUser} onReply={(p) => {setReplyTo(p); setCommentText(`@${p.user} `);}} onLikeComment={handleCommentReact} />
          ))}
          <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-2 items-center bg-white p-1 rounded-full border">
            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Viết bình luận..." className="flex-1 px-4 py-1.5 text-sm outline-none" />
            <button className="bg-orange-500 text-white p-2 rounded-full shadow-lg"><Send size={14} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;