
// Common types
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
};

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role_id: number;
}

// Company types
export interface Company {
  id: number;
  name: string;
  legal_name?: string;
  activity_field?: string;
  description?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
  representatives: CompanyRepresentative[];
  vacancies: Vacancy[];
}

export interface CompanyCreateRequest {
  name: string;
  legal_name?: string;
  activity_field?: string;
  description?: string;
  logo_url?: string;
}

export interface CompanyUpdateRequest {
  name?: string;
  legal_name?: string;
  activity_field?: string;
  description?: string;
  logo_url?: string;
}

export interface CompanyListResponse {
  data: Company[];
  total: number;
}


// Representative types
export interface CompanyRepresentative {
  id: number;
  company_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone?: string;
  email?: string;
}

export interface CompanyRepresentativeCreateRequest {
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone?: string;
  email?: string;
}

export interface CompanyRepresentativeUpdateRequest {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  phone?: string;
  email?: string;
}

// Vacancy types
export interface Vacancy {
  id: number;
  title: string;
  salary_amount?: number;
  salary_currency?: string;
  description?: string;
  current_stage_id?: number;
  is_active: boolean;
  company_id?: number;
  stage?: Stage;
  skills: Skill[];
  languages: Language[];
  created_at: string;
  updated_at: string;
}

export interface VacancyCreateRequest {
  title: string;
  salary_amount?: number;
  salary_currency?: string;
  description?: string;
  current_stage_id?: number;
  is_active?: boolean;
  company_id?: number;
}

export interface VacancyUpdateRequest {
  title?: string;
  salary_amount?: number;
  salary_currency?: string;
  description?: string;
  current_stage_id?: number;
  is_active?: boolean;
}

// Candidate types
export interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone?: string;
  email?: string;
  region?: string;
  education?: string;
  resume_url?: string;
  source?: string;
  skills: Skill[];
  languages: Language[];
  created_at: string;
  updated_at: string;
}

export interface CandidateCreateRequest {
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone?: string;
  email?: string;
  region?: string;
  education?: string;
  resume_url?: string;
  source?: string;
}

export interface CandidateUpdateRequest {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  phone?: string;
  email?: string;
  region?: string;
  education?: string;
  resume_url?: string;
  source?: string;
}

// Skill types
export interface Skill {
  id: number;
  name: string;
}

export interface SkillCreateRequest {
  name: string;
}

export interface SkillUpdateRequest {
  name?: string;
}

export interface CandidateSkill {
  id: number;
  candidate_id: number;
  skill_id: number;
}

export interface CandidateSkillCreateRequest {
  skill_id: number;
}

export interface VacancySkill {
  id: number;
  vacancy_id: number;
  skill_id: number;
}

export interface VacancySkillCreateRequest {
  skill_id: number;
}

// Language types
export interface Language {
  id: number;
  name: string;
}

export interface LanguageCreateRequest {
  name: string;
}

export interface LanguageUpdateRequest {
  name?: string;
}

export interface CandidateLanguage {
  id: number;
  candidate_id: number;
  language_id: number;
  proficiency_level: string;
}

export interface CandidateLanguageCreateRequest {
  language_id: number;
  proficiency_level: string;
}

export interface VacancyLanguage {
  id: number;
  vacancy_id: number;
  language_id: number;
  proficiency_level?: string;
}

export interface VacancyLanguageCreateRequest {
  language_id: number;
  proficiency_level?: string;
}

// Application types
export interface Application {
  id: number;
  candidate_id: number;
  vacancy_id: number;
  current_stage_id?: number;
  candidate: Candidate;
  vacancy: Vacancy;
  stage?: Stage;
  created_at: string;
  updated_at: string;
}

export interface ApplicationCreateRequest {
  candidate_id: number;
  vacancy_id: number;
  current_stage_id?: number;
}

export interface ApplicationUpdateRequest {
  current_stage_id?: number;
}

// Stage types
export interface Stage {
  id: number;
  name: string;
  order: number;
  entity_type: "company" | "vacancy" | "candidate" | "application";
  is_active: boolean;
  is_final: boolean;
}

export interface StageCreateRequest {
  name: string;
  order: number;
  entity_type: "company" | "vacancy" | "candidate" | "application";
  is_active?: boolean;
  is_final?: boolean;
}

export interface StageUpdateRequest {
  name?: string;
  order?: number;
  is_active?: boolean;
  is_final?: boolean;
}

// Comment types
export interface Comment {
  id: string;
  application_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  created_by_name?: string;
}

export interface CommentCreateRequest {
  application_id: string;
  content: string;
}

// Notification types
export interface Notification {
  id: number;
  user_id: number;
  type: string;
  content: string;
  reference_entity_type?: string;
  reference_entity_id?: number;
  is_delivered: boolean;
  is_read: boolean;
  created_at: string;
  delivered_at?: string;
  read_at?: string;
}

export interface ReminderCreateRequest {
  application_id: string;
  reminder_date: string;
  content: string;
}

// Filter types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface CompanyFilters extends PaginationParams {
  search?: string;
  industry?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface VacancyFilters extends PaginationParams {
  company_id?: string;
  status?: 'active' | 'closed' | 'draft';
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  skills?: string[];
  languages?: string[];
}

export interface CandidateFilters extends PaginationParams {
  search?: string;
  specialization?: string;
  location?: string;
  experience_min?: number;
  experience_max?: number;
  skills?: string[];
  languages?: string[];
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ApplicationFilters extends PaginationParams {
  candidate_id?: string;
  vacancy_id?: string;
  stage_id?: string;
  company_id?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
