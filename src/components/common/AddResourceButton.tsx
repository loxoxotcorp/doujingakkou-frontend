import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { CompanyForm } from "../forms/CompanyForm";
import { VacancyForm } from "../forms/VacancyForm";
import { CandidateForm } from "../forms/CandidateForm";
import { SkillForm } from "../forms/SkillForm";
import { LanguageForm } from "../forms/LanguageForm";
import { motion } from "framer-motion";

export const AddResourceButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            className="h-14 w-14 rounded-full bg-recruitflow-brown hover:bg-recruitflow-brown-light text-white shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить</DialogTitle>
          <DialogDescription>
            Создание нового ресурса в системе
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="company">Компания</TabsTrigger>
            <TabsTrigger value="vacancy">Вакансия</TabsTrigger>
            <TabsTrigger value="candidate">Кандидат</TabsTrigger>
            <TabsTrigger value="skill">Навык</TabsTrigger>
            <TabsTrigger value="language">Язык</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <CompanyForm onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="vacancy">
            <VacancyForm onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="candidate">
            <CandidateForm onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="skill">
            <SkillForm onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="language">
            <LanguageForm onSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
