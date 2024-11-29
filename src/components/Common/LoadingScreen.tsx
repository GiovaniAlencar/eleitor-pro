import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Carregando...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-navy-900 via-blue-800 to-cyan-700 flex items-center justify-center z-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto" />
        <p className="mt-4 text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}