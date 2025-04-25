import { Vacancy } from "@/types/apiTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VacancyKanbanCardProps {
  vacancy: Vacancy;
  onClick: () => void;
  className?: string;
}

export const VacancyKanbanCard: React.FC<VacancyKanbanCardProps> = ({
  vacancy,
  onClick,
  className,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: vacancy.id,
    data: {
      stage_id: vacancy.current_stage_id,
      type: "card",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("kanban-card", className)}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col">
        {/* Название вакансии */}
        <h4 className="font-medium text-recruitflow-brown-dark mb-1">
          {vacancy.title}
        </h4>

        {/* Компания и зарплата */}
        <div className="text-sm text-gray-600 mb-2">
          <div className="text-xs">
            {vacancy.salary_amount} {vacancy.salary_currency}
          </div>
        </div>

        {/* Навыки */}
        {vacancy.skills && vacancy.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {vacancy.skills.slice(0, 3).map((skill) => (
              <span key={skill.id} className="skill-tag">
                {skill.name}
              </span>
            ))}
            {vacancy.skills.length > 3 && (
              <span className="skill-tag">
                +{vacancy.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Дата обновления */}
        <div className="text-xs text-gray-400 mt-2">
          {new Date(vacancy.updated_at).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};
