import { Search, UserPlus, Download, Trash2, Edit2, Eye, Phone, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../components/Common/Pagination';
import FilterButton from '../../components/Common/FilterButton';
import { useVoters } from '../../hooks/useVoters';
import { useDebounce } from '../../hooks/useDebounce';
import { exportToCSV } from '../../utils/export';
import { voterService } from '../../services/voter.service';
import { getFirstName } from '../../utils/stringUtils';
import { whatsappService } from '../../services/whatsapp.service';
import { profileService } from '../../services/profile.service';
import AlertDialog from '../../components/Common/AlertDialog';
import LoadingScreen from '../../components/Common/LoadingScreen';

export default function ListaEleitores() {
  const [search, setSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cities, setCities] = useState<string[]>([]);
  const { voters, loading, error, totalPages, loadVoters, deleteVoter } = useVoters();
  const debouncedSearch = useDebounce(search, 500);
  const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null);

  const [role, setRole] = useState<string>(''); // Estado para armazenar a role
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getProfile();

        setRole(profile.role); // Assume que a resposta tem um campo 'role'
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      }
    };

    fetchProfile();
  }, []);

  // Carregar as cidades da API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await voterService.getCityStatistics();
        const cityList = response?.city_stats?.map((city: { city: string }) => city.city);
        setCities(cityList || []);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  // Atualizar os dados ao mudar filtros, busca ou página
  useEffect(() => {
    const filters = {
      search: debouncedSearch,
      status: selectedFilters.find(f => ['active', 'inactive'].includes(f)),
      city: selectedFilters.filter(f => cities.includes(f)),
      page: currentPage,
    };

    loadVoters(filters);
  }, [debouncedSearch, selectedFilters, currentPage, cities, loadVoters]);

  // Configurar opções de filtro dinamicamente
  const filterOptions = [
    { label: 'Ativos', value: 'active', group: 'Status' },
    { label: 'Inativos', value: 'inactive', group: 'Status' },
    ...(cities.length > 0
      ? cities.map(city => ({
        label: city,
        value: city,
        group: 'Cidades',
      }))
      : []),
  ];

  const handleDelete = async (id: number) => {
    if (await deleteVoter(id)) {
      loadVoters({
        search: debouncedSearch,
        status: selectedFilters.find(f => ['active', 'inactive'].includes(f)),
        city: selectedFilters.filter(f => cities.includes(f)),
        page: currentPage,
      });
    }
  };

  const handleFilter = (selected: string[]) => {
    setSelectedFilters(selected);
    setCurrentPage(1); // Reiniciar para a primeira página ao aplicar novo filtro
  };

  const handleExport = async () => {
    try {
      const data = await voterService.exportVoters();
      const formattedData = data.map(voter => ({
        Nome: voter.name,
        Email: voter.email,
        Cidade: voter.city,
        Status: voter.status === 'active' ? 'Ativo' : 'Inativo',
      }));
      exportToCSV(formattedData, `eleitores-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Error exporting voters:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setIsImporting(true);
    try {
      await voterService.importVoters(e.target.files[0]);
      loadVoters({
        search: debouncedSearch,
        status: selectedFilters.find(f => ['active', 'inactive'].includes(f)),
        city: selectedFilters.filter(f => cities.includes(f)),
        page: currentPage,
      });
    } catch (error) {
      console.error('Erro ao importar eleitores:', error);
    } finally {
      setIsImporting(false); // Finaliza o carregamento
    }
  };


  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const handleWhatsAppClick = (whatsapp) => {
    if (!whatsapp) {
      console.warn('Número de WhatsApp não disponível.');
      return;
    }
  
    const link = whatsappService.generateLink(whatsapp);
    window.open(link, '_blank');
  };

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
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <FilterButton options={filterOptions} onFilter={handleFilter} />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {role === 'user' ? (
            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full md:w-auto">
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isImporting} // Desabilitar botão durante a importação
              />
              {isImporting ? (
                <LoadingScreen message="Importando..." className="w-5 h-5" /> // Indicador de carregamento
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>IMPORTAR</span>
                </>
              )}
            </label>
          ) : (
            <Link
              to="/eleitores/novo"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full md:w-auto"
            >
              <UserPlus className="w-5 h-5" />
              <span>CADASTRAR</span>
            </Link>
          )}
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
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Eleitor</span>
                </th>
                <th className="px-6 py-3 bg-gradient-to-r from-gray-50 to-white text-left">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Email</span>
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
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <LoadingScreen message="Carregando eleitores..." />
                  </td>
                </tr>
              ) : voters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhum eleitor encontrado
                  </td>
                </tr>
              ) : (
                voters.map((voter) => (
                  <tr key={voter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserPlus className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="font-medium text-sm text-gray-900">
                          {getFirstName(voter.name)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{voter.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{voter.city}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${voter.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {voter.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowDeleteDialog(voter.id)}
                          className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/voter/${voter.id}`}
                          className="p-2 text-blue-500 hover:text-white hover:bg-blue-500 rounded-full transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/eleitores/editar/${voter.id}`}
                          className="p-2 text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-full transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleWhatsAppClick(voter.whatsapp)}
                          className="p-2 text-green-500 hover:text-white hover:bg-green-500 rounded-full transition-colors"
                          title="WhatsApp"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <AlertDialog
          isOpen={showDeleteDialog !== null}
          onClose={() => setShowDeleteDialog(null)}
          onConfirm={async () => {
            if (showDeleteDialog) {
              await handleDelete(showDeleteDialog);
              setShowDeleteDialog(null);
            }
          }}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir este eleitor? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          type="danger"
        />
      </div>
    </div>
  );
}
