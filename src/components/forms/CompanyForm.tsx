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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/services/api";
import { CompanyCreateRequest } from "@/types/apiTypes";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Название компании обязательно"),
  legal_name: z.string().optional(),
  activity_field: z.string().optional(),
  description: z.string().optional(),
  logo_url: z.string().optional(),
});

interface CompanyFormProps {
  onSuccess?: () => void;
  initialData?: Partial<CompanyCreateRequest>;
  companyId?: number;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  onSuccess,
  initialData,
  companyId,
}) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      legal_name: "",
      activity_field: "",
      description: "",
      logo_url: "",
    },
  });

  const createCompanyMutation = useMutation({
    mutationFn: (data: CompanyCreateRequest) => apiService.createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Компания успешно создана");
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Ошибка при создании компании: ${(error as Error).message}`);
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: (data: Partial<CompanyCreateRequest>) => {
      if (!companyId) throw new Error("ID компании не найден");
      return apiService.updateCompany(companyId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company", companyId] });
      toast.success("Компания успешно обновлена");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Ошибка при обновлении компании: ${(error as Error).message}`);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const companyData: CompanyCreateRequest = {
      name: values.name,
      legal_name: values.legal_name,
      activity_field: values.activity_field,
      description: values.description,
      logo_url: values.logo_url,
    };

    if (companyId) {
      updateCompanyMutation.mutate(companyData);
    } else {
      createCompanyMutation.mutate(companyData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название компании</FormLabel>
              <FormControl>
                <Input placeholder="Введите название компании" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="legal_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Юридическое название</FormLabel>
              <FormControl>
                <Input placeholder="Введите юридическое название" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="activity_field"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сфера деятельности</FormLabel>
              <FormControl>
                <Input placeholder="Введите сферу деятельности" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea placeholder="Введите описание компании" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL логотипа</FormLabel>
              <FormControl>
                <Input placeholder="Введите ссылку на логотип" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-recruitflow-brown hover:bg-recruitflow-brown-light"
          disabled={createCompanyMutation.isPending || updateCompanyMutation.isPending}
        >
          {companyId ? "Обновить" : "Создать"} компанию
        </Button>
      </form>
    </Form>
  );
};
