// services/api.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  LoginRequest,
  Token,
  User,
  Company,
  CompanyCreateRequest,
  CompanyUpdateRequest,
  Representative,
  RepresentativeCreateRequest,
  Vacancy,
  VacancyCreateRequest,
  VacancyUpdateRequest,
  Candidate,
  CandidateCreateRequest,
  CandidateUpdateRequest,
  CandidateSkill,
  CandidateSkillCreateRequest,
  CandidateLanguage,
  CandidateLanguageCreateRequest,
  VacancySkill,
  VacancySkillCreateRequest,
  VacancyLanguage,
  VacancyLanguageCreateRequest,
  Application,
  ApplicationCreateRequest,
  ApplicationUpdateRequest,
  Comment,
  CommentCreateRequest,
  Stage,
  StageCreateRequest,
  StageUpdateRequest,
  Skill,
  SkillCreateRequest,
  Language,
  LanguageCreateRequest,
  Notification
} from '@/types/apiTypes';

const API_URL = 'http://localhost:8000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(data: LoginRequest): Promise<Token> {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await this.api.post<Token>('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    localStorage.setItem('auth_token', response.data.access_token);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<User>('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('auth_token');
  }

  // Companies
  async getCompanies(): Promise<Company[]> {
    const response = await this.api.get<Company[]>('/companies');
    return response.data.data;
  }

  async getCompanyById(id: number): Promise<Company> {
    const response = await this.api.get<Company>(`/companies/${id}`);
    return response.data;
  }

  async createCompany(data: CompanyCreateRequest): Promise<Company> {
    const response = await this.api.post<Company>('/companies', data);
    return response.data;
  }

  async updateCompany(id: number, data: CompanyUpdateRequest): Promise<Company> {
    const response = await this.api.put<Company>(`/companies/${id}`, data);
    return response.data;
  }

  async deleteCompany(id: number): Promise<void> {
    await this.api.delete(`/companies/${id}`);
  }

  // Representatives
  async getRepresentatives(companyId: number): Promise<Representative[]> {
    const res = await this.api.get<Representative[]>(`/companies/${companyId}/representatives`);
    return res.data;
  }

  async createRepresentative(companyId: number, data: RepresentativeCreateRequest): Promise<Representative> {
    const res = await this.api.post<Representative>(`/companies/${companyId}/representatives`, data);
    return res.data;
  }

  async deleteRepresentative(companyId: number, id: number): Promise<void> {
    await this.api.delete(`/companies/${companyId}/representatives/${id}`);
  }

  // Vacancies
  async getVacancies(params?: Record<string, any>): Promise<Vacancy[]> {
    const res = await this.api.get<Vacancy[]>('/vacancies', { params });
    return res.data;
  }

  async getVacancyById(id: number): Promise<Vacancy> {
    const res = await this.api.get<Vacancy>(`/vacancies/${id}`);
    return res.data;
  }

  async createVacancy(data: VacancyCreateRequest): Promise<Vacancy> {
    const res = await this.api.post<Vacancy>('/vacancies', data);
    return res.data;
  }

  async updateVacancy(id: number, data: VacancyUpdateRequest): Promise<Vacancy> {
    const res = await this.api.put<Vacancy>(`/vacancies/${id}`, data);
    return res.data;
  }

  async deleteVacancy(id: number): Promise<void> {
    await this.api.delete(`/vacancies/${id}`);
  }

  // Candidates
  async getCandidates(): Promise<Candidate[]> {
    const res = await this.api.get<Candidate[]>('/candidates');
    return res.data;
  }

  async getCandidateById(id: number): Promise<Candidate> {
    const res = await this.api.get<Candidate>(`/candidates/${id}`);
    return res.data;
  }

  async createCandidate(data: CandidateCreateRequest): Promise<Candidate> {
    const res = await this.api.post<Candidate>('/candidates', data);
    return res.data;
  }

  async updateCandidate(id: number, data: CandidateUpdateRequest): Promise<Candidate> {
    const res = await this.api.put<Candidate>(`/candidates/${id}`, data);
    return res.data;
  }

  async deleteCandidate(id: number): Promise<void> {
    await this.api.delete(`/candidates/${id}`);
  }

  // Candidate Skills
  async getCandidateSkills(candidateId: number): Promise<CandidateSkill[]> {
    const res = await this.api.get(`/candidates/${candidateId}/skills`);
    return res.data;
  }

  async addCandidateSkill(candidateId: number, data: CandidateSkillCreateRequest): Promise<CandidateSkill> {
    const res = await this.api.post(`/candidates/${candidateId}/skills`, data);
    return res.data;
  }

  async removeCandidateSkill(candidateId: number, id: number): Promise<void> {
    await this.api.delete(`/candidates/${candidateId}/skills/${id}`);
  }

  // Candidate Languages
  async getCandidateLanguages(candidateId: number): Promise<CandidateLanguage[]> {
    const res = await this.api.get(`/candidates/${candidateId}/languages`);
    return res.data;
  }

  async addCandidateLanguage(candidateId: number, data: CandidateLanguageCreateRequest): Promise<CandidateLanguage> {
    const res = await this.api.post(`/candidates/${candidateId}/languages`, data);
    return res.data;
  }

  async removeCandidateLanguage(candidateId: number, id: number): Promise<void> {
    await this.api.delete(`/candidates/${candidateId}/languages/${id}`);
  }

  // Vacancy Skills & Languages
  async getVacancySkills(vacancyId: number): Promise<VacancySkill[]> {
    const res = await this.api.get(`/vacancies/${vacancyId}/skills`);
    return res.data;
  }

  async addVacancySkill(vacancyId: number, data: VacancySkillCreateRequest): Promise<VacancySkill> {
    const res = await this.api.post(`/vacancies/${vacancyId}/skills`, data);
    return res.data;
  }

  async removeVacancySkill(vacancyId: number, id: number): Promise<void> {
    await this.api.delete(`/vacancies/${vacancyId}/skills/${id}`);
  }

  async getVacancyLanguages(vacancyId: number): Promise<VacancyLanguage[]> {
    const res = await this.api.get(`/vacancies/${vacancyId}/languages`);
    return res.data;
  }

  async addVacancyLanguage(vacancyId: number, data: VacancyLanguageCreateRequest): Promise<VacancyLanguage> {
    const res = await this.api.post(`/vacancies/${vacancyId}/languages`, data);
    return res.data;
  }

  async removeVacancyLanguage(vacancyId: number, id: number): Promise<void> {
    await this.api.delete(`/vacancies/${vacancyId}/languages/${id}`);
  }

  // Applications
  async getApplications(): Promise<Application[]> {
    const res = await this.api.get('/applications');
    return res.data;
  }

  async getApplicationById(id: number): Promise<Application> {
    const res = await this.api.get(`/applications/${id}`);
    return res.data;
  }

  async createApplication(data: ApplicationCreateRequest): Promise<Application> {
    const res = await this.api.post(`/applications`, data);
    return res.data;
  }

  async updateApplication(id: number, data: ApplicationUpdateRequest): Promise<Application> {
    const res = await this.api.put(`/applications/${id}`, data);
    return res.data;
  }

  async deleteApplication(id: number): Promise<void> {
    await this.api.delete(`/applications/${id}`);
  }

  // Comments
  async getComments(applicationId: number): Promise<Comment[]> {
    const res = await this.api.get(`/applications/${applicationId}/comments`);
    return res.data;
  }

  async createComment(data: CommentCreateRequest): Promise<Comment> {
    const res = await this.api.post(`/applications/${data.application_id}/comments`, data);
    return res.data;
  }

  // Stages
  async getStages(params?: Record<string, any>): Promise<Stage[]> {
    const res = await this.api.get('/stages', { params });
    return res.data;
  }

  async createStage(data: StageCreateRequest): Promise<Stage> {
    const res = await this.api.post('/stages', data);
    return res.data;
  }

  async updateStage(id: number, data: StageUpdateRequest): Promise<Stage> {
    const res = await this.api.put(`/stages/${id}`, data);
    return res.data;
  }

  async deleteStage(id: number): Promise<void> {
    await this.api.delete(`/stages/${id}`);
  }

  // Skills & Languages
  async getSkills(): Promise<Skill[]> {
    const res = await this.api.get('/skills');
    return res.data;
  }

  async createSkill(data: SkillCreateRequest): Promise<Skill> {
    const res = await this.api.post('/skills', data);
    return res.data;
  }

  async getLanguages(): Promise<Language[]> {
    const res = await this.api.get('/languages');
    return res.data;
  }

  async createLanguage(data: LanguageCreateRequest): Promise<Language> {
    const res = await this.api.post('/languages', data);
    return res.data;
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const res = await this.api.get('/notifications');
    return res.data;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const res = await this.api.patch(`/notifications/${id}/read`);
    return res.data;
  }
}

export const apiService = new ApiService();
export default apiService;
