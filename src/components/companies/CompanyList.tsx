import { Company } from '@/api/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CompanyListProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  selectedCompanyId?: string;
  isLoading?: boolean;
  error?: unknown;
}

const CompanyList = ({
  companies,
  onSelectCompany,
  selectedCompanyId,
  isLoading,
  error,
}: CompanyListProps) => {

  if (isLoading) {
    return <div className="p-4 text-center">Loading companies...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading companies</div>;
  }

  return (
    <div className="h-full scrollable-container">
      <h2 className="text-xl font-bold p-4 pb-2 text-recruitflow-brownDark">Клиент</h2>
      <div className="space-y-2 p-2">
        {companies.map((company) => (
          <motion.div
            key={company.id}
            className={cn(
              "rounded-md p-3 cursor-pointer",
              "border transition-all duration-200",
              selectedCompanyId === company.id
                ? "bg-white border-recruitflow-brown shadow-md"
                : "bg-white border-recruitflow-beigeDark hover:border-recruitflow-brown"
            )}
            onClick={() => onSelectCompany(company)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="font-medium">{company.name}</div>
            <div className="text-sm text-gray-600">
              <div>Вакансий: {company.totalVacancies}</div>
              <div>Активных вакансий: {company.activeVacancies}</div>
            </div>
            {selectedCompanyId === company.id && company.logoUrl && (
              <div className="mt-2 flex justify-center">
                <img 
                  src={company.logoUrl} 
                  alt={company.name} 
                  className="h-16 object-contain"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;