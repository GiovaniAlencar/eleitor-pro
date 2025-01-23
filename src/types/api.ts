export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  gender?: 'male' | 'female';
  whatsapp?: string;
  zip_code?: string;
  address?: string;
  position?: string;
  voteGoal?: number;
  id_user?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  birth_date?: string;
  marital_status?: string;
  status: 'active' | 'inactive';
  photo_url?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Leader extends User {
  voters_count: number;
  statistics?: {
    voters_count: number;
    meetings_count: number;
  };
}

export interface LeaderProfile extends Leader {
  full_address: string;
  complete_city: string;
  age: number;
  children: string;
  state: string;
}

export interface Voter {
  id: number;
  name: string;
  email: string;
  gender: 'male' | 'female';
  whatsapp: string;
  zip_code: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  birth_date: string;
  marital_status: string;
  leader_id?: number;
  status: 'active' | 'inactive';
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}