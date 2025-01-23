import { User, AlertCircle, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { identificationSchema, IdentificationData } from '../../../types/registration';
import { useState } from 'react';

interface IdentificationStepProps {
  onNext: (data: IdentificationData) => void;
  defaultValues?: IdentificationData;
}

export default function IdentificationStep({ onNext, defaultValues }: IdentificationStepProps) {
  const [formattedVoteGoal, setFormattedVoteGoal] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<IdentificationData>({
    resolver: zodResolver(identificationSchema),
    defaultValues,
  });

  const handleVoteGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
    const formatted = new Intl.NumberFormat('pt-BR').format(Number(rawValue)); // Formata como 5.000
    setFormattedVoteGoal(formatted);

  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Campo Nome */}
      <div>
        <div className="relative">
          <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            {...register('name')}
            type="text"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition-all"
            placeholder="Nome completo"
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Campo Position */}
      <div>
        <div className="relative">
        <select
            {...register('position', {
              required: 'Selecione uma posição',
            })}
            defaultValue=""
            style={{
              height: window.innerWidth <= 768 ? '45px' : 'auto', // Altura maior apenas para telas menores
              fontSize: window.innerWidth <= 768 ? '16px' : '14px', // Ajusta o tamanho da fonte também
            }}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="" disabled>Selecione um cargo</option>
            <option value="Presidente da República">Presidente da República</option>
            <option value="Governador">Governador</option>
            <option value="Senador">Senador</option>
            <option value="Deputado Federal">Deputado Federal</option>
            <option value="Deputado Estadual">Deputado Estadual</option>
            <option value="Deputado Distrital">Deputado Distrital</option>
            <option value="Prefeito">Prefeito</option>
            <option value="Vereador">Vereador</option>
            <option value="Assessor">Assessor</option>
          </select>
        </div>
        {errors.position && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.position.message}
          </p>
        )}
      </div>

      {/* Campo Vote Goal */}
      <div>
        <div className="relative">
          <input
            {...register('voteGoal', {
              required: 'Meta de votos é obrigatória',
              validate: value => value > 0 || 'A meta de votos deve ser maior que zero',
            })}
            type="text"
            value={formattedVoteGoal}
            onChange={handleVoteGoalChange}
            className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Meta de votos"
          />
        </div>
        {errors.voteGoal && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.voteGoal.message}
          </p>
        )}
      </div>

      {/* Campo Gênero */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              {...register('gender')}
              type="radio"
              value="male"
              className="w-5 h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 text-blue-500"
            />
            <UserRound className="w-5 h-5 text-blue-500" />
            <span className="text-sm md:text-base lg:text-sm">Masculino</span>
          </label>
          <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              {...register('gender')}
              type="radio"
              value="female"
              className="w-5 h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 text-pink-500"
            />
            <UserRound className="w-5 h-5 text-pink-600" />
            <span className="text-sm md:text-base lg:text-sm">Feminino</span>
          </label>
        </div>
        {errors.gender && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.gender.message}
          </p>
        )}
      </div>

      {/* Botão */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#13db63] to-[#02bde8] hover:from-[#02bde8] hover:to-[#13db63] text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:translate-y-[-1px] hover:shadow-lg"
      >
        Próximo
      </button>
    </form>
  );
}
