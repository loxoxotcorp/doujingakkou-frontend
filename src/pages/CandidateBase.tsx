import { useEffect, useRef, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import apiService from "@/services/api";
import { Candidate } from "@/types/apiTypes";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const CandidateBase = () => {
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ["candidates", search],
    queryFn: ({ pageParam = 0 }) =>
      apiService.getCandidates({ search, offset: pageParam, limit: 15 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((total, page) => total + page.items.length, 0);
      return totalFetched < lastPage.total ? totalFetched : undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const candidates = data?.pages.flatMap((page) => page.items) || [];

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div className="bg-recruitflow-beige-light p-4 border-b border-recruitflow-beige-dark sticky top-16 z-10">
          <div className="container mx-auto flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Поиск кандидатов..."
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

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto">
            <table className="w-full border-collapse">
              <thead className="bg-recruitflow-beige-light sticky top-0">
                <tr>
                  <th className="p-3 text-left">ФИО</th>
                  <th className="p-3 text-left">Специальность</th>
                  <th className="p-3 text-left">Навыки</th>
                  <th className="p-3 text-left">Регион</th>
                  <th className="p-3 text-left">Образование</th>
                  <th className="p-3 text-left">Языки</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-recruitflow-brown mx-auto"></div>
                    </td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-gray-500">
                      Кандидаты не найдены
                    </td>
                  </tr>
                ) : (
                  candidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="border-b border-recruitflow-beige hover:bg-recruitflow-beige/20 cursor-pointer"
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setDetailsOpen(true);
                      }}
                    >
                      <td className="p-3">{candidate.last_name} {candidate.first_name}</td>
                      <td className="p-3">{candidate.specialization || "—"}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills?.slice(0, 3).map((skill) => (
                            <span key={skill.id} className="skill-tag">{skill.name}</span>
                          ))}
                          {candidate.skills && candidate.skills.length > 3 && (
                            <span className="skill-tag">+{candidate.skills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">{candidate.location || "—"}</td>
                      <td className="p-3">{candidate.education || "—"}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {candidate.languages?.map((lang) => (
                            <span key={lang.id} className="skill-tag">
                              {lang.name} {lang.level && `(${lang.level})`}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div ref={observerTarget} className="h-10 flex justify-center items-center">
              {isFetchingNextPage && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-recruitflow-brown my-4"></div>
              )}
            </div>

            {data?.pages[0].total && (
              <div className="text-center text-sm text-gray-500 pb-4">
                Показано {candidates.length} из {data.pages[0].total}
              </div>
            )}
          </div>
        </div>
      </div>

      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="w-full md:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Информация о кандидате</SheetTitle>
          </SheetHeader>
          {selectedCandidate ? (
            <ScrollArea className="h-[calc(100vh-100px)] pr-4">
              <div className="space-y-4 py-4">
                <h2 className="text-xl font-semibold">
                  {selectedCandidate.last_name} {selectedCandidate.first_name} {selectedCandidate.middle_name || ""}
                </h2>

                <p className="text-gray-600">{selectedCandidate.specialization || "—"}</p>

                <div className="grid grid-cols-2 gap-3">
                  {selectedCandidate.email && <Info label="Email" value={selectedCandidate.email} />}
                  {selectedCandidate.phone && <Info label="Телефон" value={selectedCandidate.phone} />}
                  {selectedCandidate.location && <Info label="Регион" value={selectedCandidate.location} />}
                  {selectedCandidate.experience_years !== undefined &&
                    <Info label="Опыт" value={`${selectedCandidate.experience_years} лет`} />}
                </div>

                {selectedCandidate.education && (
                  <Info label="Образование" value={selectedCandidate.education} />
                )}

                {selectedCandidate.skills?.length > 0 && (
                  <TagBlock label="Навыки" items={selectedCandidate.skills.map(s => s.name)} />
                )}

                {selectedCandidate.languages?.length > 0 && (
                  <TagBlock label="Языки" items={selectedCandidate.languages.map(l => `${l.name}${l.level ? ` (${l.level})` : ""}`)} />
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex justify-center items-center h-40 text-gray-500">
              Выберите кандидата для просмотра информации
            </div>
          )}
        </SheetContent>
      </Sheet>
    </MainLayout>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p>{value}</p>
  </div>
);

const TagBlock = ({ label, items }: { label: string; items: string[] }) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <div className="flex flex-wrap gap-1">
      {items.map((item, idx) => (
        <span key={idx} className="skill-tag">{item}</span>
      ))}
    </div>
  </div>
);

export default CandidateBase;
