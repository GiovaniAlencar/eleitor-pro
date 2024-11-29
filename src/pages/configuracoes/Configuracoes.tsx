import { Pencil, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Configuracoes() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">Gerencie suas configurações de perfil</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex flex-col items-center">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
            alt="Perfil"
            className="w-32 h-32 rounded-full ring-4 ring-white shadow-sm"
          />
          <h2 className="text-2xl font-bold mt-4">Dep. Maria Elisa</h2>
          <p className="text-gray-500">Deputada Estadual</p>

          <div className="flex gap-4 mt-6">
            <Link
              to="/configuracoes/editar-perfil"
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-5 h-5 mr-2" />
              Editar Perfil
            </Link>
            <Link
              to="/configuracoes/mudar-senha"
              className="flex items-center px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <Lock className="w-5 h-5 mr-2" />
              Mudar Senha
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}