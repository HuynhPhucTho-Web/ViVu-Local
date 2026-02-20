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
  Settings,
  UserCheck,
  UserCircle,
  Heart,
  ChevronDown,
  Briefcase
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const userMenuRef = useRef(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Thêm useEffect này vào bên trong component Navbar, phía trên các hàm xử lý khác
  useEffect(() => {
    if (!user) return;

    // Kiểm tra nếu đang ở trang đăng ký mà role đã thay đổi (nghĩa là vừa được duyệt)
    if (user.role === 'manager' && location.pathname === '/register-partner') {
      alert("🎉 Chúc mừng! Hồ sơ đối tác của bạn đã được duyệt.");
      navigate('/manager/dashboard');
    }
    else if (user.role === 'buddy' && location.pathname === '/register-buddy') {
      alert("🎉 Chúc mừng! Bạn đã chính thức trở thành Local Buddy.");
      navigate('/buddy-dashboard');
    }
  }, [user?.role]); 

  const navItems = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Khám Phá', path: '/discovery' },
    { name: 'Cộng Đồng', path: '/social' },
    { name: 'Local Buddy', path: '/buddy' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/discovery?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
    setIsMobileSearchOpen(false);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  // Menu Item Reusable
  const MenuItem = ({ to, onClick, icon: Icon, children, variant = 'default' }) => {
    const baseClass = "flex items-center px-4 py-3 text-sm transition-colors duration-200 ";
    const styles = {
      default: "text-gray-700 hover:bg-orange-50 hover:text-orange-600",
      danger: "text-red-600 hover:bg-red-50",
    };
    const content = (
      <>
        <Icon className={`h-5 w-5 mr-3 ${variant === 'default' ? 'text-gray-400' : ''}`} />
        <span className="font-medium">{children}</span>
      </>
    );
    return to ? (
      <Link to={to} className={`${baseClass} ${styles[variant]}`} onClick={onClick}>{content}</Link>
    ) : (
      <button onClick={handleLogout} className={`w-full ${baseClass} ${styles[variant]}`}>{content}</button>
    );
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">

          {/* LEFT: Logo & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsOpen(true)}
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <MapPin className="h-7 w-7 text-orange-500" />
              <span className="text-xl font-bold text-gray-800">ViVuLocal</span>
            </Link>
          </div>

          {/* CENTER: Desktop Nav Items (Giữ nguyên như cũ) */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path)
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-500'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* RIGHT: Search & User Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Desktop */}
            <form onSubmit={handleSearch} className="relative hidden lg:block">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="pl-9 pr-4 py-1.5 rounded-full border border-gray-200 text-sm focus:border-orange-500 w-40 focus:w-56 transition-all outline-none"
              />
              <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
            </form>

            {/* Search Mobile Toggle */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search size={20} />
            </button>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-all"
                >
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200 shadow-sm overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu (Đã làm đẹp) */}
                {/* Dropdown Menu */}
                {/* Thay thế phần Dropdown Menu trong Navbar.jsx */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
                    <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-800">{user.name}</p>
                      {/* Hiển thị Badge Role rực rỡ hơn khi vừa lên đời */}
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'text-red-500' :
                          user.role === 'manager' ? 'text-purple-600' :
                            user.role === 'buddy' ? 'text-blue-600' : 'text-orange-500'
                        }`}>
                        {user.role === 'manager' ? '🌟 Đối tác quản lý' :
                          user.role === 'buddy' ? '💎 Local Buddy' : user.role}
                      </p>
                    </div>

                    <MenuItem to="/profile" icon={UserCircle} onClick={() => setShowUserMenu(false)}>
                      Trang cá nhân
                    </MenuItem>

                    {/* Phân quyền Menu linh hoạt */}
                    {user.role === 'admin' && (
                      <MenuItem to="/admin" icon={LayoutDashboard} onClick={() => setShowUserMenu(false)}>
                        Admin Panel
                      </MenuItem>
                    )}

                    {user.role === 'manager' && (
                      <MenuItem to="/manager/dashboard" icon={LayoutDashboard} onClick={() => setShowUserMenu(false)}>
                        <span className="text-purple-700 font-bold">Quản lý Khu du lịch</span>
                      </MenuItem>
                    )}

                    {user.role === 'buddy' && (
                      <MenuItem to="/buddy-dashboard" icon={LayoutDashboard} onClick={() => setShowUserMenu(false)}>
                        <span className="text-blue-700 font-bold">Buddy Dashboard</span>
                      </MenuItem>
                    )}

                    {/* Ẩn đăng ký nếu không phải user thường */}
                    {user.role === 'user' && (
                      <>
                        <div className="border-t border-gray-50 my-1"></div>
                        <MenuItem to="/register-buddy" icon={UserCheck} onClick={() => setShowUserMenu(false)}>
                          Đăng ký làm Buddy
                        </MenuItem>
                        <MenuItem to="/register-partner" icon={Briefcase} onClick={() => setShowUserMenu(false)}>
                          Trở thành Đối tác
                        </MenuItem>
                      </>
                    )}

                    <div className="border-t border-gray-100 mt-1">
                      <MenuItem to="/saved-plans" icon={Heart} onClick={() => setShowUserMenu(false)}>Đã lưu</MenuItem>
                      <MenuItem to="/settings" icon={Settings} onClick={() => setShowUserMenu(false)}>Cài đặt</MenuItem>
                      <div className="border-t border-gray-100 mt-1">
                        <MenuItem icon={LogOut} variant="danger" onClick={handleLogout}>Đăng xuất</MenuItem>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block text-gray-600 text-sm font-medium px-3 py-2">Đăng nhập</Link>
                <Link to="/register" className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md shadow-orange-100">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE SEARCH INPUT (Hiện ra khi bấm kính lúp trên mobile) */}
        {isMobileSearchOpen && (
          <div className="lg:hidden pb-4 pt-2 animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm địa điểm..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>
          </div>
        )}
      </div>

      {/* MOBILE SIDEBAR (Drawer) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Overlay làm mờ nền */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Menu Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <MapPin className="text-orange-500" />
                <span className="font-bold text-xl">ViVuLocal</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2">Menu Chính</p>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all ${isActive(item.path)
                    ? 'bg-orange-50 text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {!user && (
              <div className="mt-8 pt-8 border-t border-gray-100 space-y-3">
                <Link to="/login" className="block w-full py-3 text-center font-bold text-gray-600 border border-gray-200 rounded-xl" onClick={() => setIsOpen(false)}>Đăng nhập</Link>
                <Link to="/register" className="block w-full py-3 text-center bg-orange-500 text-white rounded-xl font-bold" onClick={() => setIsOpen(false)}>Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;