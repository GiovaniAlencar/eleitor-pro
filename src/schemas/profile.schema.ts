import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().min(11, 'WhatsApp inválido'),
  zip_code: z.string().min(8, 'CEP inválido'),
  address: z.string().min(3, 'Endereço é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  neighborhood: z.string().min(3, 'Bairro é obrigatório'),
  city: z.string().min(3, 'Cidade é obrigatória'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
  marital_status: z.string().min(1, 'Estado civil é obrigatório')
});

export const passwordSchema = z.object({
  current_password: z.string().min(8, 'Senha atual é obrigatória'),
  password: z.string().min(8, 'Nova senha deve ter no mínimo 8 caracteres'),
  password_confirmation: z.string().min(8, 'Confirmação de senha é obrigatória')
}).refine(data => data.password === data.password_confirmation, {
  message: 'As senhas não conferem',
  path: ['password_confirmation']
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;