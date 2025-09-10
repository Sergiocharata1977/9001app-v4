import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono: string;
  organization_name: string;
  organization_code: string;
}

const RegisterPageNEW: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    organization_name: '',
    organization_code: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpiar error al escribir
  };

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📝 Intentando registro con:', { 
        email: formData.email,
        nombre: formData.nombre,
        apellido: formData.apellido
      });

      // Preparar datos para envío (sin confirmPassword)
      const { confirmPassword, ...registerData } = formData;

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();
      console.log('📡 Respuesta del servidor:', data);

      if (data.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        console.log('✅ Registro exitoso, redirigiendo...');
        
        // Redirigir al dashboard
        navigate('/app/menu-cards');
      } else {
        setError(data.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('❌ Error en registro:', error);
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login-new');
  };

  const handleBypassAccess = () => {
    navigate('/bypass');
  };

  return (
    <div className="login-container">
      <div className="login-card register-card">
        <div className="login-header">
          <h1>9001app</h1>
          <p>Crear Nueva Cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                placeholder="Tu nombre"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido *</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
                placeholder="Tu apellido"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="+54 11 1234-5678"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Repite tu contraseña"
                disabled={loading}
              />
            </div>
          </div>

          <div className="organization-section">
            <h3>Información de Organización (Opcional)</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="organization_name">Nombre de Organización</label>
                <input
                  type="text"
                  id="organization_name"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleInputChange}
                  placeholder="Mi Empresa S.A."
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="organization_code">Código de Organización</label>
                <input
                  type="text"
                  id="organization_code"
                  name="organization_code"
                  value={formData.organization_code}
                  onChange={handleInputChange}
                  placeholder="MIEMPRESA"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <button 
              type="button" 
              className="link-button"
              onClick={handleLoginRedirect}
              disabled={loading}
            >
              Inicia sesión aquí
            </button>
          </p>
          
          <div className="development-access">
            <button 
              type="button" 
              className="bypass-button"
              onClick={handleBypassAccess}
              disabled={loading}
            >
              🚀 Acceso Directo (Desarrollo)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPageNEW;