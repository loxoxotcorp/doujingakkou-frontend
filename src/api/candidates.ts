
import { Candidate, ApiResponse, PaginatedResponse } from './types';

// Mock candidate data
const candidates: Candidate[] = [
  {
    id: '1',
    firstName: 'Иван',
    lastName: 'Петров',
    position: 'Frontend Developer',
    companyName: 'Tech Solutions',
    skills: ['HTML', 'CSS', 'JS', 'React'],
    languages: [
      { language: 'Английский', level: 'B1' },
      { language: 'Немецкий', level: 'B1' },
      { language: 'Французский', level: 'B1' },
    ],
    region: 'Москва',
    education: 'МГУ, Компьютерные науки',
    status: 'active',
    stage: 'Interview',
    vacancyId: '1',
  },
  {
    id: '2',
    firstName: 'Мария',
    lastName: 'Сидорова',
    position: 'Backend Developer',
    companyName: 'Data Insights',
    skills: ['Node.js', 'Express', 'MongoDB', 'SQL'],
    languages: [
      { language: 'Английский', level: 'B1' },
      { language: 'Немецкий', level: 'B1' },
    ],
    region: 'Санкт-Петербург',
    education: 'СПБГУ, Прикладная математика',
    status: 'active',
    stage: 'Offer',
    vacancyId: '2',
  },
  {
    id: '3',
    firstName: 'Александр',
    lastName: 'Иванов',
    position: 'UI/UX Designer',
    companyName: 'Creative Studio',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop'],
    languages: [
      { language: 'Английский', level: 'B1' },
    ],
    region: 'Казань',
    education: 'КФУ, Дизайн',
    status: 'active',
    stage: 'Screening',
    vacancyId: '3',
  },
];

// Generate more candidates for testing
for (let i = 4; i <= 20; i++) {
  candidates.push({
    id: i.toString(),
    firstName: `Кандидат${i}`,
    lastName: `Фамилия${i}`,
    position: i % 2 === 0 ? 'Frontend Developer' : 'Backend Developer',
    companyName: i % 3 === 0 ? 'IT-Bilim' : 'Tech Co',
    skills: ['HTML', 'CSS', 'JS', 'React'],
    languages: [
      { language: 'Английский', level: 'B1' },
      { language: 'Немецкий', level: 'B1' },
      { language: 'Французский', level: 'B1' },
    ],
    region: 'Регион',
    education: 'Образование',
    status: 'active',
    stage: i % 4 === 0 ? 'Interview' : i % 3 === 0 ? 'Offer' : 'Screening',
    vacancyId: (i % 5 + 1).toString(),
  });
}

// Get all candidates
export const getCandidates = async (
  page = 1,
  limit = 10,
  filters?: { 
    vacancyId?: string; 
    status?: string; 
    stage?: string;
    skills?: string[]; 
    languages?: string[];
    search?: string;
  }
): Promise<ApiResponse<PaginatedResponse<Candidate>>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredCandidates = [...candidates];

  if (filters) {
    if (filters.vacancyId) {
      filteredCandidates = filteredCandidates.filter(
        (c) => c.vacancyId === filters.vacancyId
      );
    }
    
    if (filters.status) {
      filteredCandidates = filteredCandidates.filter(
        (c) => c.status === filters.status
      );
    }
    
    if (filters.stage) {
      filteredCandidates = filteredCandidates.filter(
        (c) => c.stage === filters.stage
      );
    }
    
    if (filters.skills && filters.skills.length > 0) {
      filteredCandidates = filteredCandidates.filter((c) =>
        filters.skills!.some((skill) => c.skills.includes(skill))
      );
    }
    
    if (filters.languages && filters.languages.length > 0) {
      filteredCandidates = filteredCandidates.filter((c) =>
        filters.languages!.some((lang) => 
          c.languages.some((l) => l.language === lang)
        )
      );
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCandidates = filteredCandidates.filter(
        (c) =>
          c.firstName.toLowerCase().includes(searchLower) ||
          c.lastName.toLowerCase().includes(searchLower) ||
          (c.position && c.position.toLowerCase().includes(searchLower)) ||
          (c.companyName && c.companyName.toLowerCase().includes(searchLower))
      );
    }
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedCandidates = filteredCandidates.slice(start, end);

  return {
    success: true,
    data: {
      data: paginatedCandidates,
      total: filteredCandidates.length,
      page,
      limit,
    },
  };
};

// Get candidate by ID
export const getCandidateById = async (
  id: string
): Promise<ApiResponse<Candidate>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const candidate = candidates.find((c) => c.id === id);

  if (!candidate) {
    throw new Error('Candidate not found');
  }

  return {
    success: true,
    data: candidate,
  };
};

// Create candidate
export const createCandidate = async (
  candidateData: Omit<Candidate, 'id'>
): Promise<ApiResponse<Candidate>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newCandidate: Candidate = {
    ...candidateData,
    id: `${candidates.length + 1}`,
  };

  candidates.push(newCandidate);

  return {
    success: true,
    data: newCandidate,
  };
};

// Update candidate
export const updateCandidate = async (
  id: string,
  candidateData: Partial<Candidate>
): Promise<ApiResponse<Candidate>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const index = candidates.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new Error('Candidate not found');
  }

  const updatedCandidate = {
    ...candidates[index],
    ...candidateData,
  };

  candidates[index] = updatedCandidate;

  return {
    success: true,
    data: updatedCandidate,
  };
};

// Delete candidate
export const deleteCandidate = async (
  id: string
): Promise<ApiResponse<null>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = candidates.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new Error('Candidate not found');
  }

  candidates.splice(index, 1);

  return {
    success: true,
    data: null,
  };
};

// Get candidate stages
export const getCandidateStages = async (): Promise<
  ApiResponse<string[]>
> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    success: true,
    data: ['Screening', 'Interview', 'Test Assignment', 'Offer', 'Hired', 'Rejected'],
  };
};

// Update candidate stage
export const updateCandidateStage = async (
  id: string,
  stage: string
): Promise<ApiResponse<Candidate>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = candidates.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new Error('Candidate not found');
  }

  const updatedCandidate = {
    ...candidates[index],
    stage,
  };

  candidates[index] = updatedCandidate;

  return {
    success: true,
    data: updatedCandidate,
  };
};
