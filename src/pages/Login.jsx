import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Mail, Lock, AlertCircle } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../components/firebase'
import { loginWithGoogle } from '../auth/googleLogin'
import { useAuthStore } from '../store/authStore'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  // LOGIN EMAIL
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Đăng nhập với Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Lấy dữ liệu Profile từ Firestore (để lấy Role)
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        setError("Tài khoản không tồn tại trên hệ thống dữ liệu.");
        return;
      }

      const userData = userDoc.data();
      const userRole = userData?.role || 'user'; // Mặc định là user

      // 3. Lưu vào State Management (Zustand/AuthStore)
      login({
        uid: user.uid,
        email: user.email,
        name: userData?.name || 'Người dùng',
        role: userRole,
      });

      // 4. ĐIỀU HƯỚNG THÔNG MINH DỰA TRÊN 4 ROLE
      switch (userRole) {
        case 'admin':
          navigate('/admin');
          break;
        case 'manager':
          // Đối tác khu du lịch về Dashboard của họ
          navigate('/manager/dashboard');
          break;
        case 'buddy':
          // Hướng dẫn viên về Dashboard quản lý tour
          navigate('/buddy-dashboard');
          break;
        case 'user':
        default:
          // Khách du lịch về trang chủ
          navigate('/');
          break;
      }

    } catch (err) {
      console.error("Login Error:", err);
      // Xử lý thông báo lỗi thân thiện hơn
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email hoặc mật khẩu không chính xác');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Thử lại quá nhiều lần. Vui lòng đợi một lát!');
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      // Gọi hàm login đã sửa ở trên
      const userData = await loginWithGoogle();

      // Lưu vào Zustand store
      login({
        uid: userData.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      });

      // Điều hướng dựa trên role (giống hệt logic bên Email Login)
      if (userData.role === 'admin') navigate('/admin');
      else if (userData.role === 'manager') navigate('/manager/dashboard');
      else navigate('/');

    } catch (err) {
      console.error(err);
      setError('Đăng nhập Google thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <div className="flex justify-center mb-6">
          <MapPin className="h-10 w-10 text-orange-500" />
          <span className="ml-2 text-3xl font-bold">ViVuLocal</span>
        </div>

        <h2 className="text-center text-2xl font-bold mb-4">
          Đăng nhập
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded flex items-center mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full border rounded py-2"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label>Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full border rounded py-2"
              />
            </div>
          </div>

          <button className="w-full bg-orange-600 text-white py-2 rounded">
            Đăng nhập
          </button>
        </form>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 border py-2 rounded flex justify-center items-center gap-2 hover:bg-gray-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          Đăng nhập bằng Google
        </button>

        <p className="text-center text-sm mt-4">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-orange-600 font-semibold">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
