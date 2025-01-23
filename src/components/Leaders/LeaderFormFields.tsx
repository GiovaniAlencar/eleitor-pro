import { User, Mail, Phone, MapPin, Home, Calendar, Users, Building2, Building, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UseFormReturn } from 'react-hook-form';
import { LeaderFormData } from '../../schemas/leader.schema';
import MaskedInput from '../Common/MaskedInput';
import { masks } from '../../utils/masks';

interface LeaderFormFieldsProps {
  form: UseFormReturn<LeaderFormData>;
  onSubmit: (data: LeaderFormData) => Promise<void>;
  handleCepChange: (cep: string) => Promise<void>;
  loadingCep: boolean;
  isEditing?: boolean;
}

export default function LeaderFormFields({
  form,
  onSubmit,
  handleCepChange,
  loadingCep,
  isEditing
}: LeaderFormFieldsProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = form;
  // Função para buscar coordenadas
  const fetchCoordinates = async () => {
    const address = form.getValues('address');
    const number = form.getValues('number');
    const neighborhood = form.getValues('neighborhood');
    const city = form.getValues('city');
    const state = form.getValues('state');

    if (address && neighborhood) {
      const query = `${address}+${number}+${neighborhood}+${city}+${state}`;

      // Substitua 'YOUR_API_KEY' pela sua chave de API do Google
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=AIzaSyDWgYVXY2IaVNW-PvONdyLwaY9dEtBm0U0`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
          const latitude = data.results[0].geometry.location.lat;
          const longitude = data.results[0].geometry.location.lng;

          setValue('latitude', latitude); // Atualiza o campo de latitude
          setValue('longitude', longitude); // Atualiza o campo de longitude
        }
      } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
      }
    }
  };

  // UseEffect para disparar a busca quando os campos "endereço" ou "bairro" mudarem
  const handleAddressOrNeighborhoodChange = () => {
    fetchCoordinates();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
          <div className="relative">
            <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              {...register('name')}
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nome completo"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meta de votos</label>
          <div className="relative">
            <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              {...register('voteGoal')}
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Meta de votos"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-1 p-1 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                {...register('gender')}
                type="radio"
                value="male"
                className="w-5 h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 text-blue-500"
              />
              <User className="w-5 h-5 text-blue-500" />
              <span className="text-sm md:text-base lg:text-sm">Masculino</span>
            </label>
            <label className="flex items-center gap-1 p-2 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                {...register('gender')}
                type="radio"
                value="female"
                className="w-5 h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 text-pink-500"
              />
              <User className="w-5 h-5 text-pink-600" />
              <span className="text-sm md:text-base lg:text-sm">Feminino</span>
            </label>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.gender.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              {...register('email')}
              type="email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="exemplo@email.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Whatsapp</label>
          <div className="relative">
            <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <MaskedInput
              {...register('whatsapp')}
              mask={masks.phone.mask}
              definitions={masks.phone.definitions}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="(00) 00000-0000"
            />
          </div>
          {errors.whatsapp && (
            <p className="mt-1 text-sm text-red-600">{errors.whatsapp.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <MaskedInput
              {...register('zip_code')}
              mask={masks.cep.mask}
              definitions={masks.cep.definitions}
              onAccept={handleCepChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="00000-000"
            />
          </div>
          {errors.zip_code && (
            <p className="mt-1 text-sm text-red-600">{errors.zip_code.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endereço
            {loadingCep && <span className="ml-2 text-xs text-blue-500">Carregando...</span>}
          </label>
          <div className="relative">
            <Home className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              {...register('address')}
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nome da rua"
            />
          </div>
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
          <div className="relative">
            <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              {...register('number')}
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Número"
              onBlur={handleAddressOrNeighborhoodChange}
            />
          </div>
          {errors.number && (
            <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
          <div className="relative">
            <Building className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              {...register('neighborhood')}
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Bairro"
              onBlur={handleAddressOrNeighborhoodChange}
            />
          </div>
          {errors.neighborhood && (
            <p className="mt-1 text-sm text-red-600">{errors.neighborhood.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
          <div className="relative">
            <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              {...register('city')}
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Cidade"
              onBlur={handleAddressOrNeighborhoodChange}
            />
          </div>
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <div className="relative">
            <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              {...register('state')}
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Estado"
            />
          </div>
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
          <div className="relative">
            <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <MaskedInput
              {...register('birth_date')}
              mask={masks.date.mask}
              definitions={masks.date.definitions}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="DD/MM/AAAA"
            />
          </div>
          {errors.birth_date && (
            <p className="mt-1 text-sm text-red-600">{errors.birth_date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado Civil</label>
          <div className="relative">
            {/* Ícone Users */}
            <Users className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none hidden md:block" />

            {/* Select ajustado */}
            <select
              {...register('marital_status')}
              defaultValue=""
              style={{
                height: window.innerWidth <= 768 ? '44px' : '42px', // Altura maior apenas para telas menores
                width: window.innerWidth <= 768 ? '100%' : '100%', // Altura maior apenas para telas menores
                paddingLeft: '2.5rem', // Espaço suficiente para o ícone
              }}
              className="w-full py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="" disabled>Selecione uma opção</option>
              <option value="solteiro">Solteiro(a)</option>
              <option value="casado">Casado(a)</option>
              <option value="divorciado">Divorciado(a)</option>
              <option value="viuvo">Viúvo(a)</option>
            </select>
          </div>
          {errors.marital_status && (
            <p className="mt-1 text-sm text-red-600">{errors.marital_status.message}</p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número de filhos</label>
          <div className="relative">
            <Users className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              {...register('children')}
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Número de filhos"
            />
          </div>
          {errors.children && (
            <p className="mt-1 text-sm text-red-600">{errors.children.message}</p>
          )}
        </div>

        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                {...register('password')}
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="********"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <Link
          to="/lideranca"
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-gradient-to-r from-[#13db63] to-[#02bde8] hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-sm transition-all"
        >
          {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar' : 'Cadastrar')}
        </button>
      </div>
      <div>
        {/* <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label> */}
        <div className="relative">
          {/* <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" /> */}
          <input
            {...register('latitude')}
            type="hidden"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cidade"
          />
        </div>
        {errors.latitude && (
          <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>
        )}
      </div>
      <div>
        {/* <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label> */}
        <div className="relative">
          {/* <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" /> */}
          <input
            {...register('longitude')}
            type="hidden"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cidade"
          />
        </div>
        {errors.longitude && (
          <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>
        )}
      </div>
    </form>
  );
}