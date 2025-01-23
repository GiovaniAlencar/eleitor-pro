import { CityStatistic } from '../../services/dashboard.service';
import { formatNumber } from '../../utils/format';

interface CityDistributionProps {
  cities: CityStatistic[];
}

export default function CityDistribution({ cities }: CityDistributionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Distribuição por Cidade
      </h3>

      <div className="space-y-4">
        {cities.map((city, index) => {
          const percentage = (city.total / cities.reduce((acc, curr) => acc + curr.total, 0)) * 100;
          
          return (
            <div key={city.city} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{city.city}</span>
                <span className="text-gray-500">{formatNumber(city.total)} eleitores</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}