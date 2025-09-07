import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Bell, Check, CheckCheck, Trash2, X, AlertTriangle, 
  CheckCircle, Info, AlertCircle, Clock
} from "lucide-react";
import { useNotifications } from '@/context/NotificationContext';

const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertCircle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'info': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-400/10 border-green-400/20';
      case 'warning': return 'bg-yellow-400/10 border-yellow-400/20';
      case 'error': return 'bg-red-400/10 border-red-400/20';
      case 'info': return 'bg-blue-400/10 border-blue-400/20';
      default: return 'bg-slate-400/10 border-slate-400/20';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return timestamp.toLocaleDateString();
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.action) {
      notification.action.onClick();
    }
  };

  const recentNotifications = notifications.slice(0, 10);
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 bg-slate-800 border-slate-700 text-white"
        align="end"
      >
        <div className="flex items-center justify-between p-3 border-b border-slate-700">
          <h3 className="font-semibold text-white">Notificaciones</h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllNotifications}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {recentNotifications.length === 0 ? (
          <div className="p-6 text-center text-slate-400">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay notificaciones</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const isUnread = !notification.read;
              
              return (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-slate-700/50 cursor-pointer hover:bg-slate-700/50 transition-colors ${
                    isUnread ? 'bg-slate-700/30' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getNotificationBgColor(notification.type)}`}>
                      <Icon className={`h-4 w-4 ${getNotificationColor(notification.type)}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${isUnread ? 'text-white' : 'text-slate-300'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {isUnread && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      {notification.action && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            notification.action.onClick();
                          }}
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="text-slate-500 hover:text-white hover:bg-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {notifications.length > 10 && (
          <>
            <DropdownMenuSeparator className="bg-slate-700" />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full text-slate-400 hover:text-white hover:bg-slate-700"
                onClick={() => {
                  // Aquí podrías navegar a una página de notificaciones completa
                  console.log('Ver todas las notificaciones');
                }}
              >
                Ver todas las notificaciones ({notifications.length})
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;
