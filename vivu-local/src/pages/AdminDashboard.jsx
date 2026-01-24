import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { buddyApplications } from '../data/mockData';

/* =======================
   TYPE DEFINITIONS
======================= */
type BuddyApplicationStatus = 'pending' | 'approved' | 'rejected';

type BuddyApplication = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  certificates: string;
  status: BuddyApplicationStatus;
};

/* =======================
   COMPONENT
======================= */
const AdminDashboard = () => {
  const [applications, setApplications] = useState<BuddyApplication[]>([]);

  /* =======================
     LOAD DATA
  ======================= */
  useEffect(() => {
    const saved = localStorage.getItem('buddy_applications');

    if (saved) {
      setApplications(JSON.parse(saved));
    } else {
      setApplications(buddyApplications);
      localStorage.setItem(
        'buddy_applications',
        JSON.stringify(buddyApplications)
      );
    }
  }, []);

  /* =======================
     ACTIONS
  ======================= */
  const handleApprove = (id: number) => {
    const confirmApprove = window.confirm(
      'Xác nhận duyệt hồ sơ này? Tài khoản Buddy sẽ được tạo.'
    );

    if (!confirmApprove) return;

    const updated = applications.map(app =>
      app.id === id ? { ...app, status: 'approved' } : app
    );

    setApplications(updated);
    localStorage.setItem('buddy_applications', JSON.stringify(updated));

    alert('✅ Đã duyệt hồ sơ Buddy (mô phỏng)');
  };

  const handleReject = (id: number) => {
    const confirmReject = window.confirm('Bạn chắc chắn muốn từ chối hồ sơ này?');

    if (!confirmReject) return;

    const updated = applications.map(app =>
      app.id === id ? { ...app, status: 'rejected' } : app
    );

    setApplications(updated);
    localStorage.setItem('buddy_applications', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-bold">Duyệt hồ sơ Local Buddy</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Ứng viên</th>
                  <th className="px-6 py-3">Thông tin</th>
                  <th className="px-6 py-3">Kinh nghiệm</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Hành động</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {applications.map(app => (
                  <tr key={app.id}>
                    {/* USER */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                          {app.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <p className="text-sm text-gray-500">{app.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* INFO */}
                    <td className="px-6 py-4">
                      <p className="text-sm">{app.location}</p>
                      <p className="text-sm text-gray-500">{app.phone}</p>
                    </td>

                    {/* EXPERIENCE */}
                    <td className="px-6 py-4">
                      <p className="text-sm">{app.experience}</p>
                      <p
                        className="text-xs text-gray-500 truncate max-w-xs"
                        title={app.certificates}
                      >
                        {app.certificates}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${
                            app.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        `}
                      >
                        {app.status === 'approved'
                          ? 'Đã duyệt'
                          : app.status === 'rejected'
                          ? 'Từ chối'
                          : 'Chờ duyệt'}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      {app.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100"
                            title="Duyệt"
                          >
                            <Check size={18} />
                          </button>

                          <button
                            onClick={() => handleReject(app.id)}
                            className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                            title="Từ chối"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {applications.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      Chưa có hồ sơ nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
