import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import RegistrationProgress from '../../components/Registration/RegistrationProgress';
import IdentificationStep from '../../components/Registration/Steps/IdentificationStep';
import BirthDateStep from '../../components/Registration/Steps/BirthDateStep';
import PhotoStep from '../../components/Registration/Steps/PhotoStep';
import CredentialsStep from '../../components/Registration/Steps/CredentialsStep';
import TechBackground from '../../components/Common/TechBackground';
import { RegistrationData } from '../../types/registration';
import { authService } from '../../services/auth.service';

const steps = ['Identificação', 'Nascimento', 'Foto', 'Credenciais'];

export default function MultiStepRegister() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<RegistrationData>>({});
  const navigate = useNavigate();

  const handleNext = (stepData: Partial<RegistrationData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    if (currentStep === steps.length - 1) {
      handleSubmit({ ...formData, ...stepData });
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (data: Partial<RegistrationData>) => {
    try {
      const formData = new FormData();
      
      // Format birth date to YYYY-MM-DD
      if (data.birth_date) {
        const [day, month, year] = data.birth_date.split('/');
        formData.append('birth_date', `${year}-${month}-${day}`);
      }

      // Add other fields
      if (data.name) formData.append('name', data.name);
      if (data.email) formData.append('email', data.email);
      if (data.password) formData.append('password', data.password);
      if (data.gender) formData.append('gender', data.gender);
      if (data.position) formData.append('position', data.position);
      
      if (data.voteGoal) {
        console.log(data.voteGoal)
        const rawVoteGoal = String(data.voteGoal).replace(/\D/g, '');
        console.log('rawVoteGoal sem formatação:', rawVoteGoal); // Aqui você pode ver se está funcionando como esperado
        formData.append('voteGoal', rawVoteGoal);
      }
        
      
      // Add photo if exists
      console.log(data.photo)
      if (data.photo instanceof File) {
        formData.append('photo', data.photo);
      }

      await authService.register(formData);
      toast.success('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao realizar cadastro';
      toast.error(errorMessage);
    }
  };

  return (
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
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-[#13db63] to-[#02bde8] rounded-lg">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Criar Conta</h2>
              <p className="text-gray-600">Preencha os dados abaixo</p>
            </div>
          </div>

          <RegistrationProgress currentStep={currentStep} steps={steps} />

          {currentStep === 0 && (
            <IdentificationStep
              onNext={handleNext}
              defaultValues={formData}
            />
          )}

          {currentStep === 1 && (
            <BirthDateStep
              onNext={handleNext}
              onPrevious={handlePrevious}
              defaultValues={formData}
            />
          )}

          {currentStep === 2 && (
            <PhotoStep
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 3 && (
            <CredentialsStep
              onNext={handleNext}
              onPrevious={handlePrevious}
              defaultValues={formData}
            />
          )}
        </div>

        <p className="text-center mt-8 text-blue-100">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-white hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}