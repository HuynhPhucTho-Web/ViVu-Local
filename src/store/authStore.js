import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../components/firebase' // Đảm bảo đường dẫn này đúng

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,

      // Hàm đăng nhập lưu user ban đầu
      login: (user) => {
        set({ user })
      },

      // Hàm quan trọng nhất: Lắng nghe thay đổi Role/Thông tin từ Firestore
      listenToUser: () => {
        const currentUser = get().user;
        if (!currentUser?.uid) return;

        // Thiết lập lắng nghe Real-time
        const unsub = onSnapshot(doc(db, "users", currentUser.uid), (snapshot) => {
          if (snapshot.exists()) {
            const newData = snapshot.data();
            // Chỉ cập nhật nếu có sự thay đổi để tránh render thừa
            set({ 
              user: { 
                ...currentUser, 
                ...newData, 
                uid: currentUser.uid // Đảm bảo giữ lại UID
              } 
            });
          }
        }, (error) => {
          console.error("Lỗi lắng nghe user:", error);
        });

        return unsub;
      },

      logout: () => {
        set({ user: null });
        // Xóa sạch storage khi logout
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)