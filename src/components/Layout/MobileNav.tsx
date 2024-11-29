import { Home, Users, UserPlus, Map, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MobileNavProps {
  onMenuClick: () => void;
}

export default function MobileNav({ onMenuClick }: MobileNavProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center ${
            isActive('/') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link
          to="/eleitores"
          className={`flex flex-col items-center ${
            isActive('/eleitores') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Users className="w-6 h-6" />
          <span className="text-xs mt-1">Eleitores</span>
        </Link>
        <Link
          to="/lideranca"
          className={`flex flex-col items-center ${
            isActive('/lideranca') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <UserPlus className="w-6 h-6" />
          <span className="text-xs mt-1">Lideranças</span>
        </Link>
        <Link
          to="/mapa"
          className={`flex flex-col items-center ${
            isActive('/mapa') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Map className="w-6 h-6" />
          <span className="text-xs mt-1">Mapa</span>
        </Link>
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