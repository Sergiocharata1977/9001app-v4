import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Brain, Power, Database, Settings } from "lucide-react";

const RAGToggle = ({ organizationId = 1 }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadRAGStatus();
  }, [organizationId]);

  const loadRAGStatus = async () => {
    try {
      const response = await fetch(`/api/rag/status/${organizationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsEnabled(data.data.enabled);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error loading RAG status:', error);
    }
  };

  const handleToggle = async (enabled) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/rag/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          organizationId,
          enabled
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsEnabled(enabled);
        toast({
          title: "RAG " + (enabled ? "Activado" : "Desactivado"),
          description: data.message,
        });
        
        // Recargar estado
        setTimeout(loadRAGStatus, 1000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReindex = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/rag/reindex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          organizationId
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Reindexación Iniciada",
          description: "Los datos se están procesando en segundo plano",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Control RAG
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toggle Principal */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Sistema RAG</Label>
            <p className="text-sm text-muted-foreground">
              {isEnabled ? "Activo - IA disponible" : "Inactivo - Sin IA"}
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total_embeddings || 0}
              </div>
              <div className="text-xs text-muted-foreground">Documentos indexados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.unique_sources || 0}
              </div>
              <div className="text-xs text-muted-foreground">Fuentes únicas</div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={handleReindex}
            disabled={!isEnabled || isLoading}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Database className="h-4 w-4 mr-2" />
            Reindexar
          </Button>
          <Button
            onClick={loadRAGStatus}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Estado */}
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-muted-foreground">
            {isEnabled ? 'Sistema operativo' : 'Sistema desactivado'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RAGToggle;

