import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import CompanyList from '@/components/companies/CompanyList';
import CompanyDetail from '@/components/companies/CompanyDetail';
import CompanyVacancies from '@/components/companies/CompanyVacancies';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Company } from '@/api/types';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCompanies } from '@/api/companies';

const CompaniesPage = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasActiveVacancies, setHasActiveVacancies] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'vacancy_count' | undefined>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ['companies', { page, hasActiveVacancies, sortBy, order }],
    queryFn: () => getCompanies(page, limit, hasActiveVacancies, sortBy, order),
    keepPreviousData: true,
  });

  const companies = data?.data.data || [];
  const total = data?.data.total || 0;
  const totalPages = Math.ceil(total / limit);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

//   useEffect(() => {
//     setSelectedCompany(null);
//   }, [page, hasActiveVacancies, sortBy, order]);
  useEffect(() => {
    if (!selectedCompany && filteredCompanies.length > 0) {
      setSelectedCompany(filteredCompanies[0]);
    }
  }, [filteredCompanies, selectedCompany]);

  const handlePrevPage = () => {
    setPage((old) => Math.max(old - 1, 1));
  };

  const handleNextPage = () => {
    setPage((old) => (old < totalPages ? old + 1 : old));
  };
//   console.log({ isLoading, error, companies, filteredCompanies, selectedCompany });
  return (
    <Layout>
      {/* Top filters */}
      <div className="mb-4 bg-recruitflow-beigeDark rounded-lg p-3 flex flex-wrap gap-3 items-center sticky top-20 z-10">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap mr-2 font-medium">Сортировать по</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field"
            >
              <option value="created_at">Дате изменения</option>
              <option value="name">Наименованию</option>
              <option value="vacancy_count">Кол-ву вакансий</option>
            </select>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
              className="input-field"
            >
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>
          </div>
        </div>

        <div className="flex-1 min-w-[200px] relative">
          <Input
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        <div className="flex-none flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasActiveVacancies === true}
            onChange={() =>
              setHasActiveVacancies(hasActiveVacancies === true ? undefined : true)
            }
            id="filter-active-vacancies"
            className="cursor-pointer"
          />
          <label htmlFor="filter-active-vacancies" className="select-none cursor-pointer">
            Показывать только компании с активными вакансиями
          </label>
        </div>
      </div>

      {/* Main content layout */}
      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-250px)] overflow-hidden">
        {/* Company list panel */}
        <div className="col-span-1 bg-recruitflow-beigeLight rounded-lg shadow-sm h-full overflow-y-auto flex flex-col">
          <CompanyList
            onSelectCompany={setSelectedCompany}
            selectedCompanyId={selectedCompany?.id}
            companies={filteredCompanies}
            isLoading={isLoading}
            error={error}
          />
          {/* Pagination controls */}
          <div className="p-3 flex justify-between items-center border-t border-recruitflow-beigeDark">
            <Button onClick={handlePrevPage} disabled={page === 1}>
              Предыдущая
            </Button>
            <span>Страница {page} из {totalPages}</span>
            <Button onClick={handleNextPage} disabled={page === totalPages}>
              Следующая
            </Button>
          </div>
        </div>

        {/* Company detail */}
        <div className="col-span-1 bg-recruitflow-beigeLight rounded-lg shadow-sm h-full overflow-y-auto">
          {selectedCompany ? (
            <CompanyDetail companyId={selectedCompany.id} key={selectedCompany.id} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-4">
                <h3 className="font-medium text-lg mb-2">Не выбрана компания</h3>
                <p className="text-gray-500">Выберите компанию из списка слева</p>
              </div>
            </div>
          )}
        </div>

        {/* Company vacancies */}
        <div className="col-span-1 bg-recruitflow-beigeLight rounded-lg shadow-sm h-full overflow-y-auto">
          {selectedCompany ? (
            <CompanyVacancies companyId={selectedCompany.id} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-4">
                <h3 className="font-medium text-lg mb-2">Не выбрана компания</h3>
                <p className="text-gray-500">Выберите компанию для просмотра вакансий</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CompaniesPage;