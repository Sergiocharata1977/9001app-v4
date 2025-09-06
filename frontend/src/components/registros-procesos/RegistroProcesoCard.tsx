import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, Eye, ClipboardList, User, Calendar, FileText, Users } from 'lucide-react';

interface Estado {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  orden: number;
}

interface Campo {
  id: string;
  nombre: string;
  tipo: string;
  requerido: boolean;
  descripcion: string;
}

interface PlantillaRegistro {
  id: string;
  nombre: string;
  descripcion: string;
  estados: Estado[];
  campos: Campo[];
  registros: number;
  activa: boolean;
  creada: string;
  responsable: string;
}

interface RegistroProcesoCardProps {
  plantilla: PlantillaRegistro;
  onEdit: (plantilla: PlantillaRegistro) => void;
  onDelete: (plantilla: PlantillaRegistro) => void;
  onView: (plantilla: PlantillaRegistro) => void;
}

export default function RegistroProcesoCard({ plantilla, onEdit, onDelete, onView }: RegistroProcesoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 flex flex-col h-full group cursor-pointer overflow-hidden"
      onClick={() => onView(plantilla)}
    >
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            <h3 className="font-bold text-lg truncate">{plantilla.nombre}</h3>
          </div>
          <div className="flex items-center gap-2">
            {plantilla.activa ? (
              <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-300/30">
                Activa
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-500/20 text-gray-100 border-gray-300/30">
                Inactiva
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <CardContent className="flex-grow p-4 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
          {plantilla.descripcion}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>{plantilla.responsable}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Creada: {new Date(plantilla.creada).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="h-4 w-4" />
            <span>{plantilla.registros} registros</span>
          </div>
        </div>
        
        {/* Estados */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Estados:</h4>
          <div className="flex flex-wrap gap-1">
            {plantilla.estados.slice(0, 3).map((estado, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs"
                style={{ 
                  color: estado.color,
                  borderColor: estado.color,
                  backgroundColor: `${estado.color}10`
                }}
              >
                {estado.nombre}
              </Badge>
            ))}
            {plantilla.estados.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{plantilla.estados.length - 3} más
              </Badge>
            )}
          </div>
        </div>

        {/* Campos */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Campos:</h4>
          <div className="flex flex-wrap gap-1">
            {plantilla.campos.slice(0, 2).map((campo, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {campo.nombre}
              </Badge>
            ))}
            {plantilla.campos.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{plantilla.campos.length - 2} más
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer con acciones */}
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(plantilla);
              }}
              className="text-gray-500 hover:text-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(plantilla);
              }}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView(plantilla);
            }}
            className="text-emerald-600 hover:text-emerald-700"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
        </div>
      </CardFooter>
    </motion.div>
  );
}

