import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import LocalBuddy from './pages/LocalBuddy';
import TripPlanner from './pages/TripPlanner';
import Login from './pages/Login';
import ReviewDetail from './pages/ReviewDetail';
import BuddyDetail from './pages/BuddyDetail';
import SavedPlans from './pages/SavedPlans';
import DestinationDetail from './pages/DestinationDetail';
import Social from './pages/Social';
import Chat from './pages/Chat';
import AdminDashboard from './pages/AdminDashboard.tsx';
import BuddyDashboard from './pages/BuddyDashboard';
import RegisterBuddy from './pages/RegisterBuddy';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans text-gray-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/social" element={<Social />} />
            <Route path="/buddy" element={<LocalBuddy />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/login" element={<Login />} />
            <Route path="/review/:id" element={<ReviewDetail />} />
            <Route path="/buddy/:id" element={<BuddyDetail />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/destination/:id" element={<DestinationDetail />} />
            <Route path="/saved-plans" element={<SavedPlans />} />
            
            {/* New Routes for Role-based Auth */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/buddy-dashboard" element={<BuddyDashboard />} />
            <Route path="/register-buddy" element={<RegisterBuddy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
