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
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiService from "@/services/api";
import { Application } from "@/types/apiTypes";
import { useToast } from "@/hooks/use-toast";
import { ApplicationDetails } from "./ApplicationDetails";

interface KanbanBoardProps {
  vacancyId?: string;
  candidateId?: string;
  companyId?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  vacancyId,
  candidateId,
  companyId,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: stages } = useQuery({
    queryKey: ["stages"],
    queryFn: apiService.getStages,
  });

  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications", { vacancyId, candidateId, companyId }],
    queryFn: () =>
      apiService.getApplications({
        vacancy_id: vacancyId,
        candidate_id: candidateId,
        company_id: companyId,
      }),
  });

  const [applicationsByStage, setApplicationsByStage] = useState<Record<string, Application[]>>({});

  useEffect(() => {
    if (applications?.items && stages) {
      const grouped: Record<string, Application[]> = {};
      stages.forEach((stage) => {
        grouped[stage.id] = [];
      });
      applications.items.forEach((app) => {
        if (app.stage_id && grouped[app.stage_id]) {
          grouped[app.stage_id].push(app);
        }
      });
      setApplicationsByStage(grouped);
    }
  }, [applications?.items, stages]);

  const activeApplication = activeId
    ? applications?.items.find((app) => app.id === activeId)
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
    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.data.current?.stage_id !== over.data.current?.stage_id) {
      const applicationId = active.id;
      const newStageId = over.data.current?.stage_id;

      try {
        const oldStageId = active.data.current?.stage_id;
        const movedApp = applicationsByStage[oldStageId]?.find((app) => app.id === applicationId);

        if (movedApp && oldStageId && newStageId) {
          const updatedState = { ...applicationsByStage };
          updatedState[oldStageId] = updatedState[oldStageId].filter((app) => app.id !== applicationId);
          updatedState[newStageId] = [...updatedState[newStageId], { ...movedApp, stage_id: newStageId }];
          setApplicationsByStage(updatedState);

          await apiService.updateApplicationStage(applicationId, newStageId);
          queryClient.invalidateQueries({ queryKey: ["applications", { vacancyId, candidateId, companyId }] });

          toast({
            title: "Заявка перемещена",
            description: "Статус заявки обновлен",
          });
        }
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить статус заявки",
          variant: "destructive",
        });
        queryClient.invalidateQueries({ queryKey: ["applications", { vacancyId, candidateId, companyId }] });
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
    <div className="flex flex-col h-full">
      <div className="flex overflow-x-auto p-4 gap-4 h-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              id={stage.id}
              title={stage.name}
              applications={applicationsByStage[stage.id] || []}
              onCardClick={(id) => setSelectedApplicationId(id)}
            />
          ))}

          <DragOverlay>
            {activeId && activeApplication && (
              <KanbanCard application={activeApplication} onClick={() => {}} className="shadow-lg" />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <ApplicationDetails
        applicationId={selectedApplicationId}
        open={!!selectedApplicationId}
        onClose={() => setSelectedApplicationId(null)}
      />
    </div>
  );
};
