import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { buddyApplications } from '../data/mockData';

const AdminDashboard = () => {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    // Load from localStorage or mockData
    const savedApps = localStorage.getItem('buddy_applications');
    if (savedApps) {
      setApplications(JSON.parse(savedApps));
    } else {
      setApplications(buddyApplications);
      localStorage.setItem('buddy_applications', JSON.stringify(buddyApplications));
    }
  }, []);

  const handleApprove = (id: number) => {
    if (window.confirm('Xác nhận duyệt hồ sơ này? Tài khoản Buddy sẽ được tạo.')) {
      const updatedApps = applications.map(app => 
        app.id === id ? { ...app, status: 'approved' } : app
      );
      setApplications(updatedApps);
      localStorage.setItem('buddy_applications', JSON.stringify(updatedApps));
      
      // In a real app, this would create a user account and buddy profile
      alert('Đã duyệt hồ sơ! Tài khoản Buddy đã được tạo (Mô phỏng).');
    }
  };

  const handleReject = (id: number) => {
    if (window.confirm('Từ chối hồ sơ này?')) {
      const updatedApps = applications.map(app => 
        app.id === id ? { ...app, status: 'rejected' } : app
      );
      setApplications(updatedApps);
      localStorage.setItem('buddy_applications', JSON.stringify(updatedApps));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Duyệt hồ sơ Buddy</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ứng viên</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Kinh nghiệm</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map(app => (
                  <tr key={app.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold mr-3">
                          {app.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{app.name}</div>
                          <div className="text-sm text-gray-500">{app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{app.location}</div>
                      <div className="text-sm text-gray-500">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{app.experience}</div>
                      <div className="text-xs text-gray-500 max-w-xs truncate" title={app.certificates}>
                        {app.certificates}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status === 'approved' ? 'Đã duyệt' :
                         app.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {app.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleApprove(app.id)}
                            className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full"
                            title="Duyệt"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleReject(app.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full"
                            title="Từ chối"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
