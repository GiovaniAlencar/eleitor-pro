import { z } from 'zod';

export const identificationSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  gender: z.enum(['male', 'female'], {
    required_error: 'Selecione o gênero',
    invalid_type_error: 'Gênero inválido'
  }),
  position: z.string().nonempty('Selecione uma posição válida'),
  voteGoal: z.string().nonempty('A meta de votos deve ser maior que zero')
});

export const birthDateSchema = z.object({
  birth_date: z.string()
    .min(1, 'Data de nascimento é obrigatória')
    .refine((date) => {
      const [day, month, year] = date.split('/').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear(); // Altere para 'let'
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Ajuste a idade, caso a data de nascimento já tenha ocorrido no ano atual
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age >= 18; // Retorna true ou false, validando a idade mínima
    }, 'Você deve ter pelo menos 18 anos')
});

export const photoSchema = z.object({
  photo: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Arquivo deve ter no máximo 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png'].includes(file.type),
      'Formato inválido. Use JPG ou PNG'
    ),
});

export const credentialsSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/(?=.*[0-9])/, 'Senha deve conter pelo menos um número')
    .regex(/(?=.*[!@#$%^&*])/, 'Senha deve conter pelo menos um caractere especial'),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: 'As Senhas não conferem',
  path: ['password_confirmation']
});

export type IdentificationData = z.infer<typeof identificationSchema>;
export type BirthDateData = z.infer<typeof birthDateSchema>;
export type PhotoData = z.infer<typeof photoSchema>;
export type CredentialsData = z.infer<typeof credentialsSchema>;

export interface RegistrationData extends 
  IdentificationData,
  BirthDateData,
  PhotoData,
  CredentialsData {}