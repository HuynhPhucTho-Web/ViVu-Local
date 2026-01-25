# ViVu-Local 🌍

ViVu-Local is a modern travel platform built with React, TypeScript, and Vite, designed to connect travelers with local buddies for authentic experiences. It features trip planning, social interactions, destination discovery, and administrative dashboards for managing the platform.

## ✨ Features

- **Home Page**: Welcome interface with hero sections and key highlights.
- **Discovery**: Explore destinations and travel options.
- **Social**: Connect with other travelers and share experiences.
- **Local Buddy**: Find and connect with local guides and buddies.
- **Trip Planner**: Plan and customize your trips.
- **Authentication**: Login and registration for users and buddies.
- **Admin Dashboard**: Manage platform data and users (TypeScript-based).
- **Buddy Dashboard**: Personalized dashboard for local buddies.
- **Chat**: Real-time messaging with buddies.
- **Reviews & Details**: Detailed pages for reviews, buddies, and destinations.
- **Booking Modals**: Interactive modals for booking experiences.
- **Responsive Design**: Built with Tailwind CSS for mobile-first design.
- **State Management**: Uses Zustand for efficient state handling.
- **Firebase Integration**: Backend services for data storage and authentication.

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Backend**: Firebase
- **Build Tool**: Vite with Rolldown
- **Linting**: ESLint with TypeScript support
- **Development**: Hot Module Replacement (HMR)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/vivu-local.git
   cd vivu-local
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase** (if needed):
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Add your Firebase config to `src/data/firebase.jsx`.
   - Enable Authentication and Firestore as required.

4. **Configure environment variables** (if any):
   - Add any necessary environment variables in a `.env` file (e.g., Firebase keys).

## 🚀 Running the Project

1. **Start the development server**:
   ```bash
   npm run dev
   ```
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Preview the production build**:
   ```bash
   npm run preview
   ```

4. **Lint the code**:
   ```bash
   npm run lint
   ```

## 📁 Project Structure

```
vivu-local/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/          # Images and static assets
│   ├── components/      # Reusable UI components (Navbar, Footer, Modals, etc.)
│   ├── data/            # Firebase config and mock data
│   ├── pages/           # Page components (Home, Discovery, AdminDashboard, etc.)
│   ├── store/           # Zustand state management
│   ├── App.css          # Global styles
│   ├── App.jsx          # Main App component with routing
│   ├── index.css        # Base styles
│   └── main.jsx         # Entry point
├── .gitignore
├── eslint.config.js     # ESLint configuration
├── package.json         # Dependencies and scripts
├── tsconfig*.json       # TypeScript configurations
├── vite.config.ts       # Vite configuration
└── README.md
```

## 🎯 Usage

- Navigate through the app using the navbar.
- Register as a user or buddy to access personalized features.
- Use the Trip Planner to create and save travel plans.
- Engage in social features and chat with buddies.
- Admins can manage the platform via the Admin Dashboard.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please reach out to [your-email@example.com](mailto:your-email@example.com).

Dưới đây là bảng tổng hợp chi tiết:

Tên Role Đối tượng Trang Dashboard chính Chức năng chính
## Admin
mail: admin@gmail.com
pass: Admin@123456
 - Bạn (Chủ Web)/admin Duyệt bài đối tác, quản lý người dùng, xóa nội dung xấu, xem tổng quan hệ thống.
## Manager
mail: manager@gmail.com
pass: Manager@123456
 - Đối tác (Khu du lịch)/partner/dashboard Đăng ký khu du lịch, cập nhật giá vé/giờ mở cửa, theo dõi lượng quan tâm của khách.
## Buddy
mail: buddy@gmail.com
pass: Buddy@123456
 - Hướng dẫn viên/buddy-dashboard Đăng hồ sơ cá nhân, nhận yêu cầu dẫn tour, chat với khách du lịch.
## User
Tự đăng ký được tài khoản bằng google hay tạo thủ công
 - Khách du lịch/profileXem tin tức, đăng bài lên cộng đồng (Social), bình luận, thả tim, đặt lịch với Buddy.


npm install -g firebase-tools

firebase --version

firebase login

firebase init


# 🗺️ Travel Platform Business Plan

> **Hệ thống kết nối đa người dùng:** `Admin` | `Manager` | `Buddy` | `User`

---

## 🏗️ 1. Nguồn Lực Duy Trì (Chi Phí Vận Hành)
*Dự toán ngân sách tối thiểu hàng tháng để duy trì hệ thống ổn định.*

| Loại chi phí | Chi tiết | Ước tính (VND/Tháng) |
| :--- | :--- | :--- |
| **Server/Database** | Firebase (Scale theo lượng User) | `0đ` → `500.000đ+` |
| **Lưu trữ ảnh** | Cloudinary (Lưu trữ ảnh/social) | `0đ` → `400.000đ` |
| **Tên miền** | `.com` hoặc `.vn` (300k/năm) | `25.000đ` |
| **Marketing** | Quảng cáo Facebook/TikTok | `2.000.000đ` - `10.000.000đ` |
| **TỔNG CỘNG** | | **~2.500.000đ - 11.000.000đ** |

---

## 💰 2. Mô Hình Doanh Thu
Nền tảng thu tiền từ 3 luồng chính:

1. **Từ Đối tác (Manager):** Thu phí **Featured Post** (`200.000đ/tháng`) để ưu tiên hiển thị khu du lịch lên đầu trang Discovery.
2. **Từ Buddy:** Thu phí hoa hồng (**Commission**) trên mỗi chuyến đi thành công.
3. **Từ Quảng cáo:** Nhận đặt **Banner Ads** tại các vị trí "vàng" cho quán ăn/khách sạn.

---

## 🤝 3. Chính Sách Thu Nhập Buddy
Để giữ chân Buddy, nền tảng áp dụng cơ chế chia sẻ doanh thu minh bạch:



* **Tỷ lệ chia sẻ:** 90/10 (Buddy nhận 90%, Sàn nhận 10%).
* **Ví dụ Tour 500.000đ:**
    * Phí sàn (10%): `-50.000đ` (Duy trì Server & Marketing).
    * **Buddy thực nhận:** `450.000đ`.
* **Cơ chế dòng tiền:**
    1. Khách đặt Buddy qua Web và **cọc 30%**.
    2. Sau khi tour thành công, Web chuyển tiền cọc cho Buddy (đã trừ phí sàn).
    3. Khách trả **70% còn lại bằng tiền mặt** trực tiếp cho Buddy.

---

## 📈 4. Bảng Thống Kê Mục Tiêu (Dự kiến sau 6 tháng)

| Chỉ số | Mục tiêu | Lợi nhuận dự kiến |
| :--- | :--- | :--- |
| **Số lượng Manager** | 20 Khu du lịch | `4.000.000đ` |
| **Số lượng Buddy** | 50 Người | `--` |
| **Số Tour thành công** | 100 Tour/tháng | `5.000.000đ` |
| **Quảng cáo Banner** | 5 Vị trí | `2.500.000đ` |
| **TỔNG DOANH THU** | | **11.500.000đ** |

> 💰 **LỢI NHUẬN RÒNG (Doanh thu - Chi phí):** `~5.000.000đ - 8.000.000đ`

---

## 🚀 5. Lộ Trình Triển Khai (Roadmap)

- [x] **Giai đoạn 1 (Tháng 1-2): Building & Data**
  - Mở đăng ký miễn phí cho Manager/Buddy để lấy dữ liệu.
- [ ] **Giai đoạn 2 (Tháng 3-4): Growth Hack**
  - Tập trung Marketing tại một vùng trọng điểm (VD: Cần Thơ).
- [ ] **Giai đoạn 3 (Tháng 5+): Monetization**
  - Bắt đầu thu phí bài viết nổi bật và tối ưu hóa lợi nhuận.

---
*Last update: Jan 2026*

Project Console: https://console.firebase.google.com/project/vivulocal/overview
Hosting URL: https://vivulocal.web.app