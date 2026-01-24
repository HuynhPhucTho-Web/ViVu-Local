
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { destinations } from '../data/mockData';

const DestinationDetail = () => {
  const { id } = useParams();
  const dest = destinations.find(d => d.id === id);

  if (!dest) {
    return <div className="text-center py-20">Không tìm thấy địa điểm</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[500px] relative">
        <img src={dest.img} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-6 left-6">
          <Link to="/" className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center hover:bg-white/30 transition">
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-12 text-white text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">{dest.name}</h1>
          <p className="text-xl md:text-2xl font-light">{dest.desc}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{dest.details}</p>
        </div>

        <div className="text-center">
          <Link to={`/discovery?search=${dest.name}`} className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition shadow-lg">
            Xem review về {dest.name}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
