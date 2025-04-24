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
import { LanguageCreateRequest } from "@/types/apiTypes";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Название языка обязательно"),
  level: z.string().optional(),
});

interface LanguageFormProps {
  onSuccess?: () => void;
}

export const LanguageForm: React.FC<LanguageFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      level: "",
    },
  });

  const createLanguageMutation = useMutation({
    mutationFn: (data: LanguageCreateRequest) => apiService.createLanguage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["languages"] });
      toast.success("Язык успешно добавлен");
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Ошибка при создании языка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const languageData: LanguageCreateRequest = {
      name: values.name,
      level: values.level || undefined,
    };

    createLanguageMutation.mutate(languageData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название языка</FormLabel>
              <FormControl>
                <Input placeholder="Введите название языка" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Уровень владения</FormLabel>
              <FormControl>
                <Input placeholder="Например: A2, B1, C2..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-recruitflow-brown hover:bg-recruitflow-brown-light"
          disabled={createLanguageMutation.isPending}
        >
          Создать язык
        </Button>
      </form>
    </Form>
  );
};
