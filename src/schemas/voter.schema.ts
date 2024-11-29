import { z } from 'zod';

export const voterSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().min(11, 'WhatsApp inválido'),
  zip_code: z.string().min(8, 'CEP inválido'),
  address: z.string().min(3, 'Endereço é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  neighborhood: z.string().min(3, 'Bairro é obrigatório'),
  city: z.string().min(3, 'Cidade é obrigatória'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
  marital_status: z.string().min(1, 'Estado civil é obrigatório'),
  leader_id: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

export type VoterFormData = z.infer<typeof voterSchema>;