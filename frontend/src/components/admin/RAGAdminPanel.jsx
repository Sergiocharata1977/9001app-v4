import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RAGToggle from '../assistant/RAGToggle';
import { Brain, Settings, Database, Activity } from "lucide-react";

const RAGAdminPanel = ({ organizationId = 1 }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Sistema RAG</h2>
          <p className="text-muted-foreground">
            Control de Inteligencia Artificial para ISO 9001
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="control" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="control" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Control
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Estado
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Información
          </TabsTrigger>
        </TabsList>

        {/* Control Tab */}
        <TabsContent value="control" className="space-y-4">
          <RAGToggle organizationId={organizationId} />
        </TabsContent>

        {/* Status Tab */}
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Estado RAG</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">Operativo</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Base de Datos</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Conectada</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Información del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">¿Qué es RAG?</h4>
                  <p className="text-sm text-muted-foreground">
                    RAG (Retrieval-Augmented Generation) es un sistema de IA que combina búsqueda 
                    inteligente en tu documentación con generación de respuestas contextualizadas.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Beneficios</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Respuestas basadas en datos reales de tu organización</li>
                    <li>• Búsqueda semántica en documentos ISO</li>
                    <li>• Trazabilidad de fuentes de información</li>
                    <li>• Control total sobre la información utilizada</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Cómo usar</h4>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Activa el sistema RAG desde el panel de control</li>
                    <li>2. Espera a que se indexen los documentos</li>
                    <li>3. Usa el botón flotante para hacer consultas</li>
                    <li>4. Pregunta sobre procesos, normas o procedimientos</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RAGAdminPanel;
