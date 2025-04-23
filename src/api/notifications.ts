
import { ApiResponse } from './types';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: string;
  entityType?: 'company' | 'vacancy' | 'candidate';
  entityId?: string;
  userId: string;
}

// Mock notifications
const notifications: Notification[] = [
  {
    id: '1',
    title: 'New Candidate',
    message: 'Иван Петров has been added to the system',
    type: 'info',
    isRead: false,
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    entityType: 'candidate',
    entityId: '1',
    userId: '1',
  },
  {
    id: '2',
    title: 'Candidate Stage Update',
    message: 'Мария Сидорова moved to Offer stage',
    type: 'success',
    isRead: true,
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    entityType: 'candidate',
    entityId: '2',
    userId: '1',
  },
  {
    id: '3',
    title: 'Vacancy Closed',
    message: 'UI/UX Designer position has been filled',
    type: 'info',
    isRead: false,
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    entityType: 'vacancy',
    entityId: '3',
    userId: '1',
  },
];

// Get user notifications
export const getUserNotifications = async (
  userId: string,
  onlyUnread = false
): Promise<ApiResponse<Notification[]>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let userNotifications = notifications.filter((n) => n.userId === userId);
  
  if (onlyUnread) {
    userNotifications = userNotifications.filter((n) => !n.isRead);
  }
  
  // Sort by timestamp (newest first)
  userNotifications.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return {
    success: true,
    data: userNotifications,
  };
};

// Mark notification as read
export const markNotificationAsRead = async (
  id: string
): Promise<ApiResponse<Notification>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const index = notifications.findIndex((n) => n.id === id);

  if (index === -1) {
    throw new Error('Notification not found');
  }

  const updatedNotification = {
    ...notifications[index],
    isRead: true,
  };

  notifications[index] = updatedNotification;

  return {
    success: true,
    data: updatedNotification,
  };
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (
  userId: string
): Promise<ApiResponse<number>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let count = 0;
  
  notifications.forEach((notification, index) => {
    if (notification.userId === userId && !notification.isRead) {
      notifications[index] = { ...notification, isRead: true };
      count++;
    }
  });

  return {
    success: true,
    data: count,
  };
};

// Create notification
export const createNotification = async (
  notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>
): Promise<ApiResponse<Notification>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const newNotification: Notification = {
    ...notificationData,
    id: `${notifications.length + 1}`,
    timestamp: new Date().toISOString(),
    isRead: false,
  };

  notifications.unshift(newNotification); // Add to the beginning (newest first)

  return {
    success: true,
    data: newNotification,
  };
};
