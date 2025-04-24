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
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiService from "@/services/api";
import { VacancyCreateRequest } from "@/types/apiTypes";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(1, "Название вакансии обязательно"),
  company_id: z.string().min(1, "Выберите компанию"),
  description: z.string().optional(),
  requirements: z.string().optional(),
  salary_min: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? undefined : Number(val)))
    .optional(),
  salary_max: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? undefined : Number(val)))
    .optional(),
  currency: z.string().optional(),
  status: z.enum(["active", "closed", "draft"]).default("active"),
});

interface VacancyFormProps {
  onSuccess?: () => void;
  initialData?: Partial<VacancyCreateRequest>;
  vacancyId?: string;
}

export const VacancyForm: React.FC<VacancyFormProps> = ({
  onSuccess,
  initialData,
  vacancyId,
}) => {
  const queryClient = useQueryClient();

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: () => apiService.getCompanies(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      company_id: "",
      description: "",
      requirements: "",
      salary_min: undefined,
      salary_max: undefined,
      currency: "RUB",
      status: "active",
    },
  });

  const createVacancyMutation = useMutation({
    mutationFn: (data: VacancyCreateRequest) => apiService.createVacancy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      toast.success("Вакансия успешно создана");
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Ошибка при создании вакансии: ${(error as Error).message}`);
    },
  });

  const updateVacancyMutation = useMutation({
    mutationFn: (data: VacancyCreateRequest) => {
      if (!vacancyId) throw new Error("Missing vacancy ID");
      return apiService.updateVacancy(vacancyId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      queryClient.invalidateQueries({ queryKey: ["vacancy", vacancyId] });
      toast.success("Вакансия успешно обновлена");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Ошибка при обновлении вакансии: ${(error as Error).message}`);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const vacancyData: VacancyCreateRequest = {
      title: values.title,
      company_id: values.company_id,
      description: values.description,
      requirements: values.requirements,
      salary_min: values.salary_min,
      salary_max: values.salary_max,
      currency: values.currency,
      status: values.status,
    };

    if (vacancyId) {
      updateVacancyMutation.mutate(vacancyData);
    } else {
      createVacancyMutation.mutate(vacancyData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название вакансии</FormLabel>
              <FormControl>
                <Input placeholder="Введите название вакансии" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Компания</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите компанию" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies?.items.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="salary_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Минимальная зарплата</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Минимум"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary_max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Максимальная зарплата</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Максимум"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Валюта</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите валюту" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="RUB">₽ (RUB)</SelectItem>
                    <SelectItem value="USD">$ (USD)</SelectItem>
                    <SelectItem value="EUR">€ (EUR)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea placeholder="Введите описание вакансии" {...field} className="min-h-24" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Требования</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Введите требования к кандидату"
                  {...field}
                  className="min-h-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Статус вакансии</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Активная</SelectItem>
                  <SelectItem value="closed">Закрытая</SelectItem>
                  <SelectItem value="draft">Черновик</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-recruitflow-brown hover:bg-recruitflow-brown-light"
          disabled={createVacancyMutation.isPending || updateVacancyMutation.isPending}
        >
          {vacancyId ? "Обновить" : "Создать"} вакансию
        </Button>
      </form>
    </Form>
  );
};
