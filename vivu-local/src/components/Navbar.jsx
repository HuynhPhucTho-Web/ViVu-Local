import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  MapPin,
  Search,
  User,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const userMenuRef = useRef(null);

  /* ===== Đóng user menu khi click ra ngoài ===== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Khám Phá', path: '/discovery' },
    { name: 'Cộng Đồng', path: '/social' },
    { name: 'Local Buddy', path: '/buddy' },
    { name: 'Lập Kế Hoạch', path: '/planner' },
    { name: 'Đã lưu', path: '/saved-plans' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    navigate(`/discovery?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
    setIsOpen(false);
    setShowUserMenu(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-800">ViVuLocal</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="pl-8 pr-4 py-1 rounded-full border text-sm focus:border-orange-500 w-40 focus:w-60 transition-all"
              />
              <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
            </form>

            {/* Nav links */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(item.path)
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* User */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu((s) => !s)}
                  className="flex items-center gap-2"
                >
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border z-50">
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="menu-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}

                    {user.role === 'buddy' && (
                      <Link
                        to="/buddy-dashboard"
                        className="menu-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Buddy Dashboard
                      </Link>
                    )}

                    {user.role === 'user' && (
                      <Link
                        to="/register-buddy"
                        className="menu-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Đăng ký làm Buddy
                      </Link>
                    )}

                    <button onClick={handleLogout} className="menu-item w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600"
              >
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="block py-2"
            >
              {item.name}
            </Link>
          ))}

          {!user && (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-orange-500 text-white py-2 rounded"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
