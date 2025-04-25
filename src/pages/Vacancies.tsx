import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { VacancyKanbanBoard } from "@/components/kanban/VacancyKanbanBoard";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Vacancies = () => {
  const [search, setSearch] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const [companyId, setCompanyId] = useState<number | undefined>(undefined);

  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: () => apiService.getCompanies(),
  });

  const handleCompanyClick = (id: number) => {
    setCompanyId(id === companyId ? undefined : id);
  };

  const filteredCompanies = companies?.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Filters bar */}
        <div className="bg-recruitflow-beige-light p-4 border-b border-recruitflow-beige-dark sticky top-16 z-10">
          <div className="container mx-auto flex flex-wrap gap-4 justify-between items-center">
            <div className="relative w-full md:w-auto max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Поиск"
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

            <div className="flex items-center space-x-2">
              <Switch
                id="active-only"
                checked={showOnlyActive}
                onCheckedChange={setShowOnlyActive}
              />
              <Label htmlFor="active-only">Показывать только активные вакансии</Label>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto h-full">
            <div className="flex h-full">
              {/* Company sidebar */}
              <div className="hidden md:block w-64 p-4 border-r border-recruitflow-beige-dark overflow-y-auto">
                <h2 className="font-medium mb-4 text-recruitflow-brown-dark">Клиенты</h2>
                <div className="space-y-2">
                  {isLoading ? (
                    <div className="text-sm text-gray-500">Загрузка...</div>
                  ) : filteredCompanies?.length ? (
                    filteredCompanies.map((company) => (
                      <Button
                        key={company.id}
                        variant="ghost"
                        className={`w-full justify-start text-left ${
                          companyId === company.id ? "bg-recruitflow-brown/10" : ""
                        }`}
                        onClick={() => handleCompanyClick(company.id)}
                      >
                        {company.name}
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Компании не найдены</p>
                  )}
                </div>
              </div>

              {/* Kanban board */}
              <div className="flex-1 overflow-hidden">
                <VacancyKanbanBoard companyId={companyId} showOnlyActive={showOnlyActive} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Vacancies;