import { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/api/audit';
import { useInView } from 'react-intersection-observer';
import { format } from 'date-fns';
import { Search, Calendar } from 'lucide-react';
import { AuditLogEntry } from '@/api/types';

const AuditTrailPage = () => {
  const [filters, setFilters] = useState({
    entityType: '',
    action: '',
    search: '',
    startDate: '',
    endDate: '',
  });

  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['audit-logs', filters],
    queryFn: ({ pageParam = 1 }) => {
      return getAuditLogs(pageParam, 20, {
        entityType: filters.entityType as 'company' | 'vacancy' | 'candidate' || undefined,
        action: filters.action || undefined,
        search: filters.search || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      }).then((res) => res.data);
    },
    getNextPageParam: (lastPage) => {
      const { page, total, limit } = lastPage;
      const totalPages = Math.ceil(total / limit);
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const logs = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch {
      return dateString;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'created':
        return 'Created';
      case 'updated':
        return 'Updated';
      case 'deleted':
        return 'Deleted';
      case 'moved':
        return 'Moved';
      default:
        return action;
    }
  };

  const getActionDetails = (log: AuditLogEntry) => {
    if (log.action === 'moved' && log.details) {
      return `from ${log.details.fromStage} to ${log.details.toStage}`;
    } else if (log.action === 'updated' && log.details?.changedFields) {
      return `fields: ${log.details.changedFields.join(', ')}`;
    }
    return '';
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      entityType: '',
      action: '',
      search: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Audit Trail</h1>

      <div className="bg-recruitflow-beigeDark rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Entity Type</label>
            <Select
              value={filters.entityType}
              onValueChange={(value) => handleFilterChange('entityType', value)}
            >
              <SelectTrigger className="input-field">
                <SelectValue placeholder="All entity types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="vacancy">Vacancy</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Action</label>
            <Select
              value={filters.action}
              onValueChange={(value) => handleFilterChange('action', value)}
            >
              <SelectTrigger className="input-field">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
                <SelectItem value="moved">Moved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <div className="relative">
              <Input
                placeholder="Search by entity name or user"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <div className="relative">
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="input-field"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <div className="relative">
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="input-field"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="h-[calc(100vh-350px)] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[150px]">User</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
                <TableHead className="w-[150px]">Entity Type</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead className="w-[200px]">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {status === 'pending' ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading audit logs...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {formatDate(log.timestamp)}
                    </TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                        ${log.action === 'created'
                          ? 'bg-green-100 text-green-800'
                          : log.action === 'updated'
                          ? 'bg-blue-100 text-blue-800'
                          : log.action === 'deleted'
                          ? 'bg-red-100 text-red-800'
                          : log.action === 'moved'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getActionLabel(log.action)}
                      </span>
                    </TableCell>
                    <TableCell className="capitalize">{log.entityType}</TableCell>
                    <TableCell>{log.entityName}</TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {getActionDetails(log)}
                    </TableCell>
                  </TableRow>
                ))
              )}

              <TableRow ref={ref}>
                <TableCell colSpan={6} className="py-2 text-center">
                  {isFetchingNextPage ? (
                    <div className="text-center py-4">Loading more logs...</div>
                  ) : hasNextPage ? (
                    <Button
                      variant="ghost"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      Load more
                    </Button>
                  ) : (
                    logs.length > 0 && (
                      <div className="text-center py-4 text-gray-500">
                        End of audit trail
                      </div>
                    )
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default AuditTrailPage;
