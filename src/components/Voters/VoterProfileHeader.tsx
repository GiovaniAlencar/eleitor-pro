import { WhatsappIcon } from '../Icons/WhatsappIcon';
import { whatsappService } from '../../services/whatsapp.service';
import { VoterProfile } from '../../types/api';

interface VoterProfileHeaderProps {
  voter: VoterProfile;
}

export default function VoterProfileHeader({ voter }: VoterProfileHeaderProps) {
  const handleWhatsAppClick = () => {
    if (voter.whatsapp) {
      const link = whatsappService.generateLink(voter.whatsapp);
      window.open(link, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold mt-4">{voter.name}</h2>
      <p className="text-gray-500">{voter.role || 'Eleitor'}</p>

      <button
        onClick={handleWhatsAppClick}
        className="w-full mt-6 bg-green-500 text-white rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
      >
        <WhatsappIcon className="w-5 h-5" />
        Whatsapp
      </button>

      {/* <div className="grid grid-cols-2 gap-4 mt-6 text-center">
        <div className="bg-gray-50 rounded-lg p-4">
          <span className="text-3xl font-bold text-gray-900">
            {voter.statistics?.supporters_count || 0}
          </span>
          <p className="text-gray-500 text-sm">Apoiadores</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <span className="text-3xl font-bold text-gray-900">
            {voter.voteGoal || 0}
          </span>
          <p className="text-gray-500 text-sm">Meta de votos</p>
        </div>
      </div> */}
    </div>
  );
}
