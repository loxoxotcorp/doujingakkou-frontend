import { Application } from "@/types/apiTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  application: Application;
  onClick: () => void;
  className?: string;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  application,
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
    id: application.id,
    data: {
      stage_id: application.current_stage_id,
      type: "card",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const candidateName = `${application.candidate.first_name} ${application.candidate.last_name}`;
  const vacancyTitle = application.vacancy.title;
  const companyName = application.vacancy.company_name;
  const candidateSkills = application.candidate.skills || [];

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
        {/* Candidate name */}
        <h4 className="font-medium text-recruitflow-brown-dark mb-1">
          {candidateName}
        </h4>

        {/* Position and company */}
        <div className="text-sm text-gray-600 mb-2">
          <div>{vacancyTitle}</div>
          <div className="text-xs">{companyName}</div>
        </div>

        {/* Skills */}
        {candidateSkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {candidateSkills.slice(0, 3).map((skill) => (
              <span key={skill.id} className="skill-tag">
                {skill.name}
              </span>
            ))}
            {candidateSkills.length > 3 && (
              <span className="skill-tag">+{candidateSkills.length - 3}</span>
            )}
          </div>
        )}

        {/* Updated date */}
        <div className="text-xs text-gray-400 mt-2">
          {new Date(application.updated_at).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};
