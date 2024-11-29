import { Download } from 'lucide-react';
import ElectoralMap from '../components/Maps/ElectoralMap';
import FilterButton from '../components/Common/FilterButton';

const mockMarkers = [
  { latitude: -23.5505, longitude: -46.6333, type: 'eleitor' as const },
  { latitude: -23.5605, longitude: -46.6433, type: 'lideranca' as const },
  { latitude: -23.5705, longitude: -46.6533, type: 'eleitor' as const },
  { latitude: -23.5805, longitude: -46.6633, type: 'lideranca' as const }
];

export default function MapaEleitoral() {
  const filterOptions = [
    { label: 'Eleitores', value: 'eleitores', group: 'Tipo' },
    { label: 'Lideranças', value: 'liderancas', group: 'Tipo' },
    { label: 'Pirapora', value: 'pirapora', group: 'Cidades' },
    { label: 'Osasco', value: 'osasco', group: 'Cidades' },
    { label: 'Carapicuíba', value: 'carapicuiba', group: 'Cidades' },
    { label: 'Centro', value: 'centro', group: 'Bairros' },
    { label: 'Vila Nova', value: 'vila-nova', group: 'Bairros' },
    { label: 'Jardim das Flores', value: 'jardim-flores', group: 'Bairros' }
  ];

  const handleFilter = (selected: string[]) => {
    const showEleitores = selected.includes('eleitores');
    const showLiderancas = selected.includes('liderancas');
    
    return mockMarkers.filter(marker => {
      if (!showEleitores && !showLiderancas) return true;
      if (showEleitores && marker.type === 'eleitor') return true;
      if (showLiderancas && marker.type === 'lideranca') return true;
      return false;
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 order-1">
            <span>HOME</span>
            <span>/</span>
            <span className="font-medium text-gray-900">MAPA ELEITORAL</span>
          </div>
          <div className="flex items-center gap-3 order-2 sm:order-2">
            <FilterButton
              options={filterOptions}
              onFilter={handleFilter}
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">EXPORTAR</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">150</p>
              <p className="text-sm font-medium text-gray-600">Total Eleitores</p>
              <p className="text-xs text-blue-600 font-medium mt-2 bg-blue-50 px-3 py-1 rounded-full">
                Pirapora
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-100">
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold text-emerald-600 mb-2">75</p>
              <p className="text-sm font-medium text-gray-600">Homens</p>
              <p className="text-xs text-emerald-600 font-medium mt-2 bg-emerald-50 px-3 py-1 rounded-full">
                50%
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold text-purple-600 mb-2">75</p>
              <p className="text-sm font-medium text-gray-600">Mulheres</p>
              <p className="text-xs text-purple-600 font-medium mt-2 bg-purple-50 px-3 py-1 rounded-full">
                50%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="rounded-xl overflow-hidden">
          <ElectoralMap
            markers={mockMarkers}
            onMarkerClick={marker => console.log('Marker clicked:', marker)}
          />
        </div>
      </div>
    </div>
  );
}