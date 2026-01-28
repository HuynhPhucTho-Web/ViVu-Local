import React from 'react';
import { useAuthStore } from '../../store/authStore';
import {
    Building2, MapPin, Clock, Phone, Globe, ShieldCheck,
    Image as ImageIcon, Star, Settings, Edit3, Eye,
    FileText, Mail, User, DollarSign, ExternalLink
} from 'lucide-react';

const BusinessProfile = () => {
    // Lấy trực tiếp thông tin user đã đăng nhập từ Store
    const { user } = useAuthStore();

    // 1. Kiểm tra quyền truy cập
    if (!user || user.role !== 'manager') {
        return <div className="p-20 text-center font-bold text-slate-500">
            Bạn không có quyền truy cập hoặc hồ sơ chưa được duyệt làm Manager.
        </div>;
    }

    // 2. Định nghĩa nguồn dữ liệu (Ưu tiên các trường business trong user doc)
    // Nếu bạn đã làm bước "Copy dữ liệu" ở câu trả lời trước, dữ liệu sẽ nằm ở đây
    const data = {
        businessName: user.businessName || "Chưa cập nhật tên",
        slogan: user.slogan || "Chưa có slogan",
        businessType: user.businessType || "N/A",
        description: user.description || "Chưa có mô tả.",
        address: user.address || "Chưa có địa chỉ",
        openTime: user.openTime || "00:00",
        closeTime: user.closeTime || "00:00",
        phone: user.phone || user.phoneNumber || "Chưa có SĐT",
        website: user.website || "",
        email: user.businessEmail || user.email,
        representativeName: user.representativeName || user.displayName,
        googleMapsUrl: user.googleMapsUrl || "#",
        priceRange: user.priceRange || "Chưa cập nhật",
        amenities: user.amenities || [],
        proofFiles: {
            thumbnail: user.businessPhotos?.thumbnail || user.photoURL,
            gallery: user.businessPhotos?.gallery || [],
            license: user.businessPhotos?.license || ""
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Banner & Header */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <img
                    src={data.proofFiles.thumbnail || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80'}
                    className="w-full h-full object-cover"
                    alt="Business Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                    <div className="max-w-6xl mx-auto w-full px-6 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-orange-500 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Official Partner</span>
                                <div className="flex text-yellow-400 items-center gap-1 font-bold">
                                    <Star size={14} fill="currentColor" /> 4.9
                                </div>
                            </div>
                            <h1 className="text-4xl font-black drop-shadow-md">{data.businessName}</h1>
                            <p className="text-white/80 italic mt-1 text-lg">"{data.slogan}"</p>
                            <p className="text-white/60 text-sm mt-1 flex items-center gap-2">
                                <Building2 size={14}/> {data.businessType}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
                                <Edit3 size={18} /> Chỉnh sửa
                            </button>
                            <button className="bg-orange-500 text-white p-3 rounded-2xl hover:rotate-90 transition-all duration-300 shadow-lg shadow-orange-500/30">
                                <Settings size={22} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Cột trái */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Giới thiệu */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-500"><FileText size={20}/></div>
                                Giới thiệu địa điểm
                            </h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                                {data.description}
                            </p>

                            <div className="mt-10 pt-8 border-t border-slate-100">
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <ShieldCheck size={20} className="text-green-500"/> Tiện ích sẵn có
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {data.amenities.length > 0 ? data.amenities.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm transition-all">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> {item}
                                        </div>
                                    )) : <p className="text-slate-400 text-sm italic">Chưa cập nhật tiện ích</p>}
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-500"><ImageIcon size={20}/></div>
                                Hình ảnh thực tế
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {data.proofFiles.gallery?.map((url, index) => (
                                    <div key={index} className="aspect-square rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer border border-slate-100 shadow-inner">
                                        <img src={url} className="w-full h-full object-cover" alt={`Gallery ${index}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cột phải */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60 sticky top-24">
                            <h3 className="font-black text-slate-800 mb-6 uppercase text-xs tracking-widest">Thông tin chi tiết</h3>
                            <div className="space-y-6">
                                <ContactItem icon={<MapPin size={20}/>} color="bg-blue-50 text-blue-500" label="Địa chỉ" value={data.address} />
                                <ContactItem icon={<Clock size={20}/>} color="bg-green-50 text-green-500" label="Giờ hoạt động" value={`${data.openTime} - ${data.closeTime}`} />
                                <ContactItem icon={<Phone size={20}/>} color="bg-orange-50 text-orange-500" label="Hotline" value={data.phone} />
                                <ContactItem icon={<Globe size={20}/>} color="bg-purple-50 text-purple-500" label="Website" value={data.website} isLink />
                                <ContactItem icon={<Mail size={20}/>} color="bg-red-50 text-red-500" label="Email" value={data.email} />
                                <ContactItem icon={<User size={20}/>} color="bg-indigo-50 text-indigo-500" label="Đại diện" value={data.representativeName} />
                                <ContactItem icon={<DollarSign size={20}/>} color="bg-yellow-50 text-yellow-500" label="Mức giá" value={data.priceRange} />
                            </div>

                            <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95">
                                <Eye size={18} /> Preview Trang Khách
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component con để code sạch hơn
const ContactItem = ({ icon, color, label, value, isLink }) => (
    <div className="flex items-start gap-4 group">
        <div className={`p-3 ${color} rounded-2xl group-hover:scale-110 transition-transform`}>{icon}</div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
            {isLink ? (
                <a href={value} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 mt-0.5 hover:underline truncate block">
                    {value || 'Chưa có'}
                </a>
            ) : (
                <p className="text-sm font-bold text-slate-700 mt-0.5 break-words leading-tight">{value}</p>
            )}
        </div>
    </div>
);

export default BusinessProfile;