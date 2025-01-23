import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { authService } from '../../services/auth.service';
import ReCAPTCHA from 'react-google-recaptcha';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // if (!recaptchaValue) {
    //   toast.error('Por favor, complete o reCAPTCHA');
    //   return;
    // }

    try {
      setLoading(true);
      await authService.forgotPassword(data.email, recaptchaValue);
      setEmailSent(true);
      toast.success('Email de recuperação enviado com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-r from-[#0b1728] to-[#102a4c] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <img src="/logo.svg" alt="Eleitor Pro" className="h-24 mx-auto mb-8" />
          <h1 className="text-3xl font-bold text-white">Recuperar Senha</h1>
          <p className="text-blue-100 mt-2">
            Digite seu email para receber as instruções de recuperação
          </p>
        </div>

        {emailSent ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Email Enviado!</h2>
            <p className="text-gray-600 mb-8">
              Verifique sua caixa de entrada e siga as instruções para recuperar sua Senha.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            {/* <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6Lf1eowqAAAAAJ72Ow6O0n7p7Pp6CXUVrhHxp9bG"
                onChange={(value) => setRecaptchaValue(value)}
              />
            </div> */}

            <button
              type="submit"
              // disabled={loading || !recaptchaValue}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#13db63] to-[#02bde8]  hover:from-[#02bde8] hover:to-[#13db63] text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Email'}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Voltar para o login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}