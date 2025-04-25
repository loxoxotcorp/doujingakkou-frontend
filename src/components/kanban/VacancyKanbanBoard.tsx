import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Vacancy, Stage } from "@/types/apiTypes";
import apiService from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { VacancyKanbanColumn } from "./VacancyKanbanColumn";
import { VacancyKanbanCard } from "./VacancyKanbanCard";

interface VacancyKanbanBoardProps {
  companyId?: number;
  showOnlyActive?: boolean;
}

export const VacancyKanbanBoard: React.FC<VacancyKanbanBoardProps> = ({
  companyId,
  showOnlyActive = true,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [vacanciesByStage, setVacanciesByStage] = useState<Record<string, Vacancy[]>>({});

  const { data: stages } = useQuery({
    queryKey: ["vacancy-stages"],
    queryFn: () => apiService.getStages({ entity_type: "vacancy" }),
  });

  const { data: vacancies, isLoading } = useQuery({
    queryKey: ["vacancies", { companyId, is_active: showOnlyActive }],
    queryFn: () =>
      apiService.getVacancies({
        company_id: companyId,
        is_active: showOnlyActive,
      }),
  });

  useEffect(() => {
    if (vacancies && stages) {
      const grouped: Record<string, Vacancy[]> = {};
      stages.forEach((stage: Stage) => {
        grouped[stage.id] = [];
      });

      vacancies.forEach((vacancy: Vacancy) => {
        if (vacancy.current_stage_id && grouped[vacancy.current_stage_id]) {
          grouped[vacancy.current_stage_id].push(vacancy);
        }
      });

      setVacanciesByStage(grouped);
    }
  }, [vacancies, stages]);

  const activeVacancy = activeId
    ? vacancies?.find((v) => v.id === Number(activeId))
    : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const draggedVacancyId = Number(active.id);
    const oldStageId = active.data.current?.stage_id;
    const newStageId = String(over.id); // Используем именно over.id

    if (oldStageId !== newStageId) {
      try {
        await apiService.updateVacancy(draggedVacancyId, {
          current_stage_id: newStageId,
        });

        queryClient.invalidateQueries({
          queryKey: ["vacancies", { companyId, is_active: showOnlyActive }],
        });

        toast({
          title: "Вакансия перемещена",
          description: "Статус вакансии обновлен",
        });
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить стадию вакансии",
          variant: "destructive",
        });
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  if (isLoading || !stages) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-recruitflow-brown"></div>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto p-4 gap-4 h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {stages.map((stage) => (
          <VacancyKanbanColumn
            key={stage.id}
            id={stage.id}
            title={stage.name}
            vacancies={vacanciesByStage[stage.id] || []}
            onCardClick={() => {}}
          />
        ))}

        <DragOverlay>
          {activeId && activeVacancy && (
            <VacancyKanbanCard
              vacancy={activeVacancy}
              onClick={() => {}}
              className="shadow-lg"
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};