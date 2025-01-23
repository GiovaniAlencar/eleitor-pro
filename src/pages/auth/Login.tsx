import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../../components/Common/LoadingScreen';
import CookieConsent from '../../components/Common/CookieConsent';
import TechBackground from '../../components/Common/TechBackground';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
  remember: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  if (user) {
    return <Navigate to="/" />;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      // toast.error('Email ou Senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreen message="Entrando..." />}

      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        <TechBackground />

        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1728] to-[#102a4c] text-white shadow-lg shadow-cyan-500/30" />

        <div className="w-full max-w-md relative z-10">
          <img
            src="/logo.svg"
            alt="Eleitor Pro"
            className="w-full max-w-[280px] h-auto mx-auto mb-8 transform hover:scale-105 transition-transform duration-300"
          />

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-[#13db63] to-[#02bde8] rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Bem-vindo de volta!</h2>
                <p className="text-gray-600 text-sm">Entre para continuar</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    {...register('remember')}
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Lembrar-me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Esqueceu a Senha?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#13db63] to-[#02bde8] hover:from-[#02bde8] hover:to-[#13db63] text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:translate-y-[-1px] hover:shadow-lg"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>

          <p className="text-center mt-8 text-blue-100">
            Novo aqui?{' '}
            <Link to="/register" className="font-medium text-white hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      <CookieConsent />
    </>
  );
}