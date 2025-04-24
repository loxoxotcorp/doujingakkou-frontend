import { Application } from "@/types/apiTypes";
import { KanbanCard } from "./KanbanCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useRef, useEffect } from "react";

interface KanbanColumnProps {
  id: string;
  title: string;
  applications: Application[];
  onCardClick: (applicationId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  applications,
  onCardClick,
}) => {
  const { setNodeRef } = useDroppable({
    id: `column-${id}`,
    data: {
      stage_id: id,
      type: "column",
    },
  });

  const columnRef = useRef<HTMLDivElement>(null);

  // Прокрутка вниз при добавлении новой карточки
  useEffect(() => {
    if (columnRef.current) {
      const { scrollHeight, clientHeight } = columnRef.current;
      if (scrollHeight > clientHeight) {
        columnRef.current.scrollTop = scrollHeight - clientHeight;
      }
    }
  }, [applications.length]);

  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
      style={{ height: "calc(100vh - 200px)" }}
    >
      <h3 className="font-medium mb-4 text-center text-recruitflow-brown-dark">
        {title}{" "}
        <span className="text-sm text-gray-500">({applications.length})</span>
      </h3>

      <div
        ref={columnRef}
        className="overflow-y-auto h-[calc(100%-40px)] pb-4"
      >
        <SortableContext
          items={applications.map((app) => app.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((application) => (
            <KanbanCard
              key={application.id}
              application={application}
              onClick={() => onCardClick(application.id)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
