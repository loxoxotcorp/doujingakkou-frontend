import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCompany } from '@/api/companies';
import { createVacancy } from '@/api/vacancies';
import { createCandidate } from '@/api/candidates';
import { toast } from 'sonner';

interface AddEntityFormProps {
  onClose: () => void;
}

const AddEntityForm = ({ onClose }: AddEntityFormProps) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('company');

  // Company form state
  const [company, setCompany] = useState({
    name: '',
    legalName: '',
    description: '',
    industry: '',
    logoUrl: '', // если есть поддержка логотипа
  });

  // Vacancy form state
  const [vacancy, setVacancy] = useState({
    title: '',
    companyId: '1',
    companyName: 'IT-Bilim',
    salary: {
      amount: 0,
      currency: 'сум',
    },
    skills: '',
    status: 'active' as const,
  });

  // Candidate form state
  const [candidate, setCandidate] = useState({
    firstName: '',
    lastName: '',
    position: '',
    companyName: '',
    skills: '',
    languages: [{ language: 'Английский', level: 'B1' }],
    region: '',
    education: '',
    status: 'active' as const,
  });

  const companyMutation = useMutation({
    mutationFn: (companyData: typeof company) => {
      const payload = {
        name: companyData.name,
        legal_name: companyData.legalName || undefined,
        activity_field: companyData.industry || undefined,
        description: companyData.description || undefined,
        logo_url: companyData.logoUrl || undefined,
      };
      return createCompany(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Компания успешно создана');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при создании компании: ${error.message}`);
    },
  });

  const vacancyMutation = useMutation({
    mutationFn: createVacancy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      toast.success('Вакансия успешно создана');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при создании вакансии: ${error.message}`);
    },
  });

  const candidateMutation = useMutation({
    mutationFn: createCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast.success('Кандидат успешно создан');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при создании кандидата: ${error.message}`);
    },
  });

  const handleSubmit = () => {
    if (activeTab === 'company') {
      if (!company.name) {
        toast.error('Название компании обязательно');
        return;
      }
      companyMutation.mutate(company);
    } else if (activeTab === 'vacancy') {
      if (!vacancy.title) {
        toast.error('Название вакансии обязательно');
        return;
      }
      vacancyMutation.mutate({
        ...vacancy,
        skills: vacancy.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
    } else if (activeTab === 'candidate') {
      if (!candidate.firstName || !candidate.lastName) {
        toast.error('Имя и фамилия кандидата обязательны');
        return;
      }
      candidateMutation.mutate({
        ...candidate,
        skills: candidate.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
    }
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="company">Компания</TabsTrigger>
          <TabsTrigger value="vacancy">Вакансия</TabsTrigger>
          <TabsTrigger value="candidate">Кандидат</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Название компании</Label>
              <Input
                id="company-name"
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                placeholder="Введите название компании"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legal-name">Юридическое название</Label>
              <Input
                id="legal-name"
                value={company.legalName}
                onChange={(e) => setCompany({ ...company, legalName: e.target.value })}
                placeholder="Введите юридическое название"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Сфера деятельности</Label>
              <Input
                id="industry"
                value={company.industry}
                onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                placeholder="Введите сферу деятельности"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={company.description}
                onChange={(e) => setCompany({ ...company, description: e.target.value })}
                placeholder="Введите описание компании"
                rows={3}
              />
            </div>
            {/* Если есть логотип */}
            {/*<div className="space-y-2">
              <Label htmlFor="logo-url">URL логотипа</Label>
              <Input
                id="logo-url"
                value={company.logoUrl}
                onChange={(e) => setCompany({ ...company, logoUrl: e.target.value })}
                placeholder="Введите URL логотипа"
              />
            </div>*/}
          </div>
        </TabsContent>

        <TabsContent value="vacancy">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vacancy-title">Название вакансии</Label>
              <Input
                id="vacancy-title"
                value={vacancy.title}
                onChange={(e) => setVacancy({ ...vacancy, title: e.target.value })}
                placeholder="Введите название вакансии"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-name">Название компании</Label>
              <Input
                id="company-name"
                value={vacancy.companyName}
                onChange={(e) => setVacancy({ ...vacancy, companyName: e.target.value })}
                placeholder="Введите название компании"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Зарплата</Label>
                <Input
                  id="salary"
                  type="number"
                  value={vacancy.salary.amount}
                  onChange={(e) =>
                    setVacancy({
                      ...vacancy,
                      salary: { ...vacancy.salary, amount: Number(e.target.value) },
                    })
                  }
                  placeholder="Введите сумму"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Валюта</Label>
                <Input
                  id="currency"
                  value={vacancy.salary.currency}
                  onChange={(e) =>
                    setVacancy({
                      ...vacancy,
                      salary: { ...vacancy.salary, currency: e.target.value },
                    })
                  }
                  placeholder="Введите валюту"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Навыки (через запятую)</Label>
              <Input
                id="skills"
                value={vacancy.skills}
                onChange={(e) => setVacancy({ ...vacancy, skills: e.target.value })}
                placeholder="HTML, CSS, JavaScript, React"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="candidate">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Имя</Label>
                <Input
                  id="first-name"
                  value={candidate.firstName}
                  onChange={(e) => setCandidate({ ...candidate, firstName: e.target.value })}
                  placeholder="Введите имя"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Фамилия</Label>
                <Input
                  id="last-name"
                  value={candidate.lastName}
                  onChange={(e) => setCandidate({ ...candidate, lastName: e.target.value })}
                  placeholder="Введите фамилию"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Должность</Label>
              <Input
                id="position"
                value={candidate.position}
                onChange={(e) => setCandidate({ ...candidate, position: e.target.value })}
                placeholder="Введите должность"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Компания</Label>
              <Input
                id="company"
                value={candidate.companyName}
                onChange={(e) => setCandidate({ ...candidate, companyName: e.target.value })}
                placeholder="Введите компанию"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="candidate-skills">Навыки (через запятую)</Label>
              <Input
                id="candidate-skills"
                value={candidate.skills}
                onChange={(e) => setCandidate({ ...candidate, skills: e.target.value })}
                placeholder="HTML, CSS, JavaScript, React"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Регион</Label>
              <Input
                id="region"
                value={candidate.region}
                onChange={(e) => setCandidate({ ...candidate, region: e.target.value })}
                placeholder="Введите регион"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Образование</Label>
              <Input
                id="education"
                value={candidate.education}
                onChange={(e) => setCandidate({ ...candidate, education: e.target.value })}
                placeholder="Введите образование"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            (activeTab === 'company' && !company.name) ||
            (activeTab === 'vacancy' && !vacancy.title) ||
            (activeTab === 'candidate' && (!candidate.firstName || !candidate.lastName))
          }
        >
          Создать
        </Button>
      </div>
    </div>
  );
};

export default AddEntityForm;