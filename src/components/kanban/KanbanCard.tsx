
import { Badge } from '@/components/ui/badge';
import { KanbanItem } from './types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  item: KanbanItem;
  onClick?: () => void;
  className?: string;
}

export const KanbanCard = ({ item, onClick, className }: KanbanCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "bg-white rounded-md p-3 my-2 shadow cursor-pointer",
        "border border-recruitflow-beigeDark",
        className
      )}
      onClick={onClick}
    >
      <h4 className="font-bold mb-1">{item.title}</h4>
      <p className="text-sm text-gray-600 mb-2">{item.subtitle}</p>

      {item.salary && (
        <div className="text-sm mb-2">
          {typeof item.salary === 'object' 
            ? `${item.salary.amount.toLocaleString()} ${item.salary.currency}`
            : item.salary
          }
        </div>
      )}

      <div className="flex flex-wrap gap-1 mt-2">
        {item.tags?.map((tag, index) => (
          <Badge key={index} variant="outline" className="skill-tag">
            {tag}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
};
