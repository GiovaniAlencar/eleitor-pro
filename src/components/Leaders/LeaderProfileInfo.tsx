import { Trash2, Edit2 } from 'lucide-react';
import { LeaderProfile } from '../../types/api';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/date';
import { formatCEP } from '../../utils/format';

interface LeaderProfileInfoProps {
  leader: LeaderProfile;
  onDelete: () => void;
}

export default function LeaderProfileInfo({ leader, onDelete }: LeaderProfileInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-xl font-bold">Informações Pessoais</h3>
        <div className="flex gap-3">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-6 py-2.5 text-red-600 hover:text-white border border-red-200 hover:bg-red-600 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-red-100"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>
          <Link
            to={`/lideranca/editar/${leader.id}`}
            className="flex items-center gap-2 px-6 py-2.5 text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-600 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-100"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <p className="font-medium mt-1">{leader.children} filho(s)</p>
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