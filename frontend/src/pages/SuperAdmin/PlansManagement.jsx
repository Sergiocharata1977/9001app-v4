import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Star, 
  Users, 
  Building2,
  Plus,
  Edit,
  Eye
} from 'lucide-react';

const PlansManagement = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestión de Planes y Suscripciones
        </h1>
        <p className="text-gray-600">
          Administra los planes de suscripción disponibles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Plan Basic
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-900">$29</p>
              <p className="text-gray-600">por mes</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Hasta 10 usuarios</span>
              </div>
              <div className="flex items-center">
                <Building2 className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">1 organización</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">16 features básicas</span>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-2 border-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Plan Professional
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-900">$79</p>
              <p className="text-gray-600">por mes</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Hasta 50 usuarios</span>
              </div>
              <div className="flex items-center">
                <Building2 className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">1 organización</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">24 features avanzadas</span>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Plan Enterprise
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-900">$199</p>
              <p className="text-gray-600">por mes</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Usuarios ilimitados</span>
              </div>
              <div className="flex items-center">
                <Building2 className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Organizaciones múltiples</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">28 features completas</span>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Organizaciones por Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Organización</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Plan Actual</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Usuarios</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Vencimiento</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">ISOFlow3 Platform</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-purple-500">Enterprise</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">45/∞</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Activo</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-12-31
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">Organización Demo</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-blue-500">Professional</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">12/50</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Activo</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-11-15
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">TechCorp Solutions</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-gray-500">Basic</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">8/10</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-yellow-500">Pendiente</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-10-20
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
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

export default PlansManagement;
