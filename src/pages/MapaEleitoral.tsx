import { Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import ElectoralMap from '../components/Maps/ElectoralMap';
import FilterButton from '../components/Common/FilterButton';
import { mapService, MapStats, MapMarker } from '../services/map.service';
import { formatNumber } from '../utils/format';
import LoadingScreen from '../components/Common/LoadingScreen'; // Componente de tela de loading

export default function MapaEleitoral() {
  const [stats, setStats] = useState<MapStats | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'voter' | 'leader' | ''>('');
  const [loading, setLoading] = useState<boolean>(true); // Estado para controle de carregamento

  const filterOptions = [
    { label: 'Eleitores', value: 'voter', group: 'Tipo' },
    { label: 'Lideranças', value: 'leader', group: 'Tipo' },
    ...(stats?.city_stats
      ?.filter(city => city.city && city.city.trim() !== '') // Excluir cidades nulas ou vazias
      .map(city => ({
        label: city.city,
        value: city.city,
        group: 'Cidades'
      })) || [])
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // Inicia o carregamento
      try {
        const [statsData, markersData] = await Promise.all([
          mapService.getStats(),
          mapService.getMarkers()
        ]);

        setStats(statsData);
        setMarkers(markersData);
      } catch (error) {
        console.error('Error loading map data:', error);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingScreen message="Carregando mapa eleitoral..." /> {/* Componente de carregamento */}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const handleFilter = async (selected: string[]) => {
    try {
      // Filtra os tipos 'voter' e 'leader' a partir da seleção
      const types = selected.filter(s => ['voter', 'leader'].includes(s));
  
      // Filtra todas as cidades (excluindo 'voter' e 'leader')
      const cities = selected.filter(s => !['voter', 'leader'].includes(s));
  
      // Atualiza os estados com os tipos e as cidades selecionadas
      setSelectedType(types.join(', ') || ''); // Agora suporta múltiplos tipos
      setSelectedCity(cities.join(', ') || '');
  
      // Chama a API com os tipos e todas as cidades
      const markersData = await mapService.getMarkers({
        type: types, // Envia o array de tipos
        cities // Envia o array de cidades
      });
  
      // Atualiza os marcadores no mapa
      setMarkers(markersData);
    } catch (error) {
      console.error('Error filtering markers:', error);
    }
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
          </div>
        </div>
      </div>

      {/* <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">
                {formatNumber(stats?.total_voters || 0)}
              </p>
              <p className="text-sm font-medium text-gray-600">Total Eleitores</p>
              {selectedCity && (
                <p className="text-xs text-blue-600 font-medium mt-2 bg-blue-50 px-3 py-1 rounded-full">
                  {selectedCity}
                </p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-100">
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold text-emerald-600 mb-2">
                {formatNumber(stats?.gender_stats.male || 0)}
              </p>
              <p className="text-sm font-medium text-gray-600">Homens</p>
              <p className="text-xs text-emerald-600 font-medium mt-2 bg-emerald-50 px-3 py-1 rounded-full">
                {stats && stats.gender_stats && stats.total_voters > 0
                  ? Math.round((stats.gender_stats.male / stats.total_voters) * 100)
                  : 0}%
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold text-purple-600 mb-2">
                {formatNumber(stats?.gender_stats.female || 0)}
              </p>
              <p className="text-sm font-medium text-gray-600">Mulheres</p>
              <p className="text-xs text-purple-600 font-medium mt-2 bg-purple-50 px-3 py-1 rounded-full">
                {stats && stats.gender_stats && stats.total_voters > 0
                  ? Math.round((stats.gender_stats.female / stats.total_voters) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div> */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="rounded-xl overflow-hidden">
          <ElectoralMap
            markers={markers}
            onMarkerClick={marker => console.log('Marker clicked:', marker)}
          />
        </div>
      </div>
    </div>
  );
}
