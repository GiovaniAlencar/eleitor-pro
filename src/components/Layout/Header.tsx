import { Menu, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationDropdown from '../Common/NotificationDropdown';
import ProfileDropdown from '../Common/ProfileDropdown';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-[#0b1728] to-[#102a4c] text-white h-16 fixed w-full top-0 left-0 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex-1 flex items-center lg:flex-initial">
          {/* <button
            onClick={onMenuClick}
            className="hidden lg:block mr-4 hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button> */}

          <div className="flex-1 flex justify-center lg:justify-start">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="Eleitor Pro" className="h-14 w-auto" />
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-6">
          {/* <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              className="bg-white/10 text-white placeholder-white/60 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
          </div> */}

          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}