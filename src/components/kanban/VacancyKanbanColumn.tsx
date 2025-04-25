import { Vacancy } from "@/types/apiTypes";
import { VacancyKanbanCard } from "./VacancyKanbanCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface VacancyKanbanColumnProps {
  id: string;
  title: string;
  vacancies: Vacancy[];
  onCardClick: (vacancyId: string) => void;
}

export const VacancyKanbanColumn: React.FC<VacancyKanbanColumnProps> = ({
  id,
  title,
  vacancies,
  onCardClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      stage_id: id,
      type: "column",
    },
  });
const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (columnRef.current) {
      const { scrollHeight, clientHeight } = columnRef.current;
      if (scrollHeight > clientHeight) {
        columnRef.current.scrollTop = scrollHeight - clientHeight;
      }
    }
  }, [vacancies.length]);

  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
      style={{ height: "calc(100vh - 200px)" }}
    >
      <h3 className="font-medium mb-4 text-center text-recruitflow-brown-dark">
        {title} id:{id} <span className="text-sm text-gray-500">({vacancies.length})</span>
      </h3>
      {isOver && (
        <div className="absolute inset-0 bg-recruitflow-brown/10 flex justify-center items-center text-xl font-bold text-recruitflow-brown">
          {id}
        </div>
      )}

      <div
        ref={columnRef}
        className="overflow-y-auto h-[calc(100%-40px)] pb-4"
      >
        <SortableContext
          items={vacancies.map((vacancy) => vacancy.id)}
          strategy={verticalListSortingStrategy}
        >
          {vacancies.map((vacancy) => (
            <VacancyKanbanCard
              key={vacancy.id}
              vacancy={vacancy}
              onClick={() => onCardClick(vacancy.id)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
