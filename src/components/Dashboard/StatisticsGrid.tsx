import { Users, MapPin, TrendingUp } from 'lucide-react';
import { Statistics } from '../../services/dashboard.service';
import { formatNumber } from '../../utils/format';

interface StatisticsGridProps {
  statistics: Statistics;
}

export default function StatisticsGrid({ statistics }: StatisticsGridProps) {
  const stats = [
    {
      title: 'ELEITORES',
      value: formatNumber(statistics.total_voters),
      change: `${statistics.growth.voters >= 0 ? '+' : ''}${statistics.growth.voters}%`,
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: 'green'
    },
    {
      title: 'LIDERANÇAS',
      value: formatNumber(statistics.total_leaders),
      change: `${statistics.growth.leaders >= 0 ? '+' : ''}${statistics.growth.leaders}%`,
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'cyan'
    },
    {
      title: 'CIDADES',
      value: formatNumber(statistics.total_cities),
      change: `${statistics.growth.cities >= 0 ? '+' : ''}${statistics.growth.cities}%`,
      icon: <MapPin className="w-6 h-6 text-white" />,
      color: 'blue'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 uppercase text-sm font-medium tracking-wider">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold mt-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className={`text-${stat.color}-500 text-sm mt-2 font-medium`}>
                {stat.change} desde ontem
              </p>
            </div>
            <div className={`bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 p-3 rounded-xl shadow-sm`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}