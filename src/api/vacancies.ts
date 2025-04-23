
import { Vacancy, ApiResponse, PaginatedResponse } from './types';

// Mock vacancy data
const vacancies: Vacancy[] = [
  {
    id: '1',
    title: 'Middle Frontend Developer',
    companyId: '1',
    companyName: 'IT-Bilim',
    salary: { amount: 8000000, currency: 'сум' },
    skills: ['HTML', 'CSS', 'JS', 'React'],
    status: 'active',
    stage: 'Interview',
  },
  {
    id: '2',
    title: 'Senior Backend Developer',
    companyId: '1',
    companyName: 'IT-Bilim',
    salary: { amount: 12000000, currency: 'сум' },
    skills: ['Node.js', 'Express', 'MongoDB', 'Redis'],
    status: 'active',
    stage: 'Initial Review',
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    companyId: '1',
    companyName: 'IT-Bilim',
    salary: { amount: 7000000, currency: 'сум' },
    skills: ['Figma', 'Adobe XD', 'Sketch', 'UI Design'],
    status: 'active',
    stage: 'Offer',
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    companyId: '2',
    companyName: 'Tech Solutions',
    salary: { amount: 5000, currency: 'USD' },
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    status: 'active',
    stage: 'Initial Review',
  },
  {
    id: '5',
    title: 'Data Scientist',
    companyId: '3',
    companyName: 'Data Insights',
    salary: { amount: 6000, currency: 'USD' },
    skills: ['Python', 'R', 'Machine Learning', 'SQL'],
    status: 'active',
    stage: 'Interview',
  },
];

// Get all vacancies
export const getVacancies = async (
  page = 1,
  limit = 10,
  filters?: { companyId?: string; status?: string; stage?: string }
): Promise<ApiResponse<PaginatedResponse<Vacancy>>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredVacancies = [...vacancies];

  if (filters) {
    if (filters.companyId) {
      filteredVacancies = filteredVacancies.filter(
        (v) => v.companyId === filters.companyId
      );
    }
    
    if (filters.status) {
      filteredVacancies = filteredVacancies.filter(
        (v) => v.status === filters.status
      );
    }
    
    if (filters.stage) {
      filteredVacancies = filteredVacancies.filter(
        (v) => v.stage === filters.stage
      );
    }
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedVacancies = filteredVacancies.slice(start, end);

  return {
    success: true,
    data: {
      data: paginatedVacancies,
      total: filteredVacancies.length,
      page,
      limit,
    },
  };
};

// Get vacancy by ID
export const getVacancyById = async (
  id: string
): Promise<ApiResponse<Vacancy>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const vacancy = vacancies.find((v) => v.id === id);

  if (!vacancy) {
    throw new Error('Vacancy not found');
  }

  return {
    success: true,
    data: vacancy,
  };
};

// Create vacancy
export const createVacancy = async (
  vacancyData: Omit<Vacancy, 'id'>
): Promise<ApiResponse<Vacancy>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newVacancy: Vacancy = {
    ...vacancyData,
    id: `${vacancies.length + 1}`,
  };

  vacancies.push(newVacancy);

  return {
    success: true,
    data: newVacancy,
  };
};

// Update vacancy
export const updateVacancy = async (
  id: string,
  vacancyData: Partial<Vacancy>
): Promise<ApiResponse<Vacancy>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const index = vacancies.findIndex((v) => v.id === id);

  if (index === -1) {
    throw new Error('Vacancy not found');
  }

  const updatedVacancy = {
    ...vacancies[index],
    ...vacancyData,
  };

  vacancies[index] = updatedVacancy;

  return {
    success: true,
    data: updatedVacancy,
  };
};

// Delete vacancy
export const deleteVacancy = async (
  id: string
): Promise<ApiResponse<null>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = vacancies.findIndex((v) => v.id === id);

  if (index === -1) {
    throw new Error('Vacancy not found');
  }

  vacancies.splice(index, 1);

  return {
    success: true,
    data: null,
  };
};

// Get vacancy stages
export const getVacancyStages = async (): Promise<
  ApiResponse<string[]>
> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    success: true,
    data: ['Initial Review', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'],
  };
};

// Update vacancy stage
export const updateVacancyStage = async (
  id: string,
  stage: string
): Promise<ApiResponse<Vacancy>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = vacancies.findIndex((v) => v.id === id);

  if (index === -1) {
    throw new Error('Vacancy not found');
  }

  const updatedVacancy = {
    ...vacancies[index],
    stage,
  };

  vacancies[index] = updatedVacancy;

  return {
    success: true,
    data: updatedVacancy,
  };
};
