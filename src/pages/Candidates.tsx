import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";

const Candidates = () => {
  const [search, setSearch] = useState("");
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: () => apiService.getCompanies(),
  });

  const handleCompanyClick = (id: string) => {
    setCompanyId((prev) => (prev === id ? undefined : id));
  };

  const filteredCompanies = companies?.items.filter((company) =>
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
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto h-full">
            <div className="flex h-full">
              {/* Company sidebar */}
              <div className="hidden md:block w-64 p-4 border-r border-recruitflow-beige-dark overflow-y-auto">
                <h2 className="font-medium mb-4 text-recruitflow-brown-dark">Клиент</h2>
                <div className="space-y-2">
                  {filteredCompanies?.map((company) => (
                    <Button
                      key={company.id}
                      variant="ghost"
                      className={`w-full justify-start text-left ${
                        companyId === company.id
                          ? "bg-recruitflow-brown/10"
                          : ""
                      }`}
                      onClick={() => handleCompanyClick(company.id)}
                    >
                      {company.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Kanban board */}
              <div className="flex-1 overflow-hidden">
                <KanbanBoard companyId={companyId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Candidates;
