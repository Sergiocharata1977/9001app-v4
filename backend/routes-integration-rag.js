
// Integración de rutas RAG en el servidor principal
// Agregar en el archivo principal de rutas (app.js o index.js)

const ragRoutes = require('./routes/rag.routes.js');

// Agregar las rutas RAG
app.use('/api/rag', ragRoutes);

console.log('✅ Rutas RAG integradas en /api/rag');
