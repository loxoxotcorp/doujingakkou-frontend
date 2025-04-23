
export interface KanbanItem {
  id: string;
  title: string;
  subtitle?: string;
  stage: string;
  tags?: string[];
  salary?: {
    amount: number;
    currency: string;
  } | string;
  type: 'vacancy' | 'candidate';
}
