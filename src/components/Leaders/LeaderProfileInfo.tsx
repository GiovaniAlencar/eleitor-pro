import { Trash2, Edit2, AlertCircle } from 'lucide-react';
import { LeaderProfile } from '../../types/api';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/date';
import { formatCEP } from '../../utils/format';

interface LeaderProfileInfoProps {
  leader: LeaderProfile;
  onDelete: () => void;
  onStatusChange: () => void; // Callback para alterar o status do líder
}

export default function LeaderProfileInfo({ leader, onDelete, onStatusChange }: LeaderProfileInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Botões no mobile ficam acima do título */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center mb-4">
        <h3 className="text-lg font-bold mb-4 sm:mb-0">Informações Pessoais</h3>
        <div className="flex flex-wrap gap-2 justify-start">
          {/* Botão de ativar/desabilitar */}
          <button
            onClick={onStatusChange}
            className={`flex items-center gap-1 px-4 py-2 text-sm ${
              leader.status === 'active'
                ? 'text-yellow-600 hover:text-white border border-yellow-200 hover:bg-yellow-600'
                : 'text-green-600 hover:text-white border border-green-200 hover:bg-green-600'
            } rounded transition-all duration-200`}
          >
            <AlertCircle className="w-4 h-4" />
            {leader.status === 'active' ? 'Desabilitar' : 'Ativar'}
          </button>

          {/* Botão de excluir */}
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-4 py-2 text-sm text-red-600 hover:text-white border border-red-200 hover:bg-red-600 rounded transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>

          {/* Botão de editar */}
          <Link
            to={`/lideranca/editar/${leader.id}`}
            className="flex items-center gap-1 px-4 py-2 text-sm text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-600 rounded transition-all duration-200"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 text-sm">Nome</p>
          <p className="font-medium mt-1">{leader.name}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Idade</p>
          <p className="font-medium mt-1">{leader.age} anos</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Data de Nascimento</p>
          <p className="font-medium mt-1">{formatDate(leader.birth_date || '')}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Estado Civil</p>
          <p className="font-medium mt-1">{leader.marital_status}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Filhos</p>
          <p className="font-medium mt-1">{leader.children || 0} filho(s)</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">CEP</p>
          <p className="font-medium mt-1">{formatCEP(leader.zip_code || '')}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Cidade</p>
          <p className="font-medium mt-1">{leader.city}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Estado</p>
          <p className="font-medium mt-1">{leader.state}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-gray-500 text-sm">Endereço</p>
          <p className="font-medium mt-1">{leader.full_address}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Bairro</p>
          <p className="font-medium mt-1">{leader.neighborhood}</p>
        </div>
      </div>
    </div>
  );
}



