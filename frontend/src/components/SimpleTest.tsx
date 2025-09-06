import React from 'react';

const SimpleTest: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'green', fontSize: '2rem' }}>🎉 ¡ÉXITO TOTAL!</h1>
      <p style={{ fontSize: '1.2rem', color: '#333' }}>
        Si puedes ver esta página, significa que:
      </p>
      <ul style={{ fontSize: '1rem', color: '#666' }}>
        <li>✅ El frontend está corriendo correctamente</li>
        <li>✅ Las rutas están funcionando</li>
        <li>✅ React está renderizando componentes</li>
        <li>✅ NO hay redirecciones automáticas a menu-cards</li>
      </ul>
      
      <div style={{ 
        backgroundColor: '#e7f3ff', 
        padding: '15px', 
        marginTop: '20px', 
        borderRadius: '8px',
        border: '2px solid #007acc'
      }}>
        <h3 style={{ color: '#007acc' }}>📍 Información de la URL:</h3>
        <p><strong>URL Completa:</strong> {window.location.href}</p>
        <p><strong>Pathname:</strong> {window.location.pathname}</p>
        <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
      </div>

      <div style={{ 
        backgroundColor: '#e7ffe7', 
        padding: '15px', 
        marginTop: '20px', 
        borderRadius: '8px',
        border: '2px solid #00aa00'
      }}>
        <h3 style={{ color: '#00aa00' }}>🚀 Enlaces de Prueba Directos:</h3>
        <p>Copia y pega estos enlaces en el navegador:</p>
        <ul style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
          <li><a href="http://localhost:3000/app/simple-test">http://localhost:3000/app/simple-test</a></li>
          <li><a href="http://localhost:3000/app/direct-registros">http://localhost:3000/app/direct-registros</a></li>
          <li><a href="http://localhost:3000/app/test-registros">http://localhost:3000/app/test-registros</a></li>
          <li><a href="http://localhost:3000/app/registros-procesos">http://localhost:3000/app/registros-procesos</a></li>
        </ul>
      </div>

      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: '15px', 
        marginTop: '20px', 
        borderRadius: '8px',
        border: '2px solid #ffc107'
      }}>
        <h3 style={{ color: '#856404' }}>🔧 Próximos Pasos:</h3>
        <ol style={{ color: '#856404' }}>
          <li>Si ves esta página → ¡Problema resuelto!</li>
          <li>Si te redirige al menú → Problema de autenticación</li>
          <li>Si no cargas nada → Problema de servidor</li>
        </ol>
      </div>
    </div>
  );
};

export default SimpleTest;
