import { Search } from 'lucide-react';

interface MapControlsProps {
  cities: string[];
  selectedCity: string;
  onCitySelect: (city: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: 'eleitores' | 'liderancas';
  onTypeChange: (type: 'eleitores' | 'liderancas') => void;
}

export default function MapControls({
  cities,
  selectedCity,
  onCitySelect,
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange
}: MapControlsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">FILTRO:</label>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => onCitySelect(city)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCity === city
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full sm:w-auto flex-1">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="BUSCAR CIDADE..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => onTypeChange('eleitores')}
          className={`px-6 py-2 rounded-full transition-colors ${
            selectedType === 'eleitores'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ELEITORES
        </button>
        <button
          onClick={() => onTypeChange('liderancas')}
          className={`px-6 py-2 rounded-full transition-colors ${
            selectedType === 'liderancas'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          LIDERANÇAS
        </button>
      </div>
    </div>
  );
}