import { Search, UserPlus, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../components/Common/Pagination';
import FilterButton from '../../components/Common/FilterButton';
import LeaderActions from '../../components/Leaders/LeaderActions';
import { getFirstName } from '../../utils/stringUtils';
import { useLeaders } from '../../hooks/useLeaders';
import { exportToCSV } from '../../utils/export';
import { leaderService } from '../../services/leader.service';
import { useDebounce } from '../../hooks/useDebounce';
import LoadingScreen from '../../components/Common/LoadingScreen'; // Importando o LoadingScreen

export default function ListaLiderancas() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]); // Novo estado para armazenar as cidades
  const { leaders, loading, error, totalPages, loadLeaders, deleteLeader } = useLeaders();
  const debouncedSearch = useDebounce(search, 500);

  const [isFilterChanging, setIsFilterChanging] = useState(false); // Adicionado para controle de filtros


  // Carregar as cidades dinâmicas da API (substitua por sua API real)
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await leaderService.getCityStatistics(); // Supondo que a função que obtém as cidades da API seja essa
        const cityList = response?.city_stats?.map((city: { city: string }) => city.city);
        setCities(cityList || []); // Atualizar o estado com as cidades
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  const filterOptions = [
    { label: 'Ativos', value: 'active', group: 'Status' },
    { label: 'Inativos', value: 'inactive', group: 'Status' },
    ...(cities.length > 0
      ? cities.map(city => ({
        label: city,
        value: city,
        group: 'Cidades'
      }))
      : [])
  ];

  useEffect(() => {
    loadLeaders({
      page: currentPage,
      search: debouncedSearch,
      status: selectedFilters.find(f => ['active', 'inactive'].includes(f)),
      city: selectedFilters.filter(f => cities.includes(f))
    });
  }, [currentPage, debouncedSearch, selectedFilters, cities, loadLeaders]);

  const handleDelete = async (id: number) => {
    const success = await deleteLeader(id);
    if (success) {
      loadLeaders({
        page: currentPage,
        search: debouncedSearch,
        status: selectedFilters.find(f => ['active', 'inactive'].includes(f))
      });
    }
  };

  const handleFilter = (selected: string[]) => {
    setSelectedFilters(selected);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      const data = await leaderService.exportLeaders();
      const formattedData = data.map(leader => ({
        Nome: leader.name,
        Email: leader.email,
        Whatsapp: leader.whatsapp,
        Cidade: leader.city,
        Status: leader.status === 'active' ? 'Ativo' : 'Inativo',
        'Total Eleitores': leader.voters_count
      }));

      exportToCSV(formattedData, `liderancas-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Error exporting leaders:', error);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-96">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por nome, email ou cidade..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <FilterButton options={filterOptions} onFilter={handleFilter} />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link
            to="/lideranca/novo"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full md:w-auto"
          >
            <UserPlus className="w-5 h-5" />
            <span>CADASTRAR</span>
          </Link>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2 text-cyan-500 bg-white border border-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors w-full md:w-auto"
          >
            <Download className="w-5 h-5" />
            <span>EXPORTAR</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gradient-to-r from-gray-50 to-white text-left">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Liderança</span>
                </th>
                <th className="px-6 py-3 bg-gradient-to-r from-gray-50 to-white text-left">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Eleitores</span>
                </th>
                <th className="px-6 py-3 bg-gradient-to-r from-gray-50 to-white text-left">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Cidade</span>
                </th>
                <th className="px-6 py-3 bg-gradient-to-r from-gray-50 to-white text-left">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Status</span>
                </th>
                <th className="px-6 py-3 bg-gradient-to-r from-gray-50 to-white text-right">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Ação</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    <LoadingScreen message="Carregando lideranças..." />
                  </td>
                </tr>
              ) : leaders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma liderança encontrada
                  </td>
                </tr>
              ) : (
                leaders.map((leader) => (
                  <tr key={leader.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserPlus className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="font-medium text-sm text-gray-900">{getFirstName(leader.name)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{leader.voters_count}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{leader.city}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${leader.status === 'active'
                          ? 'text-green-700 bg-green-100'
                          : 'text-red-700 bg-red-100'
                          }`}
                      >
                        {leader.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <LeaderActions id={leader.id} whatsapp={leader.whatsapp} onDelete={handleDelete} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
