import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";
import { motion } from "framer-motion";
import { AddResourceButton } from "../common/AddResourceButton";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiService.getNotifications(),
    enabled: !!user,
  });

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  const navItems = [
    { name: "Компании", path: "/companies" },
    { name: "Вакансии", path: "/vacancies" },
    { name: "Кандидаты", path: "/candidates" },
    { name: "База кандидатов", path: "/candidate-base" },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-recruitflow-beige flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-recruitflow-beige shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/ffde116d-fb20-4579-8ced-19ec686d6ebb.png"
              alt="RecruitFlow"
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? "bg-recruitflow-brown text-white"
                    : "bg-recruitflow-beige-light text-recruitflow-brown hover:bg-recruitflow-beige-dark"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* Notification dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg p-2 z-50"
                >
                  <div className="flex justify-between items-center border-b pb-2 mb-2">
                    <h3 className="font-medium">Уведомления</h3>
                    <Button variant="ghost" size="sm" disabled>
                      Пометить как прочитанные
                    </Button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications && notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-2 mb-1 rounded-md ${
                            notification.is_read ? "bg-white" : "bg-blue-50"
                          }`}
                        >
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-gray-600">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">
                        Нет уведомлений
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <Button variant="ghost" size="icon" onClick={logout}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Add resource button */}
      <AddResourceButton />
    </div>
  );
};
