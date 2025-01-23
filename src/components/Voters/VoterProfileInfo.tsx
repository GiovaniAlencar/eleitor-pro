import { Trash2, Edit2, AlertCircle } from 'lucide-react';
import { VoterProfile } from '../../types/api';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/date';
import { formatCEP } from '../../utils/format';

interface VoterProfileInfoProps {
  voter: VoterProfile;
  onDelete: () => void;
  onStatusChange: () => void;
}

export default function VoterProfileInfo({ voter, onDelete, onStatusChange }: VoterProfileInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Contêiner para botões e título */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center mb-4">
        <h3 className="text-lg font-bold mb-4 sm:mb-0">Informações Pessoais</h3>
        <div className="flex flex-wrap gap-2">
          {/* Botão de ativar/desativar */}
          <button
            onClick={onStatusChange}
            className={`flex items-center gap-1 px-4 py-1.5 text-sm ${
              voter.status === 'active'
                ? 'text-yellow-600 hover:text-white border border-yellow-200 hover:bg-yellow-600'
                : 'text-green-600 hover:text-white border border-green-200 hover:bg-green-600'
            } rounded transition-all duration-200`}
          >
            <AlertCircle className="w-4 h-4" />
            {voter.status === 'active' ? 'Desabilitar' : 'Ativar'}
          </button>

          {/* Botão de excluir */}
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-4 py-1.5 text-sm text-red-600 hover:text-white border border-red-200 hover:bg-red-600 rounded transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>

          {/* Botão de editar */}
          <Link
            to={`/eleitores/editar/${voter.id}`}
            className="flex items-center gap-1 px-4 py-1.5 text-sm text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-600 rounded transition-all duration-200"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </Link>
        </div>
      </div>

      {/* Informações do eleitor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 text-sm">Nome</p>
          <p className="font-medium mt-1">{voter.name}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Idade</p>
          <p className="font-medium mt-1">{voter.age} anos</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Data de Nascimento</p>
          <p className="font-medium mt-1">{formatDate(voter.birth_date || '')}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">CEP</p>
          <p className="font-medium mt-1">{formatCEP(voter.zip_code || '')}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Cidade</p>
          <p className="font-medium mt-1">{voter.city}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Estado</p>
          <p className="font-medium mt-1">{voter.state}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-gray-500 text-sm">Endereço</p>
          <p className="font-medium mt-1">{voter.address}, {voter.number}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Bairro</p>
          <p className="font-medium mt-1">{voter.neighborhood}</p>
        </div>
      </div>
    </div>
  );
}

