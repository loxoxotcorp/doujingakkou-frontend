import { CompanyContact, ApiResponse } from './types';

function getToken(): string | null {
  return localStorage.getItem('token');
}

const API_PREFIX = '/api/companies';

function transformRep(rep: any): CompanyContact {
  return {
    id: String(rep.id),
    firstName: rep.first_name,
    lastName: rep.last_name,
    middleName: rep.middle_name || '',
    position: '', // бекенд пока не выдаёт позицию представителя
    phones: rep.phone ? [rep.phone] : [],
    emails: rep.email ? [rep.email] : [],
  };
}

// Получить список представителей компании
export const getCompanyRepresentatives = async (companyId: string): Promise => {
  const res = await fetch(`${API_PREFIX}/${companyId}/representatives/`, {
    headers: {
      'Authorization': getToken() ? `Bearer ${getToken()}` : '',
    }
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.map(transformRep);
};

// Добавить представителя
export const addCompanyRepresentative = async (
  companyId: string,
  contact: Partial
): Promise => {
  const payload = {
    first_name: contact.firstName,
    last_name: contact.lastName,
    middle_name: contact.middleName,
    phone: contact.phones && contact.phones[0] ? contact.phones[0] : undefined,
    email: contact.emails && contact.emails[0] ? contact.emails[0] : undefined,
  };

  const res = await fetch(`${API_PREFIX}/${companyId}/representatives/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken() ? `Bearer ${getToken()}` : '',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return transformRep(data);
};

// Обновить представителя
export const updateCompanyRepresentative = async (
  companyId: string,
  repId: string,
  contact: Partial
): Promise => {
  const payload = {
    first_name: contact.firstName,
    last_name: contact.lastName,
    middle_name: contact.middleName,
    phone: contact.phones && contact.phones[0] ? contact.phones[0] : undefined,
    email: contact.emails && contact.emails[0] ? contact.emails[0] : undefined,
  };

  const res = await fetch(`${API_PREFIX}/${companyId}/representatives/${repId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken() ? `Bearer ${getToken()}` : '',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return transformRep(data);
};

// Удалить представителя
export const deleteCompanyRepresentative = async (
  companyId: string,
  repId: string,
): Promise => {
  const res = await fetch(`${API_PREFIX}/${companyId}/representatives/${repId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': getToken() ? `Bearer ${getToken()}` : '',
    }
  });
  if (!res.ok) throw new Error(await res.text());
};