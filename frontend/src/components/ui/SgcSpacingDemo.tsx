import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';

/**
 * Componente de demostración de las mejoras de espaciado SGC Pro
 * Muestra ejemplos de separación de 1cm, bordes redondeados y estructura visual mejorada
 */
const SgcSpacingDemo = () => {
  return (
    <div className="sgc-container">
      {/* Header con separación de 1cm */}
      <div className="mb-sgc-sep">
        <h1 className="text-3xl font-bold text-gray-900 mb-sgc-gap-sm">
          🎨 Mejoras de Espaciado SGC Pro
        </h1>
        <p className="text-gray-600">
          Sistema de espaciado consistente con separación de 1cm y bordes redondeados apropiados
        </p>
      </div>

      {/* Grid de cards con espaciado mejorado */}
      <div className="sgc-grid sgc-grid-cols-1 md:sgc-grid-cols-2 lg:sgc-grid-cols-3 gap-sgc-gap">
        
        {/* Card 1: Separación de 1cm */}
        <Card className="sgc-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-sgc-gap-sm">
              📏 Separación de 1cm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-sgc-gap">
              Implementada separación de 38px (1cm) entre sidebar y contenido principal
            </p>
            <div className="space-y-sgc-gap-sm">
              <div className="bg-blue-100 p-sgc-p-sm rounded-sgc">
                <code className="text-sm">p-sgc-sep: 38px</code>
              </div>
              <div className="bg-green-100 p-sgc-p-sm rounded-sgc">
                <code className="text-sm">gap-sgc-gap: 24px</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Bordes redondeados */}
        <Card className="sgc-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-sgc-gap-sm">
              🔄 Bordes Redondeados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-sgc-gap">
              Sistema de bordes redondeados consistente en todos los componentes
            </p>
            <div className="space-y-sgc-gap-sm">
              <div className="bg-purple-100 p-sgc-p-sm rounded-sgc">
                <code className="text-sm">rounded-sgc: 12px</code>
              </div>
              <div className="bg-orange-100 p-sgc-p-sm rounded-sgc-lg">
                <code className="text-sm">rounded-sgc-lg: 16px</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Espaciado interno */}
        <Card className="sgc-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-sgc-gap-sm">
              📦 Espaciado Interno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-sgc-gap">
              Sistema de padding y margin consistente en todos los elementos
            </p>
            <div className="space-y-sgc-gap-sm">
              <div className="bg-teal-100 p-sgc-p-sm rounded-sgc">
                <code className="text-sm">p-sgc-p: 24px</code>
              </div>
              <div className="bg-indigo-100 p-sgc-p-sm rounded-sgc">
                <code className="text-sm">m-sgc-m: 24px</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Sombras mejoradas */}
        <Card className="sgc-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-sgc-gap-sm">
              🌟 Sombras Mejoradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-sgc-gap">
              Sistema de sombras con profundidad y elegancia
            </p>
            <div className="space-y-sgc-gap-sm">
              <div className="bg-gray-100 p-sgc-p-sm rounded-sgc shadow-sgc">
                <code className="text-sm">shadow-sgc</code>
              </div>
              <div className="bg-gray-100 p-sgc-p-sm rounded-sgc shadow-sgc-lg">
                <code className="text-sm">shadow-sgc-lg</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Estructura visual */}
        <Card className="sgc-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-sgc-gap-sm">
              🎯 Estructura Visual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-sgc-gap">
              Jerarquía visual mejorada con contraste y separación
            </p>
            <div className="space-y-sgc-gap-sm">
              <div className="bg-emerald-100 p-sgc-p-sm rounded-sgc">
                <code className="text-sm">sgc-container</code>
              </div>
              <div className="bg-rose-100 p-sgc-p-sm rounded-sgc">
                <code className="text-sm">sgc-grid</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 6: Responsive design */}
        <Card className="sgc-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-sgc-gap-sm">
              📱 Responsive Design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-sgc-gap">
              Espaciado adaptativo para diferentes tamaños de pantalla
            </p>
            <div className="space-y-sgc-gap-sm">
              <div className="bg-yellow-100 p-sgc-p-sm rounded-sgc">
                <code className="text-sm">Mobile: p-sgc-p</code>
              </div>
              <div className="bg-pink-100 p-sgc-p-sm rounded-sgc">
                <code className="text-sm">Desktop: p-sgc-sep</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección de botones de ejemplo */}
      <div className="mt-sgc-sep">
        <h2 className="text-2xl font-semibold text-gray-900 mb-sgc-gap">
          🎛️ Botones con Espaciado Mejorado
        </h2>
        <div className="flex flex-wrap gap-sgc-gap">
          <Button className="sgc-button bg-emerald-600 hover:bg-emerald-700">
            Botón Principal
          </Button>
          <Button variant="outline" className="sgc-button">
            Botón Secundario
          </Button>
          <Button variant="ghost" className="sgc-button">
            Botón Fantasma
          </Button>
        </div>
      </div>

      {/* Sección de formularios de ejemplo */}
      <div className="mt-sgc-sep">
        <h2 className="text-2xl font-semibold text-gray-900 mb-sgc-gap">
          📝 Formularios con Espaciado Mejorado
        </h2>
        <Card className="sgc-card max-w-2xl">
          <CardHeader>
            <CardTitle>Formulario de Ejemplo</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="sgc-form">
              <div className="sgc-form-group">
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                <input 
                  type="text" 
                  className="sgc-input"
                  placeholder="Ingrese su nombre"
                />
              </div>
              <div className="sgc-form-group">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  className="sgc-input"
                  placeholder="Ingrese su email"
                />
              </div>
              <div className="sgc-form-group">
                <label className="text-sm font-medium text-gray-700">Mensaje</label>
                <textarea 
                  className="sgc-input min-h-[100px]"
                  placeholder="Ingrese su mensaje"
                />
              </div>
              <div className="flex gap-sgc-gap">
                <Button type="submit" className="sgc-button bg-emerald-600 hover:bg-emerald-700">
                  Enviar
                </Button>
                <Button type="button" variant="outline" className="sgc-button">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de mejoras */}
      <div className="mt-sgc-sep p-sgc-p bg-gradient-to-r from-emerald-50 to-teal-50 rounded-sgc-lg border border-emerald-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-sgc-gap-sm">
          ✅ Mejoras Implementadas
        </h3>
        <ul className="space-y-sgc-gap-sm text-gray-700">
          <li>• Separación de 1cm (38px) entre sidebar y contenido principal</li>
          <li>• Sistema de espaciado consistente con variables CSS personalizadas</li>
          <li>• Bordes redondeados apropiados (12px, 16px, 20px, 24px)</li>
          <li>• Sombras mejoradas con profundidad y elegancia</li>
          <li>• Espaciado interno uniforme en todos los componentes</li>
          <li>• Diseño responsive con espaciado adaptativo</li>
          <li>• Jerarquía visual mejorada con contraste y separación</li>
        </ul>
      </div>
    </div>
  );
};

export default SgcSpacingDemo;
