import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { credentialsSchema, CredentialsData } from '../../../types/registration';

interface CredentialsStepProps {
  onNext: (data: CredentialsData) => void;
  onPrevious: () => void;
  defaultValues?: Partial<CredentialsData>;
}

export default function CredentialsStep({ onNext, onPrevious, defaultValues }: CredentialsStepProps) {
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmation: false
  });

  // Controle de envio
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CredentialsData>({
    resolver: zodResolver(credentialsSchema),
    defaultValues
  });

  const togglePasswordVisibility = (field: 'password' | 'confirmation') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleFormSubmit = async (data: CredentialsData) => {
    if (isSubmitting) return; // Evitar duplo clique

    setIsSubmitting(true); // Desabilita o botão ao enviar o formulário
    console.log('Submetendo os dados:', data);

    // Simula uma chamada assíncrona (API, por exemplo)
    setTimeout(() => {
      // Após a submissão, chamamos o onNext
      onNext(data);
      setIsSubmitting(false); // Reabilita o botão
    }, 7000); // Simula um atraso de 1 segundo para a submissão
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <div className="relative">
          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            {...register('email')}
            type="email"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="seu@email.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="relative">
          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            {...register('password')}
            type={showPasswords.password ? 'text' : 'password'}
            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="********"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('password')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.password ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <div className="relative">
          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            {...register('password_confirmation')}
            type={showPasswords.confirmation ? 'text' : 'password'}
            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="********"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirmation')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.confirmation ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password_confirmation && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.password_confirmation.message}
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
          disabled={isSubmitting} // Desabilita o botão quando a submissão estiver em andamento
          className={`flex-1 bg-gradient-to-r from-[#13db63] to-[#02bde8] hover:from-[#02bde8] hover:to-[#13db63] text-white py-3 rounded-xl font-medium transition-all ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {isSubmitting ? 'Aguarde...' : 'Finalizar'}
        </button>
      </div>
    </form>
  );
}
