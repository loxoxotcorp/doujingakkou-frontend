
import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { KanbanItem } from './types';
import { createPortal } from 'react-dom';

interface KanbanBoardProps {
  columns: { id: string; title: string }[];
  items: KanbanItem[];
  onItemDragEnd: (item: KanbanItem, destination: string) => void;
  onItemClick: (item: KanbanItem) => void;
}

export const KanbanBoard = ({ columns, items, onItemDragEnd, onItemClick }: KanbanBoardProps) => {
  const [activeItem, setActiveItem] = useState<KanbanItem | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeItem = items.find(item => item.id === active.id);
    if (activeItem) {
      setActiveItem(activeItem);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeItem = items.find(item => item.id === active.id);
      // Check if over.id is a column ID
      const overColumnId = columns.find(col => col.id === over.id)?.id;
      
      if (activeItem && overColumnId) {
        onItemDragEnd(activeItem, overColumnId);
      }
    }
    
    setActiveItem(null);
  };

  // Group items by column
  const itemsByColumn = columns.reduce((acc, column) => {
    acc[column.id] = items.filter(item => item.stage === column.id);
    return acc;
  }, {} as Record<string, KanbanItem[]>);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-4 overflow-x-auto p-4 h-full">
        {columns.map(column => (
          <SortableContext
            key={column.id}
            items={itemsByColumn[column.id]?.map(item => item.id) || []}
            strategy={verticalListSortingStrategy}
          >
            <KanbanColumn
              id={column.id}
              title={column.title}
              items={itemsByColumn[column.id] || []}
              onItemClick={onItemClick}
            />
          </SortableContext>
        ))}
      </div>
      
      {createPortal(
        <DragOverlay>
          {activeItem ? <KanbanCard item={activeItem} /> : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
