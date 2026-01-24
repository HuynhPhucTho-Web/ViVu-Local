import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import { posts as mockPosts } from '../data/mockData';

const Social = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = "Bạn"; // Mock current user

  // Load posts from localStorage or mockData
  useEffect(() => {
    const savedPosts = localStorage.getItem('vivulocal_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(mockPosts);
      localStorage.setItem('vivulocal_posts', JSON.stringify(mockPosts));
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('vivulocal_posts', JSON.stringify(posts));
    }
  }, [posts]);

  const handleCreatePost = (postData) => {
    const newPost = {
      id: Date.now(),
      ...postData,
      author: currentUser,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString()
    };
    setPosts([newPost, ...posts]);
  };

  const handleUpdatePost = (postData) => {
    if (!editingPost) return;
    const updatedPosts = posts.map(p =>
      p.id === editingPost.id ? { ...p, ...postData } : p
    );
    setPosts(updatedPosts);
    setEditingPost(null);
  };

  const handleDeletePost = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleLike = (id) => {
    // In a real app, this would call an API.
    // Here we just update local state, but since PostCard handles visual toggle,
    // we update the count for persistence.
    const updatedPosts = posts.map(p => {
      if (p.id === id) {
        // Toggle logic is complex without real backend user tracking
        // For demo, we just increment
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    });
    setPosts(updatedPosts);
  };

  const handleComment = (id, text) => {
    const updatedPosts = posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          comments: [...p.comments, { id: Date.now(), user: currentUser, text }]
        };
      }
      return p;
    });
    setPosts(updatedPosts);
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cộng đồng ViVu</h1>
            <p className="text-gray-600">Chia sẻ khoảnh khắc - Kết nối đam mê</p>
          </div>
          <button 
            onClick={() => { setEditingPost(null); setIsModalOpen(true); }}
            className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold hover:bg-orange-600 transition flex items-center shadow-lg"
          >
            <Plus className="h-5 w-5 mr-1" /> Đăng bài
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-2 rounded-xl shadow-sm mb-6 flex items-center border border-gray-100">
          <Search className="h-5 w-5 text-gray-400 ml-2" />
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết, địa điểm..." 
            className="w-full px-4 py-2 outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có bài viết nào phù hợp.</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onLike={handleLike}
                onComment={handleComment}
                onEdit={(post) => { setEditingPost(post); setIsModalOpen(true); }}
                onDelete={handleDeletePost}
              />
            ))
          )}
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingPost(null); }}
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        initialData={editingPost}
      />
    </div>
  );
};

export default Social;
