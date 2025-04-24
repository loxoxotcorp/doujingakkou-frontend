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
import { SkillCreateRequest } from "@/types/apiTypes";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Название навыка обязательно"),
  category: z.string().optional(),
});

interface SkillFormProps {
  onSuccess?: () => void;
}

export const SkillForm: React.FC<SkillFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: (data: SkillCreateRequest) => apiService.createSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Навык успешно создан");
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Ошибка при создании навыка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const skillData: SkillCreateRequest = {
      name: values.name,
      category: values.category || undefined,
    };
    createSkillMutation.mutate(skillData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название навыка</FormLabel>
              <FormControl>
                <Input placeholder="Введите название навыка" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <FormControl>
                <Input placeholder="Например: Языки программирования" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-recruitflow-brown hover:bg-recruitflow-brown-light"
          disabled={createSkillMutation.isPending}
        >
          Создать навык
        </Button>
      </form>
    </Form>
  );
};
