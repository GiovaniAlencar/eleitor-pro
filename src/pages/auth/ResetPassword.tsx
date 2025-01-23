import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { authService } from '../../services/auth.service';
import { Lock, AlertCircle } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  passwordConfirmation: z.string().min(8, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'As senhas não coincidem',
  path: ['passwordConfirmation'], // Aponta o erro no campo de confirmação
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Token de redefinição inválido ou ausente');
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword({
        token,
        email: searchParams.get('email'), // Certifique-se de passar o email no link
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      });
      toast.success('Senha redefinida com sucesso! Faça login.');
    } catch (error) {
      toast.error('Erro ao redefinir a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0b1728] to-[#102a4c] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <img src="/logo.svg" alt="Eleitor Pro" className="h-24 mx-auto mb-8" />
          <h1 className="text-3xl font-bold text-white">Redefinir Senha</h1>
          <p className="text-blue-100 mt-2">
            Insira sua nova senha para redefini-la.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                {...register('password')}
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="********"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirme a Nova Senha</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                {...register('passwordConfirmation')}
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="********"
              />
            </div>
            {errors.passwordConfirmation && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#13db63] to-[#02bde8] hover:from-[#02bde8] hover:to-[#13db63] text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}
