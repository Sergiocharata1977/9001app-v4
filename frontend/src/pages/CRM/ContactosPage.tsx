import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const ContactosPage = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Contactos</h1>
            <p className="text-muted-foreground">
              Gestiona todos los contactos de tu CRM
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Nuevo Contacto
          </Button>
        </div>

        {/* Contenido de prueba */}
        <Card>
          <CardHeader>
            <CardTitle>Contactos del CRM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Sistema de contactos funcionando correctamente</p>
              <p className="text-sm text-muted-foreground mt-2">
                La página se está renderizando sin errores
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactosPage;
