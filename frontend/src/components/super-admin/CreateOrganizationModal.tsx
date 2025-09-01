import React, { useState } from 'react';
import { X, Building2, User, Mail, Lock, Package } from 'lucide-react';
import { useSuperAdmin } from '../../hooks/useSuperAdmin';

interface CreateOrganizationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  onClose,
  onSuccess
}) => {
  const { createOrganization, isLoading } = useSuperAdmin();
  
  const [formData, setFormData] = useState({
    name: '',
    plan: 'basic',
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la organización es requerido';
    }
    
    if (!formData.adminName.trim()) {
      newErrors.adminName = 'El nombre del administrador es requerido';
    }
    
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Email inválido';
    }
    
    if (!formData.adminPassword) {
      newErrors.adminPassword = 'La contraseña es requerida';
    } else if (formData.adminPassword.length < 6) {
      newErrors.adminPassword = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await createOrganization(formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Nueva Organización</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Nombre de la Organización
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Ej: Empresa ABC"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>
          
          {/* Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Plan
            </label>
            <select
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="basic">Basic</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          
          {/* Admin Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nombre del Administrador
            </label>
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 ${
                errors.adminName ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Ej: Juan Pérez"
            />
            {errors.adminName && (
              <p className="mt-1 text-xs text-red-400">{errors.adminName}</p>
            )}
          </div>
          
          {/* Admin Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email del Administrador
            </label>
            <input
              type="email"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 ${
                errors.adminEmail ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="admin@empresa.com"
            />
            {errors.adminEmail && (
              <p className="mt-1 text-xs text-red-400">{errors.adminEmail}</p>
            )}
          </div>
          
          {/* Admin Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Contraseña del Administrador
            </label>
            <input
              type="password"
              name="adminPassword"
              value={formData.adminPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 ${
                errors.adminPassword ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.adminPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.adminPassword}</p>
            )}
          </div>
        </form>
        
        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creando...' : 'Crear Organización'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;

