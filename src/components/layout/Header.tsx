
import { Link } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserNotifications } from '@/api/notifications';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  // Get user notifications
  const { data: notifications } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => user?.id ? getUserNotifications(user.id, true).then(res => res.data) : Promise.resolve([]),
    enabled: !!user?.id,
  });

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <header className="bg-recruitflow-beigeLight border-b border-recruitflow-beigeDark shadow-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/lovable-uploads/f7a05abd-b7dd-4d50-bb7c-ccc8e83ab3cb.png" alt="RecruitFlow" className="h-10"/>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-1">
          <Link
              to="/companies"
              className={cn(
                  "px-4 py-2 rounded-md text-recruitflow-brownDark font-medium",
                  "hover:bg-recruitflow-beige transition-colors duration-200",
                  location.pathname === '/companies' && "bg-recruitflow-brown text-white"
              )}
          >
            Компании
          </Link>
          <Link
              to="/vacancies"
              className={cn(
                  "px-4 py-2 rounded-md text-recruitflow-brownDark font-medium",
                  "hover:bg-recruitflow-beige transition-colors duration-200",
                  location.pathname === '/vacancies' && "bg-recruitflow-brown text-white"
              )}
          >
            Вакансии
          </Link>
          <Link
              to="/candidates"
              className={cn(
                  "px-4 py-2 rounded-md text-recruitflow-brownDark font-medium",
                  "hover:bg-recruitflow-beige transition-colors duration-200",
                  location.pathname === '/candidates' && "bg-recruitflow-brown text-white"
              )}
          >
            Кандидаты
          </Link>
          <Link
              to="/candidates/database"
              className={cn(
                  "px-4 py-2 rounded-md text-recruitflow-brownDark font-medium",
                  "hover:bg-recruitflow-beige transition-colors duration-200",
                  location.pathname === '/candidates/database' && "bg-recruitflow-brown text-white"
              )}
          >
            База кандидатов
          </Link>
        </nav>


        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="h-5 w-5"/>
              {unreadCount > 0 && (
                  <span
                      className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center transform -translate-y-1/3 translate-x-1/3">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications dropdown */}
            <AnimatePresence>
              {notificationsOpen && (
                  <motion.div
                      className="absolute right-0 mt-2 w-80 rounded-md shadow-lg z-50 bg-white border border-recruitflow-beigeDark"
                      initial={{opacity: 0, y: -10}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: -10}}
                      transition={{duration: 0.2}}
                  >
                    <div className="p-3 border-b border-recruitflow-beigeDark flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <Button variant="ghost" size="sm">Mark all as read</Button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications && notifications.length > 0 ? (
                          notifications.map((notification) => (
                              <div
                                  key={notification.id}
                                  className={cn(
                                      "p-3 border-b border-recruitflow-beigeDark hover:bg-recruitflow-beigeLight cursor-pointer",
                                      !notification.isRead && "bg-recruitflow-beigeLight"
                                  )}
                              >
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium text-sm">{notification.title}</h4>
                                  <span className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              </div>
                          ))
                      ) : (
                          <div className="p-4 text-center text-gray-500">No new notifications</div>
                      )}
                    </div>
                    <div className="p-2 border-t border-recruitflow-beigeDark text-center">
                      <Link to="/notifications" className="text-sm text-blue-600 hover:text-blue-800">
                        View all notifications
                      </Link>
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              title={user?.name || 'User Profile'}
          >
            {user?.avatar ? (
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                />
            ) : (
                <User className="h-5 w-5"/>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
