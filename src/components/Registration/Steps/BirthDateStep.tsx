import { Calendar, AlertCircle, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { birthDateSchema, BirthDateData } from '../../../types/registration';
import MaskedInput from '../../Common/MaskedInput';
import { masks } from '../../../utils/masks';

interface BirthDateStepProps {
  onNext: (data: BirthDateData) => void;
  onPrevious: () => void;
  defaultValues?: BirthDateData;
}

export default function BirthDateStep({ onNext, onPrevious, defaultValues }: BirthDateStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BirthDateData>({
    resolver: zodResolver(birthDateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <div className="relative">
          <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <MaskedInput
            {...register('birth_date')}
            mask={masks.date.mask}
            definitions={masks.date.definitions}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="DD/MM/AAAA"
          />
        </div>
        {errors.birth_date && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.birth_date.message}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onPrevious}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </button>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#13db63] to-[#02bde8] hover:from-[#02bde8] hover:to-[#13db63] text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:translate-y-[-1px] hover:shadow-lg"
        >
          Próximo
        </button>
      </div>
    </form>
  );
}