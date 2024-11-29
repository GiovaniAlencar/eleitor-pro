import { Home, Users, Map, Settings, LogOut, UserPlus, ChevronLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onCollapse: () => void;
  onClose: () => void;
}

export default function Sidebar({ isOpen, isCollapsed, onCollapse, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: UserPlus, label: 'Liderança', path: '/lideranca' },
    { icon: Users, label: 'Eleitores', path: '/eleitores' },
    { icon: Map, label: 'Mapa Eleitoral', path: '/mapa' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' }
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    // Add logout logic here
    onClose();
  };

  const sidebarClasses = `
    fixed top-16 bottom-0 bg-white shadow-lg transition-all duration-300
    ${isCollapsed ? 'w-20' : 'w-64'}
    lg:left-0
    ${isOpen ? 'left-0' : '-left-64'}
    ${!isOpen && 'lg:block hidden'}
    z-40
  `;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        />
      )}
      <aside className={sidebarClasses}>
        <button
          onClick={onCollapse}
          className="absolute -right-3 top-4 bg-white rounded-full p-1 shadow-lg hover:bg-gray-50 transition-colors hidden lg:block"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
        
        <nav className="p-4 pb-20 lg:pb-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleMenuItemClick(item.path)}
              className={`flex items-center p-3 mb-2 rounded-lg transition-all w-full ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${!isCollapsed && 'mr-3'}`} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
          <button 
            onClick={handleLogout}
            className="flex items-center p-3 w-full text-left text-gray-700 hover:bg-gray-50 rounded-lg mt-auto transition-colors"
          >
            <LogOut className={`w-5 h-5 ${!isCollapsed && 'mr-3'}`} />
            {!isCollapsed && <span>Deslogar</span>}
          </button>
        </nav>
      </aside>
    </>
  );
}