import { TrendingUp, Users, MapPin, Calculator, Timer, User, UserPlus } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import GrowthChart from '../components/Dashboard/GrowthChart';
import { useDashboard } from '../hooks/useDashboard';
import { useEffect, useState } from 'react';
import { profileService } from '../services/profile.service';
import LoadingScreen from '../components/Common/LoadingScreen'; // Importando o componente de Loading

export default function Home() {
  const { stats, growthData, loading, error } = useDashboard();
  const [userName, setUserName] = useState<string>(''); // Estado para armazenar o nome
  const [photoUrl, setPhotoUrl] = useState<string>(''); // Estado para armazenar a URL da foto
  const [position, setPosition] = useState<string>(''); // Estado para armazenar o Cargo
  const [voteGoal, setVoteGoal] = useState<string>(''); // Estado para armazenar o Cargo
  const [role, setRole] = useState<string>(''); // Estado para armazenar a role

  // Carregar o nome real e a foto ao montar o componente
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getProfile(); // Chama o serviço para obter os dados do perfil
        setUserName(profile.name); // Assume que a resposta tem um campo 'name' com o nome 
        setPosition(profile.position); // Assume que a resposta tem um campo 'position' 
        setPhotoUrl(profile.photo_url); // Assume que a resposta tem um campo 'photo_url' com a URL da foto
        setVoteGoal(profile.voteGoal); // Assume que a resposta tem um campo 'voteGoal' 
        setRole(profile.role); // Assume que a resposta tem um campo 'role'
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      }
    };

    fetchProfile();
  }, []);

  // Exibe a tela de loading enquanto os dados estão sendo carregados
  if (loading) {
    return <LoadingScreen message="Carregando dados do dashboard..." />;
  }

  // Exibe uma mensagem de erro caso ocorra algum problema ao carregar os dados
  if (error || !stats || !growthData) {
    return <div>Erro ao carregar dados do dashboard.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Exibe a foto da deputada, se disponível */}
            <img
              src={
                photoUrl
                  ? `${import.meta.env.VITE_STORAGE_URL}/${photoUrl}`
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-12 h-12 rounded-full ring-2 ring-white shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full ring-2 ring-white" />
          </div>
          <div>
            <h2 className="text-gray-600">Bem vindo(a)</h2>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{userName ? `${userName}` : 'Carregando nome...'}</h2>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {role === 'admin' ? (
        // Exibe apenas estatísticas para administradores
        <div className="grid gap-6 mb-6 grid-cols-1 md:grid-cols-4">
          <StatsCard
            title="Usuários Cadastrados"
            value={stats.total_usuarios || 0}
            icon={<Users className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Aguardando Aprovação"
            value={stats.usuarios_pendentes || 0}
            icon={<Timer className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Lideranças"
            value={stats.total_liderancas || 0}
            icon={<Users className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Eleitores"
            value={stats.total_eleitores || 0}
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            color="green"
          />
        </div>
      ) : role === 'leader' ? (
        // Estatísticas para líderes
        <div className="grid gap-6 mb-6 grid-cols-1 md:grid-cols-4">
          <StatsCard
            title="Meta de Eleitores"
            value={new Intl.NumberFormat('pt-BR').format(voteGoal || 0)}
            icon={<Calculator className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Total de Eleitores"
            value={stats.total_eleitores || 0}
            icon={<Users className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Eleitores Homem"
            value={stats.eleitores_homem || 0}
            icon={<Users className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Eleitores Mulher"
            value={stats.eleitores_mulher || 0}
            icon={<Users className="w-6 h-6 text-white" />}
            color="green"
          />
        </div>
      ) : role === 'user' ? (
        // Estatísticas para usuários com a ordem solicitada e responsividade no mobile
        <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Meta de Eleitores"
            value={new Intl.NumberFormat('pt-BR').format(voteGoal || 0)}
            icon={<Calculator className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Total de Eleitores"
            value={stats.total_eleitores || 0}
            icon={<Users className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Eleitores Homem"
            value={stats.eleitores_homem || 0}
            icon={<Users className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Eleitores Mulher"
            value={stats.eleitores_mulher || 0}
            icon={<Users className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Cidades"
            value={stats.total_cidades || 0}
            icon={<MapPin className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Total Lideranças"
            value={stats.total_liderancas || 0}
            icon={<UserPlus className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Lideranças Homem"
            value={stats.liderancas_homem || 0}
            icon={<UserPlus className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Lideranças Mulher"
            value={stats.liderancas_mulher || 0}
            icon={<UserPlus className="w-6 h-6 text-white" />}
            color="green"
          />
        </div>
      ) : (
        // Estatísticas para qualquer outro role
        <div className="grid gap-6 mb-6 grid-cols-1 md:grid-cols-4">
          <StatsCard
            title="Meta de Eleitores"
            value={new Intl.NumberFormat('pt-BR').format(voteGoal || 0)}
            icon={<Calculator className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Total de Eleitores"
            value={stats.total_eleitores || 0}
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Eleitores Homem"
            value={stats.eleitores_homem || 0}
            icon={<User className="w-6 h-6 text-white" />}
            color="green"
          />
          <StatsCard
            title="Eleitores Mulher"
            value={stats.eleitores_mulher || 0}
            icon={<User className="w-6 h-6 text-white" />}
            color="green"
          />
        </div>
      )}

      {role !== 'admin' && (
        <div className="grid grid-cols-1 gap-6">
          <GrowthChart />
        </div>
      )}
    </div>
  );
}

