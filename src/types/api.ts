export interface LeaderProfile {
  id: number;
  name: string;
  email: string;
  whatsapp?: string;
  city?: string;
  status: 'active' | 'inactive';
  role?: string;
  age?: number;
  children?: number;
  marital_status?: string;
  address?: string;
  neighborhood?: string;
  state?: string;
  birth_date?: string;
  zip_code?: string;
  photo_url?: string;
  full_address: string;
  complete_city: string;
  statistics: {
    voters_count: number;
    meetings_count: number;
  };
}

// Rest of the file remains unchanged