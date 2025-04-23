
import { AuditLogEntry, ApiResponse, PaginatedResponse } from './types';

// Mock audit log entries
const auditLogs: AuditLogEntry[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    action: 'created',
    entityType: 'company',
    entityId: '1',
    entityName: 'IT-Bilim',
    timestamp: '2023-04-15T10:30:00Z',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    action: 'updated',
    entityType: 'vacancy',
    entityId: '1',
    entityName: 'Middle Frontend Developer',
    timestamp: '2023-04-16T14:20:00Z',
    details: {
      changedFields: ['salary', 'description'],
    },
  },
  {
    id: '3',
    userId: '1',
    userName: 'John Doe',
    action: 'moved',
    entityType: 'candidate',
    entityId: '1',
    entityName: 'Иван Петров',
    timestamp: '2023-04-17T09:45:00Z',
    details: {
      fromStage: 'Screening',
      toStage: 'Interview',
    },
  },
];

// Generate more audit logs for testing
for (let i = 4; i <= 30; i++) {
  const actions = ['created', 'updated', 'deleted', 'moved'];
  const entityTypes = ['company', 'vacancy', 'candidate'];
  const userIds = ['1', '2'];
  const userNames = ['John Doe', 'Jane Smith'];
  
  const action = actions[i % actions.length];
  const entityType = entityTypes[i % entityTypes.length] as 'company' | 'vacancy' | 'candidate';
  const userIdIndex = i % userIds.length;
  
  auditLogs.push({
    id: i.toString(),
    userId: userIds[userIdIndex],
    userName: userNames[userIdIndex],
    action,
    entityType,
    entityId: (i % 5 + 1).toString(),
    entityName: entityType === 'company' 
      ? 'Company ' + (i % 5 + 1) 
      : entityType === 'vacancy' 
        ? 'Vacancy ' + (i % 5 + 1)
        : 'Candidate ' + (i % 5 + 1),
    timestamp: new Date(2023, 3, i).toISOString(),
    details: action === 'moved' 
      ? { 
          fromStage: 'Stage A', 
          toStage: 'Stage B' 
        } 
      : action === 'updated' 
        ? { 
            changedFields: ['field1', 'field2'] 
          } 
        : undefined,
  });
}

// Sort audit logs by timestamp (newest first)
auditLogs.sort((a, b) => 
  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
);

// Get audit logs
export const getAuditLogs = async (
  page = 1,
  limit = 10,
  filters?: {
    userId?: string;
    entityType?: 'company' | 'vacancy' | 'candidate';
    entityId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }
): Promise<ApiResponse<PaginatedResponse<AuditLogEntry>>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredLogs = [...auditLogs];

  if (filters) {
    if (filters.userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === filters.userId);
    }

    if (filters.entityType) {
      filteredLogs = filteredLogs.filter(
        (log) => log.entityType === filters.entityType
      );
    }

    if (filters.entityId) {
      filteredLogs = filteredLogs.filter(
        (log) => log.entityId === filters.entityId
      );
    }

    if (filters.action) {
      filteredLogs = filteredLogs.filter(
        (log) => log.action === filters.action
      );
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.timestamp) >= startDate
      );
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.timestamp) <= endDate
      );
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredLogs = filteredLogs.filter(
        (log) =>
          log.entityName.toLowerCase().includes(searchLower) ||
          log.userName.toLowerCase().includes(searchLower)
      );
    }
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedLogs = filteredLogs.slice(start, end);

  return {
    success: true,
    data: {
      data: paginatedLogs,
      total: filteredLogs.length,
      page,
      limit,
    },
  };
};

// Get audit log entry by ID
export const getAuditLogById = async (
  id: string
): Promise<ApiResponse<AuditLogEntry>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const log = auditLogs.find((l) => l.id === id);

  if (!log) {
    throw new Error('Audit log entry not found');
  }

  return {
    success: true,
    data: log,
  };
};

// Create audit log entry
export const createAuditLog = async (
  logData: Omit<AuditLogEntry, 'id' | 'timestamp'>
): Promise<ApiResponse<AuditLogEntry>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newLog: AuditLogEntry = {
    ...logData,
    id: `${auditLogs.length + 1}`,
    timestamp: new Date().toISOString(),
  };

  auditLogs.unshift(newLog); // Add to the beginning (newest first)

  return {
    success: true,
    data: newLog,
  };
};
