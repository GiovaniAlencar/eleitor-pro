import { Pencil, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { profileService } from '../../services/profile.service';
import { User } from '../../types/api';
import LoadingScreen from '../../components/Common/LoadingScreen';

export default function Configuracoes() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setUser(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <LoadingScreen message="Carregando perfil..." />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">Gerencie suas configurações de perfil</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex flex-col items-center">
          <img
            src={`${import.meta.env.VITE_STORAGE_URL}/${user.photo_url}` || "https://via.placeholder.com/150"} 
            alt="Perfil"
            className="w-32 h-32 rounded-full ring-4 ring-white shadow-sm object-cover"
          />
          <h2 className="text-2xl font-bold mt-4">{user?.name}</h2>
          {/* <p className="text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Liderança'}</p> */}

          <div className="flex gap-4 mt-6">
            <Link
              to="/configuracoes/editar-perfil"
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-5 h-5 mr-2" />
              Editar
            </Link>
            <Link
              to="/configuracoes/mudar-Senha"
              className="flex items-center px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <Lock className="w-5 h-5 mr-2" />
              Senha
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium mt-1">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">WhatsApp</p>
              <p className="font-medium mt-1">{user?.whatsapp}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cidade</p>
              <p className="font-medium mt-1">{user?.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Endereço</p>
              <p className="font-medium mt-1">{user?.address}, Nº {user?.number}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}