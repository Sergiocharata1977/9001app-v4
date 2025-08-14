import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AuditoriasListingNEW from '../../components/auditorias/AuditoriasListingNEW.jsx';

// ===============================================
// PÁGINA PRINCIPAL DE AUDITORÍAS - SGC PRO
// ===============================================

const AuditoriasPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Auditorías</h1>
              <p className="text-gray-600">Gestión de auditorías internas y externas</p>
            </div>
            <Button 
              onClick={() => navigate('/app/auditorias/nueva')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Auditoría
            </Button>
          </div>
        </div>
        <AuditoriasListingNEW />
      </div>
    </div>
  );
};

export default AuditoriasPage; 