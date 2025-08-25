import React, { useState, useEffect } from 'react';
import { AMFERecord } from '../../types/amfe';

interface AMFEModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<AMFERecord, 'id' | 'npr' | 'riskLevel' | 'createdAt' | 'updatedAt'>) => void;
  record?: AMFERecord | null;
  isEditing?: boolean;
}

const AMFEModal: React.FC<AMFEModalProps> = ({ isOpen, onClose, onSave, record, isEditing = false }) => {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    process: '',
    function: '',
    failureMode: '',
    effects: '',
    causes: '',
    currentControls: '',
    severity: 1,
    occurrence: 1,
    detection: 1,
    recommendedActions: '',
    responsible: '',
    dueDate: '',
    status: 'pending' as 'pending' | 'in-progress' | 'completed'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calcular NPR y riskLevel en tiempo real
  const npr = formData.severity * formData.occurrence * formData.detection;
  const riskLevel = npr <= 50 ? 'low' : npr <= 100 ? 'medium' : npr <= 200 ? 'high' : 'critical';

  useEffect(() => {
    if (record && isEditing) {
      setFormData({
        year: record.year,
        process: record.process,
        function: record.function,
        failureMode: record.failureMode,
        effects: record.effects,
        causes: record.causes,
        currentControls: record.currentControls,
        severity: record.severity,
        occurrence: record.occurrence,
        detection: record.detection,
        recommendedActions: record.recommendedActions,
        responsible: record.responsible,
        dueDate: record.dueDate,
        status: record.status
      });
    } else {
      setFormData({
        year: new Date().getFullYear(),
        process: '',
        function: '',
        failureMode: '',
        effects: '',
        causes: '',
        currentControls: '',
        severity: 1,
        occurrence: 1,
        detection: 1,
        recommendedActions: '',
        responsible: '',
        dueDate: '',
        status: 'pending'
      });
    }
    setErrors({});
  }, [record, isEditing, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.process.trim()) newErrors.process = 'El proceso es requerido';
    if (!formData.function.trim()) newErrors.function = 'La función es requerida';
    if (!formData.failureMode.trim()) newErrors.failureMode = 'El modo de fallo es requerido';
    if (!formData.effects.trim()) newErrors.effects = 'Los efectos son requeridos';
    if (!formData.causes.trim()) newErrors.causes = 'Las causas son requeridas';
    if (!formData.currentControls.trim()) newErrors.currentControls = 'Los controles actuales son requeridos';
    if (!formData.recommendedActions.trim()) newErrors.recommendedActions = 'Las acciones recomendadas son requeridas';
    if (!formData.responsible.trim()) newErrors.responsible = 'El responsable es requerido';
    if (!formData.dueDate) newErrors.dueDate = 'La fecha de vencimiento es requerida';

    if (formData.severity < 1 || formData.severity > 10) newErrors.severity = 'La severidad debe estar entre 1 y 10';
    if (formData.occurrence < 1 || formData.occurrence > 10) newErrors.occurrence = 'La ocurrencia debe estar entre 1 y 10';
    if (formData.detection < 1 || formData.detection > 10) newErrors.detection = 'La detección debe estar entre 1 y 10';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Editar Registro AMFE' : 'Nuevo Registro AMFE'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año *
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="2020"
                max="2030"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proceso *
              </label>
              <input
                type="text"
                value={formData.process}
                onChange={(e) => handleInputChange('process', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.process ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Producción, Calidad, Mantenimiento"
              />
              {errors.process && <p className="text-red-500 text-sm mt-1">{errors.process}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Función *
              </label>
              <input
                type="text"
                value={formData.function}
                onChange={(e) => handleInputChange('function', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.function ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Ensamblaje, Inspección, Calibración"
              />
              {errors.function && <p className="text-red-500 text-sm mt-1">{errors.function}</p>}
            </div>
          </div>

          {/* Modo de fallo y efectos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modo de Fallo *
              </label>
              <textarea
                value={formData.failureMode}
                onChange={(e) => handleInputChange('failureMode', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.failureMode ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Describa cómo puede fallar el proceso o función"
              />
              {errors.failureMode && <p className="text-red-500 text-sm mt-1">{errors.failureMode}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Efectos *
              </label>
              <textarea
                value={formData.effects}
                onChange={(e) => handleInputChange('effects', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.effects ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Describa las consecuencias del fallo"
              />
              {errors.effects && <p className="text-red-500 text-sm mt-1">{errors.effects}</p>}
            </div>
          </div>

          {/* Causas y controles actuales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Causas *
              </label>
              <textarea
                value={formData.causes}
                onChange={(e) => handleInputChange('causes', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.causes ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Identifique las causas potenciales del fallo"
              />
              {errors.causes && <p className="text-red-500 text-sm mt-1">{errors.causes}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Controles Actuales *
              </label>
              <textarea
                value={formData.currentControls}
                onChange={(e) => handleInputChange('currentControls', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.currentControls ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Describa los controles existentes"
              />
              {errors.currentControls && <p className="text-red-500 text-sm mt-1">{errors.currentControls}</p>}
            </div>
          </div>

          {/* Evaluación de riesgo */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Evaluación de Riesgo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severidad (1-10) *
                </label>
                <input
                  type="number"
                  value={formData.severity}
                  onChange={(e) => handleInputChange('severity', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.severity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="1"
                  max="10"
                />
                {errors.severity && <p className="text-red-500 text-sm mt-1">{errors.severity}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ocurrencia (1-10) *
                </label>
                <input
                  type="number"
                  value={formData.occurrence}
                  onChange={(e) => handleInputChange('occurrence', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.occurrence ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="1"
                  max="10"
                />
                {errors.occurrence && <p className="text-red-500 text-sm mt-1">{errors.occurrence}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detección (1-10) *
                </label>
                <input
                  type="number"
                  value={formData.detection}
                  onChange={(e) => handleInputChange('detection', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.detection ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="1"
                  max="10"
                />
                {errors.detection && <p className="text-red-500 text-sm mt-1">{errors.detection}</p>}
              </div>
            </div>
            
            {/* Resultados calculados */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">NPR (Número de Prioridad de Riesgo)</p>
                <p className="text-2xl font-bold text-blue-600">{npr}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Nivel de Riesgo</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(riskLevel)}`}>
                  {riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones y responsabilidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Acciones Recomendadas *
              </label>
              <textarea
                value={formData.recommendedActions}
                onChange={(e) => handleInputChange('recommendedActions', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.recommendedActions ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Describa las acciones recomendadas para mitigar el riesgo"
              />
              {errors.recommendedActions && <p className="text-red-500 text-sm mt-1">{errors.recommendedActions}</p>}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsable *
                </label>
                <input
                  type="text"
                  value={formData.responsible}
                  onChange={(e) => handleInputChange('responsible', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.responsible ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nombre del responsable"
                />
                {errors.responsible && <p className="text-red-500 text-sm mt-1">{errors.responsible}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Vencimiento *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dueDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as 'pending' | 'in-progress' | 'completed')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in-progress">En Progreso</option>
                  <option value="completed">Completado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AMFEModal;
