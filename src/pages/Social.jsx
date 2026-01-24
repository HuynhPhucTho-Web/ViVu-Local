import { useState, useEffect } from 'react';
import { 
  collection, query, orderBy, onSnapshot, 
  addDoc, updateDoc, deleteDoc, doc 
} from 'firebase/firestore';
import { db } from '../components/firebase';
import { useAuthStore } from '../store/authStore';
import { Plus, Search, Loader2 } from 'lucide-react';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';

const Social = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    
    // Lắng nghe dữ liệu real-time
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreatePost = async (postData) => {
    if (!user) return alert("Bạn cần đăng nhập!");
    await addDoc(collection(db, 'posts'), {
      ...postData,
      author: user.name,
      authorId: user.uid,
      authorAvatar: user.photoURL || '',
      likes: [], // Mảng chứa UID những người đã like
      comments: [],
      timestamp: new Date().toISOString()
    });
  };

  const handleUpdatePost = async (postData) => {
    const postRef = doc(db, 'posts', editingPost.id);
    await updateDoc(postRef, postData);
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Xóa bài viết này?')) {
      await deleteDoc(doc(db, 'posts', id));
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Cộng đồng ViVu</h1>
            <p className="text-gray-500">Kết nối đam mê xê dịch</p>
          </div>
          <button 
            onClick={() => { setEditingPost(null); setIsModalOpen(true); }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full font-bold transition flex items-center shadow-lg active:scale-95"
          >
            <Plus className="h-5 w-5 mr-1" /> Đăng bài
          </button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết, địa danh..." 
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={40} /></div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                onEdit={(p) => { setEditingPost(p); setIsModalOpen(true); }}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        initialData={editingPost}
      />
    </div>
  );
};

export default Social;