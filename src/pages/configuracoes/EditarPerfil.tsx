import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { profileService } from '../../services/profile.service';
import ImageCropper from '../../components/Common/ImageCropper';
import { Toaster } from 'sonner';
import { User, Mail, Phone, MapPin, Home, Calendar, Users, Building } from 'lucide-react';
import MaskedInput from '../../components/Common/MaskedInput'; // Importa o componente de máscara
import { masks } from '../../utils/masks'; // Importa as definições de máscara
import { useViaCep } from '../../hooks/useViaCep'; // Importa a função que busca o CEP
import LoadingScreen from '../../components/Common/LoadingScreen'; // Componente de tela de loading

export default function EditarPerfil() {
  const navigate = useNavigate();
  const { searchCep, loading: loadingCep } = useViaCep();
  const [loading, setLoading] = useState<boolean>(true); // Estado para controle de carregamento

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    whatsapp: '',
    zip_code: '',
    address: '',
    number: '',
    neighborhood: '',
    city: '',
    birth_date: '',
    marital_status: '',
  });
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await profileService.getProfile();
  
        if (data.birth_date) {
          // Corrige a data com formato inválido (ex: 28T00:00:00.000000Z/04/1999)
          const match = data.birth_date.match(/(\d{4})-(\d{2})-(\d{2})/); // Procura AAAA-MM-DD
          if (match) {
            const [, year, month, day] = match; // Desestrutura a data
            data.birth_date = `${day}/${month}/${year}`; // Converte para DD/MM/AAAA
          } else {
            console.warn('Data inválida recebida:', data.birth_date);
            data.birth_date = ''; // Define como vazio se não for válida
          }
        }
  
        setProfile(data);
  
        if (data.photo_url) {
          setProfileImage(data.photo_url);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        navigate('/configuracoes');
      } finally {
        setLoading(false);
      }
    };
  
    loadProfile();
  }, [navigate]);
  
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingScreen message="Carregando configurações..." /> {/* Componente de carregamento */}
      </div>
    );
  }

  // Função para buscar o endereço pelo CEP
  const handleCepChange = async (cep: string) => {
    if (cep.length === 9) {
      const address = await searchCep(cep);
      if (address) {
        setProfile((prev) => ({
          ...prev,
          address: address.address,
          neighborhood: address.neighborhood,
          city: address.city,
        }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Formatar a data de nascimento para o formato YYYY-MM-DD antes de enviar
    const formattedData = { ...profile };
    if (profile.birth_date) {
      const [day, month, year] = profile.birth_date.split('/');
      formattedData.birth_date = `${year}-${month}-${day}`;
    }
  
    try {
      await profileService.updateProfile(formattedData, selectedImage);
      navigate('/configuracoes');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImage: string) => {
    try {
      // Converte o blob da URL em um Blob real
      const response = await fetch(croppedImage);
      const blob = await response.blob();

      // Cria um arquivo a partir do Blob
      const file = new File([blob], "cropped-image.jpg", { type: blob.type });

      // Envia o arquivo real para a API
      const apiResponse = await profileService.updatePhoto(file);

      setProfileImage(apiResponse.photo_url);
      setShowCropper(false);
      setSelectedImage(null);
      window.location.reload();

    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar</h1>
        <p className="text-gray-600 mt-2">Atualize suas informações pessoais</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Foto de Perfil */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <img
              src={`${import.meta.env.VITE_STORAGE_URL}/${profileImage}`}
              alt="Profile"
              className="w-32 h-32 rounded-full ring-4 ring-white shadow-sm object-cover"
            />
            <label className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
              Alterar Foto
            </label>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <div className="relative">
              <User className="absolute top-2 left-3 text-gray-400" />
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute top-2 left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute top-2 left-3 text-gray-400" />
              <MaskedInput
                mask={masks.phone.mask}
                definitions={masks.phone.definitions}
                value={profile.whatsapp}
                onAccept={(value) => handleChange({ target: { name: 'whatsapp', value } })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(00) 00000-0000"
                name="whatsapp"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
            <div className="relative">
              <MapPin className="absolute top-2 left-3 text-gray-400" />
              <MaskedInput
                mask={masks.cep.mask}
                definitions={masks.cep.definitions}
                value={profile.zip_code}
                onAccept={(value) => {
                  handleChange({ target: { name: 'zip_code', value } });
                  if (value !== profile.zip_code) { // Verifica se o CEP realmente mudou
                    handleCepChange(value);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="00000-000"
                name="zip_code"
              />
            </div>
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
            <div className="relative">
              <Home className="absolute top-2 left-3 text-gray-400" />
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Número */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número
            </label>
            <div className="relative">
              <Building className="absolute top-2 left-3 text-gray-400" />
              <input
                type="text"
                name="number"
                value={profile.number}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Bairro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
            <div className="relative">
              <Building className="absolute top-2 left-3 text-gray-400" />
              <input
                type="text"
                name="neighborhood"
                value={profile.neighborhood}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
            <div className="relative">
              <MapPin className="absolute top-2 left-3 text-gray-400" />
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>


          {/* Data de Nascimento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <MaskedInput
                mask={masks.date.mask}
                onChange={handleChange}
                name='birth_date'
                definitions={masks.date.definitions}
                value={profile.birth_date} // O valor vem do estado formatado
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="DD/MM/AAAA"
              />
              {/* <input
                type="date"
                name="birth_date"
                value={profile.birth_date}
                onChange={handleChange}
                style={{
                  backgroundColor: 'white',
                  width: window.innerWidth <= 768 ? '100%' : '', 
                  height: window.innerWidth <= 768 ? '40px' : 'auto', // Altura maior apenas para telas menores
                  fontSize: window.innerWidth <= 768 ? '16px' : '14px', // Ajusta o tamanho da fonte também
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              /> */}
            </div>
          </div>

          {/* Estado Civil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado Civil
            </label>
            <select
              name="marital_status"
              value={profile.marital_status}
              onChange={handleChange}
              defaultValue=""
              style={{
                backgroundColor: 'white',
                width: window.innerWidth <= 768 ? '100%' : '',
                height: window.innerWidth <= 768 ? '40px' : 'auto', // Altura maior apenas para telas menores
                fontSize: window.innerWidth <= 768 ? '16px' : '14px', // Ajusta o tamanho da fonte também
              }}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Selecione uma opção</option>
              <option value="solteiro">Solteiro(a)</option>
              <option value="casado">Casado(a)</option>
              <option value="divorciado">Divorciado(a)</option>
              <option value="viuvo">Viúvo(a)</option>
            </select>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/configuracoes')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500"
          >
            Salvar
          </button>
        </div>
      </form>

      {/* Modal do Cropper */}
      {showCropper && selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
}
