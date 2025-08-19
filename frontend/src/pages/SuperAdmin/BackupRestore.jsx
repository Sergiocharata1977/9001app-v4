import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Download, 
  Upload, 
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const BackupRestore = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Backup y Restore
        </h1>
        <p className="text-gray-600">
          Gestión de respaldos y restauración de la base de datos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Estado del Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Último Backup</span>
                <Badge className="bg-green-500">Hace 2 horas</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Estado</span>
                <Badge className="bg-green-500">Completado</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Tamaño</span>
                <Badge variant="outline">45.2 MB</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Próximo Backup</span>
                <Badge variant="outline">En 22 horas</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Acciones de Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Database className="w-4 h-4 mr-2" />
                Crear Backup Manual
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Descargar Último Backup
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Clock className="w-4 h-4 mr-2" />
                Programar Backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Historial de Backups
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tamaño</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Duración</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-16 08:00:00
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-blue-500">Automático</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">45.2 MB</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Completado</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2 min 15s
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-15 08:00:00
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-blue-500">Automático</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">44.8 MB</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Completado</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2 min 30s
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-14 15:30:00
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-purple-500">Manual</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">45.1 MB</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Completado</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2 min 45s
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-13 08:00:00
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-blue-500">Automático</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">44.9 MB</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-red-500">Fallido</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      -
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" disabled>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" disabled>
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BackupRestore;
