import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

// Components & Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ChatbotBubble from './components/ChatbotBubble';

// Pages
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import LocalBuddy from './pages/LocalBuddy';
import TripPlanner from './pages/TripPlanner';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Social from './pages/Social';
import Chat from './pages/Chat';
import ReviewDetail from './pages/ReviewDetail';
import BuddyDetail from './pages/BuddyDetail';
import DestinationDetail from './pages/DestinationDetail';
import SavedPlans from './pages/SavedPlans';
import RegisterPartner from './pages/RegisterPartner';
import RegisterBuddy from './pages/RegisterBuddy';
import AdminDashboard from './pages/AdminDashboard';
import BuddyDashboard from './pages/BuddyDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import CreateDestination from './pages/CreateDestination';
import EditDestination from './pages/EditDestination';
import ManageDiscovery from './components/manager/ManageDiscovery';
import AddDiscovery from './pages/AddDiscovery';
import EditDiscovery from './pages/EditDiscovery';
import BookingPage from './components/BookingPage';
import ChatPage from './components/ChatPage';

// Tách phần nội dung ra để có thể sử dụng được các Hook của React Router
function AppContent() {
  const { user, listenToUser, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Lắng nghe dữ liệu Real-time khi user đăng nhập
  useEffect(() => {
    let unsub;
    if (user?.uid) {
      unsub = listenToUser();
    }
    return () => unsub && unsub();
  }, [user?.uid, listenToUser]);

  // 2. Logic tự động điều hướng khi Admin duyệt hồ sơ
  useEffect(() => {
    if (!user) return;

    if (user.role === 'manager' && location.pathname === '/register-partner') {
      alert("🎉 Hồ sơ đã được duyệt! Chào mừng đối tác.");
      navigate('/partner/dashboard', { replace: true });
    }
    if (user.role === 'buddy' && location.pathname === '/register-buddy') {
      alert("🎉 Chúc mừng! Bạn đã trở thành Local Buddy.");
      navigate('/buddy-dashboard', { replace: true });
    }
  }, [user?.role, location.pathname, navigate]);

  // Hiển thị loading khi đang đồng bộ (tránh bị ProtectedRoute đá ra nhầm)
  if (loading && user?.uid) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500"></div>
        <span className="ml-3 font-medium">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900 relative">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/social" element={<Social />} />
          <Route path="/buddy" element={<LocalBuddy />} />
          <Route path="/planner" element={<TripPlanner />} />
          <Route path="/review/:id" element={<ReviewDetail />} />
          <Route path="/buddy/:id" element={<BuddyDetail />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/destination/:id" element={<DestinationDetail />} />
          <Route path="/saved-plans" element={<SavedPlans />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register-partner" element={<RegisterPartner />} />
          <Route path="/register-buddy" element={<RegisterBuddy />} />
          <Route path="/booking/:buddyId" element={<BookingPage />} />
          <Route path="/chat/:buddyId" element={<ChatPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Buddy Routes */}
          <Route
            path="/buddy-dashboard"
            element={
              <ProtectedRoute allowedRoles={['buddy']}>
                <BuddyDashboard />
              </ProtectedRoute>
            }
          />

          {/* Manager/Partner Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/create"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <CreateDestination />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/edit"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <EditDestination />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/manage-discovery"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManageDiscovery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/add-discovery"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <AddDiscovery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/edit-discovery/:id"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <EditDiscovery />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ChatbotBubble />
    </div>
  );
}

// Component chính export ra ngoài
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}