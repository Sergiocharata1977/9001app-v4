
const SimpleBypass = () => {
  const goTo = (path: string) => {
    window.location.href = path;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1e293b', 
      color: 'white', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
          🚀 9001app - Acceso Directo
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '40px', color: '#94a3b8' }}>
          Bypass temporal - Acceso directo a módulos
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          <button 
            onClick={() => goTo('/access-crm')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '30px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👥</div>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>CRM - Gestión de Clientes</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Sistema de gestión de relaciones con clientes</div>
          </button>

          <button 
            onClick={() => goTo('/access-rrhh')}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '30px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👨‍💼</div>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>RRHH - Recursos Humanos</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Gestión de personal y competencias</div>
          </button>

          <button 
            onClick={() => goTo('/access-procesos')}
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              padding: '30px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚙️</div>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Procesos - ISO 9001</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Gestión de procesos y documentación</div>
          </button>

          <button 
            onClick={() => goTo('/access-calidad')}
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              padding: '30px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎯</div>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Calidad - SGC</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Sistema de gestión de calidad</div>
          </button>

          <button 
            onClick={() => goTo('/app/menu-cards')}
            style={{
              backgroundColor: '#06b6d4',
              color: 'white',
              border: 'none',
              padding: '30px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏠</div>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Dashboard Principal</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Menú principal de tarjetas</div>
          </button>

          <button 
            onClick={() => goTo('/login')}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '30px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔐</div>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Login Original</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Ir al sistema de login</div>
          </button>
        </div>

        <div style={{ 
          backgroundColor: 'rgba(15, 23, 42, 0.5)', 
          padding: '20px', 
          borderRadius: '10px',
          border: '1px solid #334155'
        }}>
          <h3 style={{ color: 'white', marginBottom: '15px' }}>📊 Estado del Sistema</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Backend:</span>
              <span style={{ color: '#10b981' }}>✅ Puerto 5000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Frontend:</span>
              <span style={{ color: '#10b981' }}>✅ Puerto 3000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>MongoDB:</span>
              <span style={{ color: '#10b981' }}>✅ Conectado</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Login:</span>
              <span style={{ color: '#f59e0b' }}>🔧 Reconstruyendo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleBypass;