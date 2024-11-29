import { TrendingUp, Users, MapPin } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import GrowthChart from '../components/Dashboard/GrowthChart';

export default function Home() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
              alt="Profile"
              className="w-12 h-12 rounded-full ring-2 ring-white shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full ring-2 ring-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">Bem-vindo de Volta</h1>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Online
              </span>
            </div>
            <h2 className="text-gray-600">Deputada Maria Elisa</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="ELEITORES"
          value="123,456"
          change="+3.48%"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="green"
        />
        <StatsCard
          title="LIDERANÇA"
          value="50"
          change="+3.48%"
          icon={<Users className="w-6 h-6 text-white" />}
          color="cyan"
        />
        <StatsCard
          title="CIDADES"
          value="10"
          change="+25.18%"
          icon={<MapPin className="w-6 h-6 text-white" />}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GrowthChart />
      </div>
    </div>
  );
}