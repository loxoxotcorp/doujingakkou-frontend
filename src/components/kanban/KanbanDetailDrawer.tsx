
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { KanbanItem } from './types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { getVacancyById } from '@/api/vacancies';
import { getCandidateById } from '@/api/candidates';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface KanbanDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: KanbanItem | null;
}

export const KanbanDetailDrawer = ({ isOpen, onClose, item }: KanbanDetailDrawerProps) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const { data: vacancyData, isLoading: isVacancyLoading } = useQuery({
    queryKey: ['vacancy', item?.id],
    queryFn: () => item && item.type === 'vacancy' ? getVacancyById(item.id).then(res => res.data) : null,
    enabled: isOpen && item?.type === 'vacancy',
  });

  const { data: candidateData, isLoading: isCandidateLoading } = useQuery({
    queryKey: ['candidate', item?.id],
    queryFn: () => item && item.type === 'candidate' ? getCandidateById(item.id).then(res => res.data) : null,
    enabled: isOpen && item?.type === 'candidate',
  });

  const isLoading = isVacancyLoading || isCandidateLoading;

  if (!item) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[500px]">
          <SheetHeader>
            <SheetTitle className="text-2xl">
              {item.type === 'vacancy' ? 'Вакансия' : 'Кандидат'}: {item.title}
            </SheetTitle>
          </SheetHeader>

          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <p>Loading details...</p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <Tabs defaultValue="details">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  {/* Common information */}
                  <div className="space-y-3">
                    <div>
                      <Label>
                        {item.type === 'vacancy' ? 'Название вакансии' : 'ФИО кандидата'}
                      </Label>
                      <Input 
                        value={item.title} 
                        readOnly 
                        className="input-field bg-gray-100" 
                      />
                    </div>
                    
                    <div>
                      <Label>
                        {item.type === 'vacancy' ? 'Компания' : 'Должность'}
                      </Label>
                      <Input
                        value={item.subtitle || ''}
                        readOnly
                        className="input-field bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <Label>Стадия</Label>
                      <Select defaultValue={item.stage}>
                        <SelectTrigger className="input-field">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Initial Review">Initial Review</SelectItem>
                          <SelectItem value="Screening">Screening</SelectItem>
                          <SelectItem value="Interview">Interview</SelectItem>
                          <SelectItem value="Offer">Offer</SelectItem>
                          <SelectItem value="Hired">Hired</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {item.type === 'vacancy' && vacancyData && (
                      <div className="space-y-3">
                        <div>
                          <Label>Зарплата</Label>
                          <Input 
                            value={`${vacancyData.salary?.amount.toLocaleString() || ''} ${vacancyData.salary?.currency || ''}`}
                            readOnly 
                            className="input-field bg-gray-100" 
                          />
                        </div>
                        
                        <div>
                          <Label>Навыки</Label>
                          <div className="flex flex-wrap gap-1 mt-2 p-2 border rounded-md">
                            {vacancyData.skills.map((skill: string, index: number) => (
                              <Badge key={index} variant="outline" className="skill-tag">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {item.type === 'candidate' && candidateData && (
                      <div className="space-y-3">
                        <div>
                          <Label>Компания</Label>
                          <Input 
                            value={candidateData.companyName || ''}
                            readOnly 
                            className="input-field bg-gray-100" 
                          />
                        </div>
                        
                        <div>
                          <Label>Регион</Label>
                          <Input 
                            value={candidateData.region || ''}
                            readOnly 
                            className="input-field bg-gray-100" 
                          />
                        </div>
                        
                        <div>
                          <Label>Образование</Label>
                          <Input 
                            value={candidateData.education || ''}
                            readOnly 
                            className="input-field bg-gray-100" 
                          />
                        </div>
                        
                        <div>
                          <Label>Навыки</Label>
                          <div className="flex flex-wrap gap-1 mt-2 p-2 border rounded-md">
                            {candidateData.skills.map((skill: string, index: number) => (
                              <Badge key={index} variant="outline" className="skill-tag">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label>Языки</Label>
                          <div className="flex flex-wrap gap-1 mt-2 p-2 border rounded-md">
                            {candidateData.languages.map((lang: any, index: number) => (
                              <Badge key={index} variant="outline" className="language-tag">
                                {lang.language} - {lang.level}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Label>Заметки</Label>
                      <Textarea 
                        placeholder="Добавьте заметки о кандидате или вакансии..." 
                        className="input-field min-h-[100px]" 
                      />
                    </div>
                  </div>

                  {item.type === 'candidate' && (
                    <div className="flex justify-between mt-4">
                      <Button onClick={() => setIsLinkModalOpen(true)}>
                        Связать с вакансией
                      </Button>
                      <Button variant="outline">
                        Загрузить резюме
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Moved to Interview</p>
                        <p className="text-sm text-gray-500">From Screening</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>John Doe</p>
                        <p>2023-04-17 09:45</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Added to system</p>
                        <p className="text-sm text-gray-500">Initial stage: Screening</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>Jane Smith</p>
                        <p>2023-04-15 10:30</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Link to Vacancy Modal */}
      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Link to Vacancy</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Search vacancies..." className="mb-4" />
            
            <div className="max-h-80 overflow-y-auto space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i}
                  className="p-3 border rounded-md hover:bg-recruitflow-beigeLight cursor-pointer"
                >
                  <p className="font-medium">Middle Frontend Developer</p>
                  <p className="text-sm text-gray-600">IT-Bilim</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsLinkModalOpen(false)}>
                Cancel
              </Button>
              <Button>
                Link Vacancy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
