
const LoginPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1e293b', 
      color: 'white', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
          🔐 Login Temporal
        </h1>
        <p style={{ marginBottom: '30px', color: '#94a3b8' }}>
          El sistema de login está en reconstrucción
        </p>
        
        <button 
          onClick={() => window.location.href = '/login-new'}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '15px'
          }}
        >
          🔐 Ir al Login Nuevo
        </button>
        
        <button 
          onClick={() => window.location.href = '/bypass'}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '15px'
          }}
        >
          🚀 Ir al Bypass
        </button>
        
        <button 
          onClick={() => window.location.href = '/app/menu-cards'}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          🏠 Ir al Dashboard
        </button>
      </div>
    </div>
  );
};

export default LoginPage;