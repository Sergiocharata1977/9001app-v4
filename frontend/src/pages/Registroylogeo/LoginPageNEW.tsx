import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPageNEW: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Intentando login con:', { email: formData.email });

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('📡 Respuesta del servidor:', data);

      if (data.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        console.log('✅ Login exitoso, redirigiendo...');
        
        // Redirigir al dashboard
        navigate('/app/menu-cards');
      } else {
        setError(data.message || 'Error en el login');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register-new');
  };

  const handleBypassAccess = () => {
    navigate('/bypass');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>9001app</h1>
          <p>Sistema de Gestión de Calidad ISO 9001</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
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
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Tu contraseña"
              disabled={loading}
            />
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
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿No tienes cuenta?{' '}
            <button 
              type="button" 
              className="link-button"
              onClick={handleRegisterRedirect}
              disabled={loading}
            >
              Regístrate aquí
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

export default LoginPageNEW;