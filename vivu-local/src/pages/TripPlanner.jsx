import { useState } from 'react'
import { Calendar, MapPin, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../data/firebase'
import { useAuthStore } from '../store/authStore'

const TripPlanner = () => {
  const [step, setStep] = useState(1)
  const [plan, setPlan] = useState({
    destination: '',
    days: 3,
    budget: 'medium',
    interests: [],
  })

  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const handleInterestToggle = (interest) => {
    setPlan((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const calculateTotalCost = () => {
    return (
      (plan.days - 1) * (plan.budget === 'low' ? 300000 : 800000) +
      plan.days * 3 * (plan.budget === 'low' ? 50000 : 150000) +
      plan.days * 200000
    )
  }

  const handleSavePlan = async () => {
    if (!user) {
      alert('Bạn cần đăng nhập để lưu kế hoạch')
      navigate('/login')
      return
    }

    try {
      await addDoc(collection(db, 'tripPlans'), {
        userId: user.id,
        destination: plan.destination,
        days: plan.days,
        budget: plan.budget,
        interests: plan.interests,
        totalCost: calculateTotalCost(),
        createdAt: serverTimestamp(),
      })

      alert('Đã lưu kế hoạch thành công!')
      navigate('/saved-plans')
    } catch (err) {
      console.error(err)
      alert('Lỗi khi lưu kế hoạch')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lập Kế Hoạch Chuyến Đi
          </h1>
          <p className="text-gray-600">
            Nhận gợi ý lịch trình và dự toán chi phí chỉ trong 1 phút
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gray-100 h-2 w-full">
            <div
              className="bg-orange-500 h-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="p-8">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Bước 1: Bạn muốn đi đâu?</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Điểm đến
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-10 py-3 border rounded-lg"
                      value={plan.destination}
                      onChange={(e) =>
                        setPlan({ ...plan, destination: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số ngày
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      min={1}
                      className="w-full pl-10 py-3 border rounded-lg"
                      value={plan.days}
                      onChange={(e) =>
                        setPlan({ ...plan, days: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold"
                >
                  Tiếp tục
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">
                  Bước 2: Ngân sách & Sở thích
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  {['low', 'medium', 'high'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setPlan({ ...plan, budget: b })}
                      className={`p-4 border rounded-xl ${
                        plan.budget === b
                          ? 'border-orange-500 bg-orange-50'
                          : ''
                      }`}
                    >
                      {b.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {[
                    'Ẩm thực',
                    'Văn hóa',
                    'Nghỉ dưỡng',
                    'Mạo hiểm',
                    'Check-in',
                  ].map((i) => (
                    <button
                      key={i}
                      onClick={() => handleInterestToggle(i)}
                      className={`px-4 py-2 border rounded-full ${
                        plan.interests.includes(i)
                          ? 'bg-gray-900 text-white'
                          : ''
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-gray-100 py-3 rounded-lg"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="w-2/3 bg-orange-500 text-white py-3 rounded-lg"
                  >
                    Xem gợi ý
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="text-center">
                <Check className="mx-auto h-12 w-12 text-green-600 mb-4" />
                <h2 className="text-2xl font-bold mb-6">
                  Hoàn tất kế hoạch
                </h2>

                <button
                  onClick={handleSavePlan}
                  className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold"
                >
                  Lưu lịch trình & Tìm Buddy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripPlanner
