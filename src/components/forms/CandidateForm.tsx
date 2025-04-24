import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/services/api";
import { CandidateCreateRequest } from "@/types/apiTypes";
import { toast } from "sonner";

const formSchema = z.object({
  first_name: z.string().min(1, "Имя кандидата обязательно"),
  last_name: z.string().min(1, "Фамилия кандидата обязательна"),
  middle_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Неверный формат email").optional(),
  region: z.string().optional(),
  education: z.string().optional(),
  resume_url: z.string().url("Неверный URL").optional(),
  source: z.string().optional(),
});

interface CandidateFormProps {
  onSuccess?: () => void;
  initialData?: Partial<CandidateCreateRequest>;
  candidateId?: string;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({
  onSuccess,
  initialData,
  candidateId,
}) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      first_name: "",
      last_name: "",
      middle_name: "",
      phone: "",
      email: "",
      region: "",
      education: "",
      resume_url: "",
      source: "",
    },
  });

  const createCandidateMutation = useMutation({
    mutationFn: (data: CandidateCreateRequest) => apiService.createCandidate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      toast.success("Кандидат успешно создан");
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Ошибка при создании кандидата: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
    },
  });

  const updateCandidateMutation = useMutation({
    mutationFn: (data: CandidateCreateRequest) => {
      if (!candidateId) throw new Error("Не указан ID кандидата");
      return apiService.updateCandidate(candidateId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["candidate", candidateId] });
      toast.success("Кандидат успешно обновлен");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Ошибка при обновлении кандидата: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const candidateData: CandidateCreateRequest = { ...values };
    if (candidateId) {
      updateCandidateMutation.mutate(candidateData);
    } else {
      createCandidateMutation.mutate(candidateData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Фамилия</FormLabel>
                <FormControl>
                  <Input placeholder="Введите фамилию" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input placeholder="Введите имя" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middle_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Отчество</FormLabel>
                <FormControl>
                  <Input placeholder="Введите отчество" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Телефон</FormLabel>
              <FormControl>
                <Input placeholder="+998..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@domain.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Регион</FormLabel>
              <FormControl>
                <Input placeholder="Введите регион" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Образование</FormLabel>
              <FormControl>
                <Input placeholder="Введите образование" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resume_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ссылка на резюме</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Источник</FormLabel>
              <FormControl>
                <Input placeholder="Форма / вручную / импорт" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-recruitflow-brown hover:bg-recruitflow-brown-light"
          disabled={createCandidateMutation.isPending || updateCandidateMutation.isPending}
        >
          {candidateId ? "Обновить" : "Создать"} кандидата
        </Button>
      </form>
    </Form>
  );
};
