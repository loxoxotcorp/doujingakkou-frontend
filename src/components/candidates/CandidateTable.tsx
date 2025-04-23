
import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Candidate } from '@/api/types';
import { Badge } from '@/components/ui/badge';
import { useInView } from 'react-intersection-observer';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getCandidates } from '@/api/candidates';
import { Button } from '@/components/ui/button';

interface CandidateTableProps {
  searchQuery?: string;
  filters?: {
    skills?: string[];
    languages?: string[];
  };
  onRowClick: (candidate: Candidate) => void;
}

const columnHelper = createColumnHelper<Candidate>();

const CandidateTable = ({ searchQuery, filters, onRowClick }: CandidateTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { ref, inView } = useInView();
  
  const columns = [
    columnHelper.accessor('firstName', {
      header: 'Фамилия Имя кандидата',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.lastName} {row.original.firstName}
        </div>
      ),
    }),
    columnHelper.accessor('position', {
      header: 'Специальность',
      cell: ({ getValue }) => getValue() || '-',
    }),
    columnHelper.accessor('skills', {
      header: 'Навыки',
      cell: ({ getValue }) => (
        <div className="flex flex-wrap gap-1">
          {getValue().map((skill, index) => (
            <Badge key={index} variant="outline" className="skill-tag">
              {skill}
            </Badge>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor('region', {
      header: 'Регион',
      cell: ({ getValue }) => getValue() || '-',
    }),
    columnHelper.accessor('education', {
      header: 'Образование',
      cell: ({ getValue }) => getValue() || '-',
    }),
    columnHelper.accessor('languages', {
      header: 'Знание языков',
      cell: ({ getValue }) => (
        <div className="flex flex-wrap gap-1">
          {getValue().map((lang, index) => (
            <Badge key={index} variant="outline" className="language-tag">
              {`${lang.language} - ${lang.level}`}
            </Badge>
          ))}
        </div>
      ),
    }),
  ];

  // Fetch candidates with infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['candidates-table', searchQuery, filters],
    queryFn: ({ pageParam = 1 }) => {
      return getCandidates(pageParam, 15, {
        search: searchQuery,
        skills: filters?.skills,
        languages: filters?.languages,
      }).then((res) => res.data);
    },
    getNextPageParam: (lastPage) => {
      const { page, total, limit } = lastPage;
      const totalPages = Math.ceil(total / limit);
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Load more when reaching the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten the pages into a single array of candidates
  const candidates = data?.pages.flatMap((page) => page.data) || [];
  const totalCount = data?.pages[0]?.total || 0;

  const table = useReactTable({
    data: candidates,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (status === 'pending') {
    return <div className="text-center p-8">Loading candidates...</div>;
  }

  if (status === 'error') {
    return <div className="text-center p-8 text-red-500">Error loading candidates</div>;
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-bold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick(row.original)}
                className="cursor-pointer hover:bg-recruitflow-beigeLight"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No candidates found.
              </TableCell>
            </TableRow>
          )}
          
          {/* Loading row */}
          <TableRow ref={ref}>
            <TableCell colSpan={columns.length} className="py-2 text-center">
              {isFetchingNextPage ? (
                <div className="text-center py-4">Loading more candidates...</div>
              ) : hasNextPage ? (
                <Button variant="ghost" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  Load more
                </Button>
              ) : (
                candidates.length > 0 && (
                  <div className="text-center py-4 text-gray-500">
                    Показано {candidates.length} из {totalCount}
                  </div>
                )
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CandidateTable;
