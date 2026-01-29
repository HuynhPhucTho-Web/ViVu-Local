import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../components/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Tham chiếu tới document của user dựa trên UID
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    
    let userData;

    if (!userDoc.exists()) {
      // TRƯỜNG HỢP 1: NGƯỜI DÙNG MỚI - Ghi dữ liệu vào Firestore
      userData = {
        uid: user.uid,
        name: user.displayName || 'Người dùng Google',
        email: user.email,
        avatar: user.photoURL || '',
        role: 'user', // Mặc định là user
        createdAt: serverTimestamp(), // Dùng serverTimestamp để chuẩn thời gian
      };
      
      // Lưu vào Firestore
      await setDoc(userRef, userData);
      console.log("Đã tạo user mới trong Firestore");
    } else {
      // TRƯỜNG HỢP 2: NGƯỜI DÙNG CŨ - Lấy dữ liệu hiện tại (để giữ đúng Role)
      userData = userDoc.data();
      console.log("User đã tồn tại, lấy dữ liệu cũ");
    }

    // Trả về dữ liệu để lưu vào Store (Zustand/Redux)
    return {
      uid: user.uid,
      email: user.email,
      name: userData.name,
      avatar: userData.avatar,
      role: userData.role || 'user'
    };

  } catch (error) {
    console.error("Lỗi đăng nhập Google:", error);
    throw error; // Ném lỗi để bên Login.jsx xử lý hiển thị UI
  }
};