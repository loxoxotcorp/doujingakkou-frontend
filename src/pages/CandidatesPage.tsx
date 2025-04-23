import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { KanbanDetailDrawer } from '@/components/kanban/KanbanDetailDrawer';
import { KanbanItem } from '@/components/kanban/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCandidates, getCandidateStages, updateCandidateStage } from '@/api/candidates';
import { Candidate } from '@/api/types';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const CandidatesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<KanbanItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: candidatesData } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => getCandidates(1, 100).then(res => res.data)
  });

  const { data: stagesData } = useQuery({
    queryKey: ['candidate-stages'],
    queryFn: () => getCandidateStages().then(res => res.data)
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      updateCandidateStage(id, stage),
    onSuccess: () => {
      toast.success('Стадия кандидата обновлена');
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
    onError: (err: Error) => {
      toast.error(`Ошибка при обновлении: ${err.message}`);
    }
  });

  const candidateItems: KanbanItem[] = candidatesData?.data
    ? candidatesData.data.map((candidate: Candidate) => ({
        id: candidate.id,
        title: `${candidate.firstName} ${candidate.lastName}`,
        subtitle: candidate.position,
        stage: candidate.stage || 'Screening',
        tags: candidate.skills,
        type: 'candidate',
      }))
    : [];

  const filteredItems = searchQuery
    ? candidateItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : candidateItems;

  const columns = stagesData
    ? stagesData.map((stage: string) => ({
        id: stage,
        title: stage,
      }))
    : [];

  const handleCardClick = (item: KanbanItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleDragEnd = (item: KanbanItem, destinationId: string) => {
    if (item.stage !== destinationId) {
      updateStageMutation.mutate({
        id: item.id,
        stage: destinationId,
      });
    }
  };

  return (
    <Layout>
      {/* Фильтры */}
      <div className="mb-4 bg-recruitflow-beigeDark rounded-lg p-3 flex flex-wrap gap-3 items-center sticky top-20 z-10">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center">
            <span className="whitespace-nowrap mr-2 font-medium">Сортировать по</span>
            <Input
              value="Дате изменения"
              readOnly
              className="input-field bg-white cursor-default"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Input
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        <div className="flex-none">
          <Button variant="outline" className="bg-white">
            Показывать только активных
          </Button>
        </div>
      </div>

      {/* Канбан */}
      <div className="bg-recruitflow-beigeDark rounded-lg p-2 h-[calc(100vh-220px)] overflow-x-auto">
        {columns.length > 0 && (
          <div className="min-w-[1000px] h-full">
            <KanbanBoard
              columns={columns}
              items={filteredItems}
              onItemDragEnd={handleDragEnd}
              onItemClick={handleCardClick}
            />
          </div>
        )}
      </div>

      <KanbanDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        item={selectedItem}
      />
    </Layout>
  );
};

export default CandidatesPage;
