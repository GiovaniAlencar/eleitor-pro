import { Camera } from 'lucide-react';
import { WhatsappIcon } from '../Icons/WhatsappIcon';
import { whatsappService } from '../../services/whatsapp.service';
import { LeaderProfile } from '../../types/api';

interface LeaderProfileHeaderProps {
  leader: LeaderProfile;
  onPhotoChange: (file: File) => Promise<void>;
}

export default function LeaderProfileHeader({ leader, onPhotoChange }: LeaderProfileHeaderProps) {
  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onPhotoChange(file);
    }
  };

  const handleWhatsAppClick = () => {
    if (leader.whatsapp) {
      const link = whatsappService.generateLink(leader.whatsapp);
      window.open(link, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="relative inline-block">
        <img
          src={leader.photo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
          alt={leader.name}
          className="w-32 h-32 rounded-full mx-auto ring-4 ring-white shadow-xl object-cover"
        />
        <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          <Camera className="w-5 h-5 text-gray-600" />
        </label>
      </div>

      <h2 className="text-2xl font-bold mt-4">{leader.name}</h2>
      <p className="text-gray-500">{leader.role || 'Liderança de Campanha'}</p>

      <button
        onClick={handleWhatsAppClick}
        className="w-full mt-6 bg-green-500 text-white rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
      >
        <WhatsappIcon className="w-5 h-5" />
        Whatsapp
      </button>

      <div className="grid grid-cols-2 gap-4 mt-6 text-center">
        <div className="bg-gray-50 rounded-lg p-4">
          <span className="text-3xl font-bold text-gray-900">
            {leader.statistics.voters_count}
          </span>
          <p className="text-gray-500 text-sm">Eleitores</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <span className="text-3xl font-bold text-gray-900">
            {leader.statistics.meetings_count}
          </span>
          <p className="text-gray-500 text-sm">Reuniões</p>
        </div>
      </div>
    </div>
  );
}