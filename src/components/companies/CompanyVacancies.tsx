
import { useQuery } from '@tanstack/react-query';
import { getVacancies } from '@/api/vacancies';
import { Vacancy } from '@/api/types';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface CompanyVacanciesProps {
  companyId: string;
}

const CompanyVacancies = ({ companyId }: CompanyVacanciesProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['vacancies', { companyId }],
    queryFn: () => getVacancies(1, 100, { companyId }).then(res => res.data)
  });

  if (isLoading) {
    return <div className="p-4 text-center">Loading vacancies...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading vacancies</div>;
  }

  const vacancies = data?.data || [];

  if (vacancies.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="font-medium text-lg mb-2">Нет активных вакансий</h3>
          <p className="text-gray-500">Для этой компании еще нет вакансий</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full scrollable-container">
      <div className="space-y-4 p-4">
        {vacancies.map((vacancy: Vacancy) => (
          <motion.div
            key={vacancy.id}
            className="card-container"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="font-bold mb-1">{vacancy.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{vacancy.companyName}</p>
            
            {vacancy.salary && (
              <div className="text-sm mb-2">
                {vacancy.salary.amount.toLocaleString()} {vacancy.salary.currency}
              </div>
            )}
            
            <div className="flex flex-wrap gap-1 mt-2">
              {vacancy.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="skill-tag">
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompanyVacancies;
