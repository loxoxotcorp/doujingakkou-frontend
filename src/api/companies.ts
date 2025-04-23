import { Company, ApiResponse, PaginatedResponse, CompanyContact } from './types';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

const API_BASE = 'http://127.0.0.1:8000/api/companies';

export function transformCompany(apiCompany: any): Company {
  return {
    id: String(apiCompany.id),
    name: apiCompany.name,
    legalName: apiCompany.legal_name ?? '',
    description: apiCompany.description ?? '',
    industry: apiCompany.activity_field ?? '',
    logoUrl: apiCompany.logo_url ?? '',
    contacts: (apiCompany.representatives ?? []).map((rep: any): CompanyContact => ({
      id: String(rep.id),
      firstName: rep.first_name ?? '',
      lastName: rep.last_name ?? '',
      middleName: rep.middle_name ?? '',
      position: rep.position ?? '',
      phones: rep.phones ?? [],
      emails: rep.emails ?? [],
    })),
    createdBy: apiCompany.created_by ?? '',
    createdAt: apiCompany.created_at,
    updatedBy: apiCompany.updated_by ?? '',
    updatedAt: apiCompany.updated_at,
  };
}

export const getCompanies = async (
  page = 1,
  limit = 10,
  hasActiveVacancies?: boolean,
  sortBy?: 'name' | 'created_at' | 'vacancy_count',
  order: 'asc' | 'desc' = 'asc',
): Promise<ApiResponse<PaginatedResponse<Company>>> => {
  const skip = (page - 1) * limit;
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(skip),
  });

  if (hasActiveVacancies !== undefined) {
    params.append('has_active_vacancies', String(hasActiveVacancies));
  }
  if (sortBy) params.append('sort_by', sortBy);
  if (order) params.append('order', order);

  const url = `${API_BASE}?${params.toString()}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: getToken() ? `Bearer ${getToken()}` : '',
    },
  });
  if (!res.ok) throw new Error(await res.text());

  const data = await res.json();

  return {
    success: true,
    data: {
      data: data.data.map(transformCompany),
      total: data.total,
      page,
      limit,
    },
  };
};

export const getCompanyById = async (
  id: string
): Promise<ApiResponse<Company>> => {
  console.log("Fetching company by ID:", id);
  const encodedId = encodeURIComponent(id);
  const url = `${API_BASE}/${encodedId}`;
  const res = await fetch(url, {
    headers: {
      Authorization: getToken() ? `Bearer ${getToken()}` : '',
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }
  const apiCompany = await res.json();
  console.log("Raw apiCompany from backend:", apiCompany);
  console.log('getCompanyById response:', res.data);
  const transformed = transformCompany(apiCompany);
  console.log("Transformed company:", transformed);
  return {
    success: true,
    data: transformed,
  };
};

export const createCompany = async (
  companyData: Partial<Company>
): Promise<ApiResponse<Company>> => {
  const payload = {
    name: companyData.name,
    legal_name: companyData.legalName || null,
    activity_field: companyData.industry || null,
    description: companyData.description || null,
    logo_url: companyData.logoUrl || null,
  };
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken() ? `Bearer ${getToken()}` : '',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  const apiCompany = await res.json();
  return {
    success: true,
    data: transformCompany(apiCompany),
  };
};

export const updateCompany = async (
  id: string,
  companyData: Partial<Company>
): Promise<ApiResponse<Company>> => {
  const payload = {
    name: companyData.name,
    legal_name: companyData.legalName || null,
    activity_field: companyData.industry || null,
    description: companyData.description || null,
    logo_url: companyData.logoUrl || null,
  };
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken() ? `Bearer ${getToken()}` : '',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  const apiCompany = await res.json();
  return {
    success: true,
    data: transformCompany(apiCompany),
  };
};

export const deleteCompany = async (
  id: string
): Promise<ApiResponse<null>> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: getToken() ? `Bearer ${getToken()}` : '',
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return {
    success: true,
    data: null,
  };
};