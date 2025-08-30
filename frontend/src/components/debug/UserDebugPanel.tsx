import React, { useState, useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, User, Building, Key, Eye, EyeOff } from 'lucide-react';

interface UserDebugPanelProps {
  onClose?: () => void;
}

const UserDebugPanel: React.FC<UserDebugPanelProps> = ({ onClose }) => {
  const { user, isAuthenticated, token } = useAuthStore();
  const [showToken, setShowToken] = useState(false);
  const [autoHide, setAutoHide] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 10000); // Ocultar después de 10 segundos
      return () => clearTimeout(timer);
    }
  }, [autoHide, onClose]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-white shadow-lg border-2 border-blue-200 z-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="h-4 w-4" />
            Debug Auth Panel
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowToken(!showToken)}
              className="h-6 w-6 p-0"
            >
              {showToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-xs">
          {/* Estado de autenticación */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Loading:</span>
            <Badge variant={isAuthenticated ? "default" : "destructive"}>
              {isAuthenticated ? "✅" : "❌"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Authenticated:</span>
            <Badge variant={isAuthenticated ? "default" : "destructive"}>
              {isAuthenticated ? "✅" : "❌"}
            </Badge>
          </div>

          {/* Información del usuario */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Super Admin:</span>
            <Badge variant={user.role === 'super_admin' ? "default" : "secondary"}>
              {user.role === 'super_admin' ? "✅" : "❌"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">User Role:</span>
            <Badge variant="outline" className="text-xs">
              {user.role || "N/A"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">User ID:</span>
            <span className="text-xs font-mono bg-gray-100 px-1 rounded">
              {user._id || user.id || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Email:</span>
            <span className="text-xs font-mono bg-gray-100 px-1 rounded">
              {user.email || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Org ID:</span>
            <span className="text-xs font-mono bg-gray-100 px-1 rounded">
              {user.organization_id || user.organizationId || user.org_id || "N/A"}
            </span>
          </div>

          {/* Token */}
          {showToken && (
            <div className="mt-2">
              <div className="flex items-center gap-1 mb-1">
                <Key className="h-3 w-3" />
                <span className="font-medium">Token:</span>
              </div>
              <div className="text-xs font-mono bg-gray-100 p-1 rounded break-all">
                {token ? `${token.substring(0, 20)}...` : "N/A"}
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="mt-2 pt-2 border-t">
            <div className="flex items-center gap-1 mb-1">
              <Building className="h-3 w-3" />
              <span className="font-medium">Organization Info:</span>
            </div>
            <div className="text-xs space-y-1">
              <div>Type: {typeof user.organization_id}</div>
              <div>Length: {user.organization_id?.toString().length || 0}</div>
            </div>
          </div>

          {/* Botón para mantener visible */}
          <div className="mt-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoHide(!autoHide)}
              className="w-full text-xs"
            >
              {autoHide ? "Mantener visible" : "Auto-ocultar"}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Click para cerrar. Se oculta en 5s
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDebugPanel;
