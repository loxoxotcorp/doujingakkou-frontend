
import { ReactNode } from 'react';
import Header from './Header';
import { Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddEntityForm from '@/components/common/AddEntityForm';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-recruitflow-beige">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-4 relative">
        {children}
      </main>
      
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-recruitflow-brown text-white shadow-lg flex items-center justify-center hover:bg-recruitflow-brownDark transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      {/* Add Entity Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Создать новую запись</DialogTitle>
          </DialogHeader>
          <AddEntityForm onClose={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
