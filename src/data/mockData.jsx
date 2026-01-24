import foodImg from '../assets/food.png';

export const destinations = [
  { 
    id: 'hoi-an', 
    name: 'Hội An', 
    desc: 'Phố cổ lãng mạn & Ẩm thực đường phố', 
    img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
    details: 'Hội An là một thành phố cổ xinh đẹp nằm ở hạ lưu sông Thu Bồn, thuộc vùng đồng bằng ven biển tỉnh Quảng Nam. Nổi tiếng với những ngôi nhà cổ màu vàng nghệ, đèn lồng rực rỡ và ẩm thực đường phố tuyệt vời.'
  },
  { 
    id: 'da-lat', 
    name: 'Đà Lạt', 
    desc: 'Thành phố ngàn hoa & Săn mây', 
    img: 'https://images.unsplash.com/photo-1626015094736-249ac895f6fd?auto=format&fit=crop&w=800&q=80',
    details: 'Đà Lạt được mệnh danh là thành phố ngàn hoa, với khí hậu mát mẻ quanh năm. Đây là điểm đến lý tưởng cho những ai yêu thích sự lãng mạn, thiên nhiên hùng vĩ và những quán cà phê view đẹp.'
  },
  { 
    id: 'ha-giang', 
    name: 'Hà Giang', 
    desc: 'Cao nguyên đá hùng vĩ', 
    img: 'https://images.unsplash.com/photo-1590259299368-2e85298092f6?auto=format&fit=crop&w=800&q=80',
    details: 'Hà Giang nơi địa đầu tổ quốc với cao nguyên đá Đồng Văn hùng vĩ, những cung đường đèo uốn lượn và văn hóa đặc sắc của đồng bào dân tộc thiểu số.'
  }
];

export const reviews = [
  {
    id: 1,
    title: "Lạc lối ở Hội An – Ăn sập phố cổ chỉ với 500k",
    author: "Minh Anh",
    location: "Hội An, Quảng Nam",
    category: "food",
    image: foodImg,
    rating: 4.8,
    cost: "450.000đ",
    tags: ["#Ngon_Bổ_Rẻ", "#Chuẩn_Vị"],
    content: "Vị nước Mót rất thanh, nhưng xếp hàng hơi lâu. Nên đi sau 9h tối để vắng khách hơn. Bánh mì Phượng vẫn ngon như lời đồn, pate béo ngậy, vỏ bánh giòn tan. Cao lầu Thanh thì sợi mì dai, thịt xá xíu đậm đà.",
    fullContent: "Chuyến đi Hội An lần này mình quyết tâm cầm 500k để ăn sập phố cổ. Và kết quả thật bất ngờ! \n\n1. Bánh mì Phượng (35k): Vẫn là best seller. Dù xếp hàng 20p nhưng cắn miếng bánh là quên hết mệt mỏi.\n2. Nước Mót (12k): Vị thảo mộc thanh mát, check-in sống ảo cực đẹp.\n3. Cơm gà Bà Buội (55k): Gà ta xịn, cơm dẻo thơm mùi mỡ gà.\n4. Cao lầu Thanh (40k): Quán nhỏ trong hẻm nhưng vị rất chuẩn.\n\nTổng kết: 450k cho một ngày no nê. Hội An không chỉ đẹp mà đồ ăn còn quá rẻ!"
  },
  {
    id: 2,
    title: "Săn mây Cầu Đất - Kinh nghiệm xương máu",
    author: "Tuấn Hưng",
    location: "Đà Lạt, Lâm Đồng",
    category: "culture",
    image: "https://images.unsplash.com/photo-1626015094736-249ac895f6fd?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    cost: "150.000đ",
    tags: ["#View_Sống_Ảo", "#Checkin"],
    content: "Nên đi từ 4h sáng. Mang theo áo ấm vì rất lạnh. Đường đi hơi tối cần tay lái cứng.",
    fullContent: "Để săn được mây đẹp ở Cầu Đất, bạn phải dậy từ 3h30 sáng. Đường đi khá xa và lạnh, nhớ mặc ấm và mang găng tay. \n\nĐến nơi tầm 5h30 là đẹp nhất, lúc này mặt trời bắt đầu ló dạng, biển mây bồng bềnh dưới chân. \n\nLưu ý: \n- Xem dự báo thời tiết trước, độ ẩm cao mới có mây.\n- Đường đi có đoạn đang làm, đi chậm thôi.\n- Ghé quán cafe Gỗ Săn Mây uống ly cacao nóng là tuyệt vời."
  },
  {
    id: 3,
    title: "Homestay Nhà Bên Rừng - Chill hết nấc",
    author: "Lan Chi",
    location: "Sóc Sơn, Hà Nội",
    category: "stay",
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80",
    rating: 4.2,
    cost: "1.200.000đ",
    tags: ["#Nghỉ_Dưỡng", "#Yên_Tĩnh"],
    content: "Phòng sạch, view rừng thông tuyệt đẹp. Đồ ăn hơi đắt nhưng ngon.",
    fullContent: "Một nơi trốn khói bụi thành phố tuyệt vời ngay sát Hà Nội. \n\nĐiểm cộng:\n- Không gian xanh mướt, yên tĩnh.\n- Bể bơi vô cực view rừng thông.\n- Phòng ốc decor xinh xắn, sạch sẽ.\n\nĐiểm trừ:\n- Đồ ăn tại nhà hàng giá hơi cao so với mặt bằng chung.\n- Buổi tối có muỗi, nhớ mang xịt chống côn trùng."
  }
];

export const buddies = [
  {
    id: 1,
    name: "Nguyễn Văn Nam",
    location: "Hội An",
    specialty: "Lịch sử & Văn hóa",
    languages: ["Tiếng Việt", "English"],
    rating: 4.9,
    reviews: 124,
    price: "200.000đ/giờ",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    bio: "Sinh ra và lớn lên tại phố cổ, mình thuộc từng con hẻm nhỏ và những câu chuyện chưa kể về Hội An.",
    contact: {
      phone: "0905 xxx xxx",
      email: "nam.hoian@vivulocal.vn",
      zalo: "0905xxxxxx"
    },
    status: "available"
  },
  {
    id: 2,
    name: "Trần Thị Mai",
    location: "Đà Lạt",
    specialty: "Food Tour & Chụp ảnh",
    languages: ["Tiếng Việt", "Korean"],
    rating: 4.8,
    reviews: 89,
    price: "300.000đ/giờ",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    bio: "Mình biết những quán cà phê view đẹp nhất và những quán ăn ngon mà chỉ người địa phương mới biết.",
    contact: {
      phone: "0938 xxx xxx",
      email: "mai.dalat@vivulocal.vn",
      zalo: "0938xxxxxx"
    },
    status: "busy",
    busyUntil: "2023-10-25T18:00:00"
  },
  {
    id: 3,
    name: "Lê Hoàng",
    location: "Hà Nội",
    specialty: "Street Food & Nightlife",
    languages: ["Tiếng Việt", "English", "French"],
    rating: 5.0,
    reviews: 56,
    price: "250.000đ/giờ",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    bio: "Khám phá Hà Nội 36 phố phường và thưởng thức ẩm thực vỉa hè chuẩn vị cùng mình nhé!",
    contact: {
      phone: "0912 xxx xxx",
      email: "hoang.hanoi@vivulocal.vn",
      zalo: "0912xxxxxx"
    },
    status: "available"
  }
];

export const users = [
  {
    id: 1,
    email: "admin@gmail.com",
    password: "Admin@123",
    name: "Administrator",
    role: "admin"
  },
  {
    id: 2,
    email: "user@gmail.com",
    password: "123",
    name: "Nguyễn Văn A",
    role: "user"
  },
  {
    id: 3,
    email: "buddy@gmail.com",
    password: "123",
    name: "Nguyễn Văn Nam",
    role: "buddy",
    buddyId: 1 // Links to buddies array
  }
];

export const buddyApplications = [
  {
    id: 1,
    name: "Phạm Văn C",
    email: "phamvanc@gmail.com",
    phone: "0987654321",
    location: "Đà Nẵng",
    experience: "2 năm",
    languages: "Tiếng Anh, Tiếng Nhật",
    certificates: "Thẻ hướng dẫn viên quốc tế",
    status: "pending",
    date: "2023-10-26"
  }
];

export const posts = [
  {
    id: 1,
    title: "Hoàng hôn trên cầu Long Biên",
    content: "Một buổi chiều tuyệt vời ngắm nhìn Hà Nội từ trên cao. Cảm giác thật bình yên giữa lòng thủ đô tấp nập.",
    image: "https://images.unsplash.com/photo-1555921090-b3a8370e36f2?auto=format&fit=crop&w=800&q=80",
    location: "Hà Nội",
    author: "Nguyễn Văn A",
    likes: 45,
    comments: [
      { id: 1, user: "Trần B", text: "Đẹp quá bạn ơi!" },
      { id: 2, user: "Lê C", text: "Góc này chụp lúc mấy giờ thế?" }
    ],
    timestamp: "2023-10-20T17:30:00Z"
  },
  {
    id: 2,
    title: "Bánh mì Phượng - Hội An",
    content: "Xếp hàng 30 phút mới mua được nhưng thực sự rất đáng. Vỏ bánh giòn, nhân đầy đặn.",
    image: foodImg,
    location: "Hội An",
    author: "Phạm Thị D",
    likes: 120,
    comments: [],
    timestamp: "2023-10-21T09:15:00Z"
  }
];
