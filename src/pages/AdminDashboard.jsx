import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../components/firebase";

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const snapshot = await getDocs(collection(db, "buddyApplications"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApplications(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Xác nhận duyệt hồ sơ này?")) return;

    await updateDoc(doc(db, "buddyApplications", id), {
      status: "approved",
    });

    setApplications(apps =>
      apps.map(app =>
        app.id === id ? { ...app, status: "approved" } : app
      )
    );
  };

  const handleReject = async (id) => {
    if (!window.confirm("Từ chối hồ sơ này?")) return;

    await updateDoc(doc(db, "buddyApplications", id), {
      status: "rejected",
    });

    setApplications(apps =>
      apps.map(app =>
        app.id === id ? { ...app, status: "rejected" } : app
      )
    );
  };

  if (loading) {
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
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
                  <td className="px-6 py-4">
                    <div className="font-semibold">{app.name}</div>
                    <div className="text-sm text-gray-500">{app.email}</div>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <div>{app.location}</div>
                    <div>{app.phone}</div>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <div>{app.experience}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {app.certificates}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${app.status === "approved" && "bg-green-100 text-green-800"}
                      ${app.status === "rejected" && "bg-red-100 text-red-800"}
                      ${app.status === "pending" && "bg-yellow-100 text-yellow-800"}
                    `}>
                      {app.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="p-2 bg-green-50 text-green-600 rounded-full"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-full"
                        >
                          <X size={18} />
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
  );
};

export default AdminDashboard;
