import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import CandidateTable from '@/components/candidates/CandidateTable';
import { KanbanDetailDrawer } from '@/components/kanban/KanbanDetailDrawer';
import { KanbanItem } from '@/components/kanban/types';
import { Input } from '@/components/ui/input';
import { Candidate } from '@/api/types';
import { Search } from 'lucide-react';

const CandidateDatabasePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [nameQuery, setNameQuery] = useState('');
  const [skillsQuery, setSkillsQuery] = useState('');
  const [languagesQuery, setLanguagesQuery] = useState('');

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleRowClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailOpen(true);
  };

  const selectedItem: KanbanItem | null = selectedCandidate
    ? {
        id: selectedCandidate.id,
        title: `${selectedCandidate.firstName} ${selectedCandidate.lastName}`,
        subtitle: selectedCandidate.position,
        stage: selectedCandidate.stage || 'Screening',
        tags: selectedCandidate.skills,
        type: 'candidate',
      }
    : null;

  const filters = {
    skills: skillsQuery ? skillsQuery.split(',').map(s => s.trim()) : undefined,
    languages: languagesQuery ? languagesQuery.split(',').map(l => l.trim()) : undefined,
  };

  return (
    <Layout>
      {/* Панель фильтров */}
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
              placeholder="Имя или фамилия"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              className="input-field pl-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchQuery(nameQuery);
                }
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Навыки"
            value={skillsQuery}
            onChange={(e) => setSkillsQuery(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Языки"
            value={languagesQuery}
            onChange={(e) => setLanguagesQuery(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-recruitflow-beigeLight rounded-lg overflow-hidden">
        <div className="h-[calc(100vh-220px)] overflow-auto">
          <CandidateTable
            searchQuery={searchQuery}
            filters={filters}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      {/* Drawer кандидата */}
      <KanbanDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        item={selectedItem}
      />
    </Layout>
  );
};

export default CandidateDatabasePage;
