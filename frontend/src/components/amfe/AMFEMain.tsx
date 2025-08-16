import React, { useState, useEffect } from 'react';
import { AMFERecord } from '../../types/amfe';
import { amfeService } from '../../services/amfeService';
import AMFEModal from './AMFEModal';
import AMFERecords from './AMFERecords';
import AMFEDashboard from './AMFEDashboard';
import AMFEReports from './AMFEReports';

const AMFEMain: React.FC = () => {
  const [records, setRecords] = useState<AMFERecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'records' | 'reports'>('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AMFERecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<AMFERecord | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await amfeService.getAllRecords();
      setRecords(data);
    } catch (error) {
      console.error('Error cargando datos AMFE:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (recordData: Omit<AMFERecord, 'id' | 'npr' | 'riskLevel' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newRecord = await amfeService.createRecord(recordData);
      setRecords(prev => [...prev, newRecord]);
      setModalOpen(false);
    } catch (error) {
      console.error('Error creando registro:', error);
    }
  };

  const handleUpdateRecord = async (recordData: Omit<AMFERecord, 'id' | 'npr' | 'riskLevel' | 'createdAt' | 'updatedAt'>) => {
    if (!editingRecord) return;
    
    try {
      const updatedRecord = await amfeService.updateRecord(editingRecord.id, recordData);
      if (updatedRecord) {
        setRecords(prev => prev.map(r => r.id === editingRecord.id ? updatedRecord : r));
        setModalOpen(false);
        setEditingRecord(null);
      }
    } catch (error) {
      console.error('Error actualizando registro:', error);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este registro?')) return;
    
    try {
      const success = await amfeService.deleteRecord(id);
      if (success) {
        setRecords(prev => prev.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error eliminando registro:', error);
    }
  };

  const handleEditRecord = (record: AMFERecord) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const handleViewRecord = (record: AMFERecord) => {
    setViewingRecord(record);
    setViewModalOpen(true);
  };

  const handleExportCSV = async () => {
    try {
      const csv = await amfeService.exportToCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `amfe_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exportando CSV:', error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingRecord(null);
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setViewingRecord(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando sistema AMFE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sistema AMFE</h1>
              <p className="text-gray-600">Análisis Modal de Fallos y Efectos</p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Registro
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'records'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Registros ({records.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reportes
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <AMFEDashboard records={records} />
        )}
        
        {activeTab === 'records' && (
          <AMFERecords
            records={records}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
            onView={handleViewRecord}
          />
        )}
        
        {activeTab === 'reports' && (
          <AMFEReports
            records={records}
            onExportCSV={handleExportCSV}
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <AMFEModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSave={editingRecord ? handleUpdateRecord : handleCreateRecord}
        record={editingRecord}
        isEditing={!!editingRecord}
      />

      {/* View Modal */}
      {viewingRecord && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${viewModalOpen ? '' : 'hidden'}`}>
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Detalles del Registro AMFE</h2>
              <button
                onClick={handleViewModalClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Año</label>
                    <p className="text-gray-900">{viewingRecord.year}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Proceso</label>
                    <p className="text-gray-900">{viewingRecord.process}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Función</label>
                    <p className="text-gray-900">{viewingRecord.function}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Modo de Fallo</label>
                    <p className="text-gray-900">{viewingRecord.failureMode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Efectos</label>
                    <p className="text-gray-900">{viewingRecord.effects}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Evaluación de Riesgo</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Causas</label>
                    <p className="text-gray-900">{viewingRecord.causes}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Controles Actuales</label>
                    <p className="text-gray-900">{viewingRecord.currentControls}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Severidad</label>
                      <p className="text-lg font-semibold text-gray-900">{viewingRecord.severity}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ocurrencia</label>
                      <p className="text-lg font-semibold text-gray-900">{viewingRecord.occurrence}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Detección</label>
                      <p className="text-lg font-semibold text-gray-900">{viewingRecord.detection}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">NPR</label>
                        <p className="text-2xl font-bold text-blue-600">{viewingRecord.npr}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nivel de Riesgo</label>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          viewingRecord.riskLevel === 'low' ? 'text-green-600 bg-green-100' :
                          viewingRecord.riskLevel === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                          viewingRecord.riskLevel === 'high' ? 'text-orange-600 bg-orange-100' :
                          'text-red-600 bg-red-100'
                        }`}>
                          {viewingRecord.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Acciones y Seguimiento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Acciones Recomendadas</label>
                  <p className="text-gray-900">{viewingRecord.recommendedActions}</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Responsable</label>
                    <p className="text-gray-900">{viewingRecord.responsible}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
                    <p className="text-gray-900">{new Date(viewingRecord.dueDate).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      viewingRecord.status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                      viewingRecord.status === 'in-progress' ? 'text-blue-600 bg-blue-100' :
                      'text-green-600 bg-green-100'
                    }`}>
                      {viewingRecord.status === 'pending' ? 'Pendiente' :
                       viewingRecord.status === 'in-progress' ? 'En Progreso' : 'Completado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4 pt-6 border-t">
              <button
                onClick={handleViewModalClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  handleViewModalClose();
                  handleEditRecord(viewingRecord);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AMFEMain;
