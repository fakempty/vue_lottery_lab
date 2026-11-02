export interface Participant {
  id: string;
  name: string;
  dob: string;
  email: string;
  phone: string;
}

export type SortField = 'name' | 'dob' | null;
export type SortOrder = 'asc' | 'desc';
