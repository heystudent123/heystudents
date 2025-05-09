export interface Alumni {
  id: string;
  name: string;
  college: string;
  passingYear: number;
  currentCompany: string;
  position: string;
  email: string;
  linkedin?: string;
  imageUrl?: string;
}

export interface College {
  id: string;
  name: string;
  university: string;
} 