import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Mail, Lock, UserPlus, User, Phone, Eye, EyeOff } from 'lucide-react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore' 
import { auth, db } from '../components/firebase' 
import { useAuthStore } from '../store/authStore'

const Register = () => {
    const navigate = useNavigate()
    const login = useAuthStore((s) => s.login)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        city: '',
        gender: '',
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false) // Thêm loading để tránh bấm nhiều lần
    const [showPassword, setShowPassword] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // 1. Tạo tài khoản trên Firebase Auth
            const res = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            )

            // 2. Tạo dữ liệu User Object theo đúng yêu cầu của Firestore Rules
            const userData = {
                uid: res.user.uid,
                name: formData.name,
                email: formData.email,
                phone: formData.phone || '',
                city: formData.city || '',
                gender: formData.gender || '',
                role: 'user', // Bắt buộc là "user" theo Rules của bạn
                createdAt: new Date().toISOString()
            }

            // 3. LƯU VÀO FIRESTORE (Đây là phần bạn đang thiếu)
            await setDoc(doc(db, "users", res.user.uid), userData)

            // 4. Cập nhật vào AuthStore local
            login(userData)

            alert('Tạo tài khoản thành công!')
            navigate('/') // Nên chuyển về trang chủ vì đã đăng nhập luôn rồi
        } catch (err) {
            console.error('Registration error:', err)
            let errorMessage = 'Đã xảy ra lỗi khi đăng ký'
            if (err.code === 'auth/email-already-in-use') errorMessage = 'Email đã được sử dụng'
            else if (err.code === 'auth/weak-password') errorMessage = 'Mật khẩu quá yếu'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <Link to="/" className="flex justify-center items-center mb-6 group">
                    <MapPin className="h-8 w-8 text-orange-500 group-hover:scale-110 transition-transform" />
                    <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                        ViVuLocal
                    </span>
                </Link>

                <h2 className="text-center text-xl font-bold text-gray-800 mb-6">Đăng ký tài khoản mới</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Họ tên */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase">Họ và tên</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                className="pl-10 w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                placeholder="Nguyễn Văn A"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="email"
                                className="pl-10 w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                placeholder="vi-du@gmail.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase">Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="pl-10 pr-10 w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400 hover:text-orange-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Các trường phụ (Phone, City, Gender) xếp lưới */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                             <label className="text-xs font-semibold text-gray-600 uppercase">Số điện thoại</label>
                             <input
                                className="w-full border border-gray-200 p-2.5 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none"
                                placeholder="090..."
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 uppercase">Thành phố</label>
                            <input
                                className="w-full border border-gray-200 p-2.5 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none"
                                placeholder="Đà Lạt"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 uppercase">Giới tính</label>
                            <select
                                className="w-full border border-gray-200 p-2.5 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="">Chọn</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className={`w-full bg-orange-500 text-white py-3 rounded-xl font-bold flex justify-center items-center transition-all shadow-md shadow-orange-100 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600 active:scale-95'}`}
                    >
                        {loading ? 'Đang tạo...' : <><UserPlus className="h-5 w-5 mr-2" /> Đăng ký ngay</>}
                    </button>
                </form>

                <p className="text-center text-sm mt-6 text-gray-500">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-orange-600 font-bold hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register