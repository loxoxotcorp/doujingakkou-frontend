
// Common Types
export type Status = 'active' | 'inactive' | 'archived';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'manager';
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  legalName?: string;
  description?: string;
  industry?: string;
  totalVacancies: number;
  activeVacancies: number;
  logoUrl?: string;
  contacts: CompanyContact[];
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface CompanyContact {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  position?: string;
  phones: string[];
  emails: string[];
}

export interface Vacancy {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  salary?: {
    amount: number;
    currency: string;
  };
  skills: string[];
  status: Status;
  stage?: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  position?: string;
  companyName?: string;
  skills: string[];
  languages: {
    language: string;
    level: string;
  }[];
  region?: string;
  education?: string;
  status: Status;
  stage?: string;
  vacancyId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'company' | 'vacancy' | 'candidate';
  entityId: string;
  entityName: string;
  timestamp: string;
  details?: Record<string, any>;
}
