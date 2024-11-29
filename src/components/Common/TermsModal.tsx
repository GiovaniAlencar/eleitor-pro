import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl p-6 max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Termos de Uso e Condições</h2>

        <div className="prose prose-sm">
          <h3>1. Aceitação dos Termos</h3>
          <p>
            Ao acessar e usar o Eleitor Pro, você concorda em cumprir estes termos de uso e todas as leis e regulamentos aplicáveis.
          </p>

          <h3>2. Uso do Serviço</h3>
          <p>
            O Eleitor Pro é uma ferramenta para gerenciamento de eleitores e lideranças políticas. Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos.
          </p>

          <h3>3. Privacidade e Proteção de Dados</h3>
          <p>
            Nos comprometemos com a proteção de seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD). Para mais informações, consulte nossa Política de Privacidade.
          </p>

          <h3>4. Responsabilidades do Usuário</h3>
          <p>
            Você é responsável por manter a confidencialidade de sua conta e senha, bem como por todas as atividades que ocorrem em sua conta.
          </p>

          <h3>5. Limitação de Responsabilidade</h3>
          <p>
            O Eleitor Pro não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou consequentes resultantes do uso ou incapacidade de usar o serviço.
          </p>

          <h3>6. Modificações dos Termos</h3>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. As modificações entrarão em vigor imediatamente após sua publicação no site.
          </p>
        </div>
      </div>
    </div>
  );
}