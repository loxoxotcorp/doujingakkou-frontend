
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanCard } from './KanbanCard';
import { KanbanItem } from './types';
import { cn } from '@/lib/utils';

interface SortableKanbanCardProps {
  item: KanbanItem;
  onClick?: () => void;
}

export const SortableKanbanCard = ({ item, onClick }: SortableKanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: 'card',
      item,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        isDragging ? 'z-50' : 'z-0'
      )}
    >
      <KanbanCard
        item={item}
        onClick={onClick}
        className={isDragging ? 'border-dashed border-recruitflow-brown' : ''}
      />
    </div>
  );
};
