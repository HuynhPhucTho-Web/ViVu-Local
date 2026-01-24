import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Mail, Lock, AlertCircle } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../data/firebase'
import { useAuthStore } from '../store/authStore'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // 1. Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      const uid = userCredential.user.uid

      // 2. Lấy user info từ Firestore
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        setError('Tài khoản không tồn tại trong hệ thống')
        return
      }

      const userData = userSnap.data()

      // 3. Lưu vào store
      login({
        id: uid,
        email: userData.email,
        role: userData.role,
        name: userData.name,
      })

      // 4. Điều hướng theo role
      if (userData.role === 'admin') {
        navigate('/admin')
      } else if (userData.role === 'buddy') {
        navigate('/buddy-dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('Email hoặc mật khẩu không chính xác')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center">
            <MapPin className="h-10 w-10 text-orange-500" />
            <span className="ml-2 text-3xl font-bold text-gray-900">
              ViVuLocal
            </span>
          </Link>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập tài khoản
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full border rounded-md py-2"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full border rounded-md py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
