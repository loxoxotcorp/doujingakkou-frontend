import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/services/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { CommentCreateRequest, ReminderCreateRequest } from "@/types/apiTypes";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApplicationDetailsProps {
  applicationId: string | null;
  open: boolean;
  onClose: () => void;
}

export const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  applicationId,
  open,
  onClose,
}) => {
  const [comment, setComment] = useState("");
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [reminderNote, setReminderNote] = useState("");
  const [showReminderForm, setShowReminderForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setComment("");
      setReminderDate(undefined);
      setReminderNote("");
      setShowReminderForm(false);
    }
  }, [applicationId, open]);

  const { data: application, isLoading } = useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => (applicationId ? apiService.getApplicationById(applicationId) : null),
    enabled: !!applicationId && open,
  });

  const { data: comments } = useQuery({
    queryKey: ["application-comments", applicationId],
    queryFn: () => (applicationId ? apiService.getComments(applicationId) : []),
    enabled: !!applicationId && open,
  });

  const commentMutation = useMutation({
    mutationFn: (data: CommentCreateRequest) => apiService.createComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application-comments", applicationId] });
      setComment("");
      toast({
        title: "Комментарий добавлен",
        description: "Ваш комментарий был успешно добавлен",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось добавить комментарий: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    },
  });

  const reminderMutation = useMutation({
    mutationFn: (data: ReminderCreateRequest) => apiService.createReminder(data),
    onSuccess: () => {
      toast({
        title: "Напоминание создано",
        description: `Напоминание установлено на ${reminderDate ? format(reminderDate, 'PP') : 'выбранную дату'}`,
      });
      setReminderDate(undefined);
      setReminderNote("");
      setShowReminderForm(false);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось создать напоминание: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = () => {
    if (!applicationId || !comment.trim()) return;

    commentMutation.mutate({
      application_id: applicationId,
      content: comment,
    });
  };

  const handleCreateReminder = () => {
    if (!applicationId || !reminderDate) return;

    reminderMutation.mutate({
      application_id: applicationId,
      reminder_date: reminderDate.toISOString(),
      content: reminderNote || "Напоминание о кандидате",
    });
  };

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full md:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Детали заявки</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-recruitflow-brown"></div>
          </div>
        ) : application ? (
          <ScrollArea className="h-[calc(100vh-100px)] pr-4">
            <div className="py-4 space-y-6">
              {/* Candidate info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{application.candidate.first_name} {application.candidate.last_name}</h3>
                <div className="text-sm text-gray-600">
                  <p><strong>Вакансия:</strong> {application.vacancy.title}</p>
                  <p><strong>Компания:</strong> {application.vacancy.company_name}</p>
                  <p><strong>Статус:</strong> {application.stage?.name || "Не указан"}</p>
                </div>

                <div className="space-y-1 mt-2">
                  {application.candidate.email && (
                    <p className="text-sm"><strong>Email:</strong> {application.candidate.email}</p>
                  )}
                  {application.candidate.phone && (
                    <p className="text-sm"><strong>Телефон:</strong> {application.candidate.phone}</p>
                  )}
                  {application.candidate.specialization && (
                    <p className="text-sm"><strong>Специализация:</strong> {application.candidate.specialization}</p>
                  )}
                  {application.candidate.experience_years !== undefined && (
                    <p className="text-sm"><strong>Опыт:</strong> {application.candidate.experience_years} лет</p>
                  )}
                </div>

                {/* Skills */}
                {application.candidate.skills?.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium mb-1">Навыки:</p>
                    <div className="flex flex-wrap gap-1">
                      {application.candidate.skills.map((skill) => (
                        <span key={skill.id} className="skill-tag">{skill.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {application.candidate.languages?.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium mb-1">Языки:</p>
                    <div className="flex flex-wrap gap-1">
                      {application.candidate.languages.map((lang) => (
                        <span key={lang.id} className="skill-tag">
                          {lang.name} {lang.level && `(${lang.level})`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Comments */}
              <div>
                <h3 className="font-semibold mb-2">Комментарии</h3>
                <div className="space-y-3">
                  {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-md p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{comment.created_by_name || "Пользователь"}</span>
                          <span className="text-xs text-gray-500">{format(new Date(comment.created_at), 'dd.MM.yyyy HH:mm')}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Комментариев пока нет</p>
                  )}

                  <div className="mt-4 space-y-2">
                    <Textarea
                      placeholder="Добавить комментарий..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!comment.trim() || commentMutation.isPending}
                      className="w-full bg-recruitflow-brown hover:bg-recruitflow-brown-light"
                    >
                      Отправить комментарий
                    </Button>
                  </div>
                </div>
              </div>

              {/* Reminders */}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Напоминания</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReminderForm(!showReminderForm)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    {showReminderForm ? "Отмена" : "Добавить"}
                  </Button>
                </div>

                {showReminderForm && (
                  <div className="space-y-3 bg-gray-50 p-3 rounded-md">
                    <div className="space-y-2">
                      <Label htmlFor="reminder-date">Дата напоминания</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="reminder-date"
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {reminderDate ? format(reminderDate, 'PP') : <span>Выберите дату</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={reminderDate}
                            onSelect={setReminderDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reminder-note">Заметка</Label>
                      <Input
                        id="reminder-note"
                        value={reminderNote}
                        onChange={(e) => setReminderNote(e.target.value)}
                        placeholder="О чем напомнить?"
                      />
                    </div>

                    <Button
                      onClick={handleCreateReminder}
                      disabled={!reminderDate || reminderMutation.isPending}
                      className="w-full bg-recruitflow-brown hover:bg-recruitflow-brown-light"
                    >
                      Создать напоминание
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Выберите заявку для просмотра деталей
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
