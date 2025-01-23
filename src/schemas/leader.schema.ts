import { z } from 'zod';

export const leaderSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres').optional(),
  whatsapp: z.string().min(11, 'WhatsApp inválido'),
  zip_code: z.string().min(8, 'CEP inválido'),
  address: z.string().min(3, 'Endereço é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  neighborhood: z.string().min(3, 'Bairro é obrigatório'),
  city: z.string().min(3, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
  marital_status: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  photo_url: z.string().optional(),
  latitude: z.any().optional(),
  longitude: z.any().optional(),
  children: z.string().min(1, 'Número é obrigatório'),
  voteGoal: z.string().optional(),
  gender: z.enum(['male', 'female'], {
    required_error: 'Selecione o gênero',
    invalid_type_error: 'Gênero inválido'
  }),
  id_user: z.string().optional()
});

export type LeaderFormData = z.infer<typeof leaderSchema>;