
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanItem } from './types';
import { SortableKanbanCard } from './SortableKanbanCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  items: KanbanItem[];
  onItemClick: (item: KanbanItem) => void;
}

export const KanbanColumn = ({ id, title, items, onItemClick }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col h-full min-w-[300px] max-w-[300px] rounded-md p-2",
        "bg-recruitflow-beigeLight border border-recruitflow-beigeDark",
        isOver && "bg-recruitflow-beige border-dashed"
      )}
    >
      <h3 className="font-bold p-2 text-center bg-white rounded-md mb-2 border border-recruitflow-beigeDark">
        {title}
      </h3>
      
      <div className="flex-grow overflow-y-auto overflow-x-hidden scrollable-container pb-4">
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableKanbanCard key={item.id} item={item} onClick={() => onItemClick(item)} />
          ))}
        </SortableContext>
        
        {items.length === 0 && (
          <div className="text-center p-4 text-gray-500 italic">
            Перетащите карточку сюда
          </div>
        )}
      </div>
    </div>
  );
};
