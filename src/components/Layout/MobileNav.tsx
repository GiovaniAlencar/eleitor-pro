import { Home, Users, UserPlus, MapPin, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { profileService } from '../../services/profile.service';

interface MobileNavProps {
  onMenuClick: () => void;
}

export default function MobileNav({ onMenuClick }: MobileNavProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const [role, setRole] = useState<string>(''); // Estado para armazenar a role

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

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center ${isActive('/') ? 'text-green-600' : 'text-gray-600'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>

        {/* Exibe Users apenas para Admin */}
        {role === 'admin' && (
          <Link
            to="/usuarios"
            className={`flex flex-col items-center ${isActive('/users') ? 'text-green-600' : 'text-gray-600'}`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Users</span>
          </Link>
        )}


        {/* Exibe Lideranças apenas para usuário que não for admin */}
        {role !== 'admin' && role !== 'leader' && (
          <Link
            to="/lideranca"
            className={`flex flex-col items-center ${isActive('/lideranca') ? 'text-green-600' : 'text-gray-600'}`}
          >
            <UserPlus className="w-6 h-6" />
            <span className="text-xs mt-1">Lideranças</span>
          </Link>
        )}

        {/* Exibe Eleitores apenas para Leader */}
        {role !== 'admin' && (
          <Link
            to="/eleitores"
            className={`flex flex-col items-center ${isActive('/eleitores') ? 'text-green-600' : 'text-gray-600'}`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Eleitores</span>
          </Link>
        )}

           {/* Exibe Mapa apenas para usuário que não for admin */}
           {role !== 'admin' && (
          <Link
            to="/mapa"
            className={`flex flex-col items-center ${isActive('/mapa') ? 'text-green-600' : 'text-gray-600'}`}
          >
            <MapPin className="w-6 h-6" />
            <span className="text-xs mt-1">Mapa</span>
          </Link>
        )}


        <button
          onClick={onMenuClick}
          className="flex flex-col items-center text-gray-600"
        >
          <Menu className="w-6 h-6" />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </div>
    </nav>
  );
}
