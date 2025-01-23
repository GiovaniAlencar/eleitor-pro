import { X, Shield, UserCheck, Lock, AlertTriangle, RefreshCw } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-3xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Termos de Uso e Condições</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6 text-sm text-gray-600">
            <section className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-100 transition-colors">
              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">Declaração de Aceite</h3>
                  <p className="leading-relaxed">
                    Ao utilizar o Eleitor Pro, você concorda expressamente com todos os termos e condições estabelecidos neste documento.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-100 transition-colors">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">Proteção de Dados</h3>
                  <p className="leading-relaxed">
                    Seus dados são protegidos de acordo com a LGPD. Utilizamos criptografia de ponta a ponta e seguimos os mais rigorosos padrões de segurança.
                  </p>
                  <div className="mt-2 bg-blue-50 p-3 rounded-lg text-xs">
                    <strong className="text-blue-700">Importante:</strong>
                    <ul className="mt-1 space-y-1 text-blue-600">
                      <li>• Seus dados nunca são compartilhados com terceiros</li>
                      <li>• Você tem total controle sobre suas informações</li>
                      <li>• Backups automáticos e criptografados</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-100 transition-colors">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">Responsabilidades</h3>
                  <p className="leading-relaxed">
                    Como usuário do sistema, você é responsável por:
                  </p>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Manter suas credenciais em segurança</li>
                    <li>• Garantir a veracidade das informações</li>
                    <li>• Respeitar as leis eleitorais vigentes</li>
                    <li>• Reportar qualquer atividade suspeita</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-100 transition-colors">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">Atualizações</h3>
                  <p className="leading-relaxed">
                    Estes termos podem ser atualizados periodicamente. Você será notificado sobre quaisquer alterações significativas.
                  </p>
                  <div className="mt-2 bg-yellow-50 p-3 rounded-lg text-xs text-yellow-700">
                    <strong>Nota:</strong> A continuidade do uso após alterações implica em aceitação dos novos termos.
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-[#13db63] to-[#02bde8] hover:from-green-600 hover:to-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg"
            >
              Li e Aceito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}