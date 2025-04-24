import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CompanyForm } from "@/components/forms/CompanyForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Companies = () => {
  const [search, setSearch] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Fetch companies
  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies", { search }],
    queryFn: () => apiService.getCompanies({ q: search }),
  });

  // Fetch selected company details
  const { data: selectedCompany } = useQuery({
    queryKey: ["company", selectedCompanyId],
    queryFn: () => (selectedCompanyId ? apiService.getCompanyById(selectedCompanyId) : null),
    enabled: !!selectedCompanyId,
  });

  // Fetch company vacancies
  const { data: companyVacancies } = useQuery({
    queryKey: ["company-vacancies", selectedCompanyId],
    queryFn: () => (selectedCompanyId ? apiService.getVacancies({ company_id: selectedCompanyId }) : []),
    enabled: !!selectedCompanyId,
  });

  // Fetch company representatives
  const { data: representatives } = useQuery({
    queryKey: ["company-representatives", selectedCompanyId],
    queryFn: () => (selectedCompanyId ? apiService.getRepresentatives(selectedCompanyId) : []),
    enabled: !!selectedCompanyId,
  });

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Filters bar */}
        <div className="bg-recruitflow-beige-light p-4 border-b border-recruitflow-beige-dark sticky top-16 z-10">
          <div className="container mx-auto flex flex-wrap gap-4 justify-between items-center">
            <div className="relative w-full md:w-auto max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Поиск компаний"
                className="pl-9 pr-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="absolute right-3 top-2.5"
                  onClick={() => setSearch("")}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto h-full">
            <div className="grid grid-cols-1 md:grid-cols-12 h-full">
              {/* Company list */}
              <div className="md:col-span-3 border-r border-recruitflow-beige-dark">
                <ScrollArea className="h-[calc(100vh-140px)] p-4">
                  <h2 className="font-medium mb-4 text-recruitflow-brown-dark">Компании</h2>
                  <div className="space-y-2">
                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-recruitflow-brown"></div>
                      </div>
                    ) : companies && companies.length > 0 ? (
                      companies.map((company) => (
                        <div
                          key={company.id}
                          className={`p-3 rounded-md cursor-pointer ${
                            selectedCompanyId === company.id
                              ? "bg-recruitflow-brown/10"
                              : "hover:bg-recruitflow-beige"
                          }`}
                          onClick={() => setSelectedCompanyId(company.id)}
                        >
                          <div className="font-medium">{company.name}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Компании не найдены
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Company details */}
              <div className="md:col-span-5 border-r border-recruitflow-beige-dark">
                <ScrollArea className="h-[calc(100vh-140px)] p-6">
                  {selectedCompany ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold uppercase">О КОМПАНИИ</h2>
                        <Button
                          variant="outline"
                          onClick={() => setEditDialogOpen(true)}
                        >
                          Изменить
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Название компании</p>
                          <p className="font-medium">{selectedCompany.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Юридическое название</p>
                          <p className="font-medium">{selectedCompany.legal_name || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Сфера деятельности</p>
                          <p className="font-medium">{selectedCompany.activity_field || "—"}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-bold mb-2 uppercase">Описание</h3>
                        <p className="text-sm">
                          {selectedCompany.description || "Описание отсутствует"}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-bold mb-2 uppercase">Представители</h3>
                        {representatives && representatives.length > 0 ? (
                          representatives.map((rep, index) => (
                            <div key={rep.id} className="mb-4">
                              <p className="font-medium">
                                {index + 1}. {rep.first_name} {rep.last_name} {rep.middle_name || ""}
                              </p>
                              {rep.phone && (
                                <p className="text-sm text-gray-500">📞 {rep.phone}</p>
                              )}
                              {rep.email && (
                                <p className="text-sm text-gray-500">✉️ {rep.email}</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">Нет представителей</p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Создано</p>
                            <p className="font-medium">
                              {new Date(selectedCompany.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Обновлено</p>
                            <p className="font-medium">
                              {new Date(selectedCompany.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-gray-500">Выберите компанию для просмотра информации</p>
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Company vacancies */}
              <div className="md:col-span-4">
                <ScrollArea className="h-[calc(100vh-140px)] p-4">
                  <h2 className="font-medium mb-4 text-recruitflow-brown-dark">Вакансии компании</h2>
                  <div className="space-y-3">
                    {companyVacancies && companyVacancies.length > 0 ? (
                      companyVacancies.map((vacancy) => (
                        <div key={vacancy.id} className="bg-white rounded-md p-3 shadow-sm">
                          <h3 className="font-medium">{vacancy.title}</h3>
                          <p className="text-sm text-gray-600">{vacancy.description || "—"}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {vacancy.skills?.map((skill) => (
                              <span key={skill.id} className="bg-gray-200 text-sm px-2 py-1 rounded">
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        {selectedCompanyId
                          ? "У этой компании нет вакансий"
                          : "Выберите компанию для просмотра вакансий"}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Редактировать компанию</DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <CompanyForm
              initialData={selectedCompany}
              companyId={selectedCompany.id}
              onSuccess={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Companies;
