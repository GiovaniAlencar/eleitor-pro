import { useState, useEffect } from 'react';
import { X, Cookie, ChevronRight } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <>
      {/* Banner de Consentimento */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:max-w-md z-50">
        <div className="bg-white rounded-2xl shadow-3xl border border-gray-100 overflow-hidden transform transition-all duration-300 ease-in-out">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cookie className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Política de Cookies</h3>
              </div>
              <button
                onClick={() => setShow(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              Utilizamos cookies para melhorar sua experiência em nosso sistema. Eles nos ajudam a entender como você interage com nossos serviços.
            </p>
            
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#13db63] to-[#02bde8] hover:from-green-600 hover:to-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg"
              >
                Aceitar Cookies
              </button>
              <button
                onClick={() => setShowModal(true)} // Abre o modal
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Saiba mais
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Consentimento */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 relative shadow-lg">
            <button
              onClick={() => setShowModal(false)} // Fecha o modal
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Política de Cookies</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Nosso site utiliza cookies para personalizar sua experiência, oferecer recursos e analisar o uso da plataforma.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)} // Fecha o modal
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
