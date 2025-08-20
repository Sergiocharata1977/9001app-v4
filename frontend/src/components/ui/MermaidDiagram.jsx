import React from 'react';

const MermaidDiagram = ({ chart, className = '' }) => {
  // Función para generar un diagrama SVG simple basado en el tipo de chart
  const generateSimpleDiagram = (chartType) => {
    if (chartType.includes('graph TD') || chartType.includes('graph LR')) {
      return (
        <div className="w-full overflow-x-auto">
          <svg width="1000" height="600" viewBox="0 0 1000 600" className="w-full">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
              </marker>
            </defs>
            
            {/* Diagrama de Tablas de Base de Datos */}
            <g>
              {/* Tabla Principal - Personal */}
              <rect x="50" y="50" width="150" height="120" rx="8" 
                fill="#e3f2fd" stroke="#3b82f6" strokeWidth="2" />
              <text x="125" y="75" textAnchor="middle" fill="#1e40af" 
                fontSize="14" fontWeight="bold">👥 personal</text>
              <text x="125" y="95" textAnchor="middle" fill="#374151" 
                fontSize="10">id (PK)</text>
              <text x="125" y="110" textAnchor="middle" fill="#374151" 
                fontSize="10">nombre</text>
              <text x="125" y="125" textAnchor="middle" fill="#374151" 
                fontSize="10">email</text>
              <text x="125" y="140" textAnchor="middle" fill="#374151" 
                fontSize="10">organizacion_id</text>
              <text x="125" y="155" textAnchor="middle" fill="#374151" 
                fontSize="10">rol</text>
              
              {/* Tabla Hallazgos */}
              <rect x="250" y="50" width="150" height="120" rx="8" 
                fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
              <text x="325" y="75" textAnchor="middle" fill="#92400e" 
                fontSize="14" fontWeight="bold">⚠️ hallazgos</text>
              <text x="325" y="95" textAnchor="middle" fill="#374151" 
                fontSize="10">id (PK)</text>
              <text x="325" y="110" textAnchor="middle" fill="#374151" 
                fontSize="10">titulo</text>
              <text x="325" y="125" textAnchor="middle" fill="#374151" 
                fontSize="10">descripcion</text>
              <text x="325" y="140" textAnchor="middle" fill="#374151" 
                fontSize="10">estado</text>
              <text x="325" y="155" textAnchor="middle" fill="#374151" 
                fontSize="10">personal_id (FK)</text>
              
              {/* Tabla Auditorias */}
              <rect x="450" y="50" width="150" height="120" rx="8" 
                fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
              <text x="525" y="75" textAnchor="middle" fill="#065f46" 
                fontSize="14" fontWeight="bold">📊 auditorias</text>
              <text x="525" y="95" textAnchor="middle" fill="#374151" 
                fontSize="10">id (PK)</text>
              <text x="525" y="110" textAnchor="middle" fill="#374151" 
                fontSize="10">fecha</text>
              <text x="525" y="125" textAnchor="middle" fill="#374151" 
                fontSize="10">tipo</text>
              <text x="525" y="140" textAnchor="middle" fill="#374151" 
                fontSize="10">resultado</text>
              <text x="525" y="155" textAnchor="middle" fill="#374151" 
                fontSize="10">auditor_id (FK)</text>
              
              {/* Tabla Organizaciones */}
              <rect x="650" y="50" width="150" height="120" rx="8" 
                fill="#fce4ec" stroke="#ec4899" strokeWidth="2" />
              <text x="725" y="75" textAnchor="middle" fill="#be185d" 
                fontSize="14" fontWeight="bold">🏢 organizaciones</text>
              <text x="725" y="95" textAnchor="middle" fill="#374151" 
                fontSize="10">id (PK)</text>
              <text x="725" y="110" textAnchor="middle" fill="#374151" 
                fontSize="10">nombre</text>
              <text x="725" y="125" textAnchor="middle" fill="#374151" 
                fontSize="10">plan</text>
              <text x="725" y="140" textAnchor="middle" fill="#374151" 
                fontSize="10">estado</text>
              <text x="725" y="155" textAnchor="middle" fill="#374151" 
                fontSize="10">fecha_creacion</text>
              
              {/* Tablas SGC */}
              <rect x="50" y="250" width="150" height="100" rx="8" 
                fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
              <text x="125" y="275" textAnchor="middle" fill="#3730a3" 
                fontSize="14" fontWeight="bold">🔗 sgc_personal_relaciones</text>
              <text x="125" y="295" textAnchor="middle" fill="#374151" 
                fontSize="10">personal_id (FK)</text>
              <text x="125" y="310" textAnchor="middle" fill="#374151" 
                fontSize="10">proceso_id (FK)</text>
              <text x="125" y="325" textAnchor="middle" fill="#374151" 
                fontSize="10">rol_proceso</text>
              
              <rect x="250" y="250" width="150" height="100" rx="8" 
                fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
              <text x="325" y="275" textAnchor="middle" fill="#92400e" 
                fontSize="14" fontWeight="bold">📄 sgc_documentos_relacionados</text>
              <text x="325" y="295" textAnchor="middle" fill="#374151" 
                fontSize="10">documento_id (FK)</text>
              <text x="325" y="310" textAnchor="middle" fill="#374151" 
                fontSize="10">proceso_id (FK)</text>
              <text x="325" y="325" textAnchor="middle" fill="#374151" 
                fontSize="10">tipo_relacion</text>
              
              <rect x="450" y="250" width="150" height="100" rx="8" 
                fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
              <text x="525" y="275" textAnchor="middle" fill="#065f46" 
                fontSize="14" fontWeight="bold">📚 sgc_normas_relacionadas</text>
              <text x="525" y="295" textAnchor="middle" fill="#374151" 
                fontSize="10">norma_id (FK)</text>
              <text x="525" y="310" textAnchor="middle" fill="#374151" 
                fontSize="10">proceso_id (FK)</text>
              <text x="525" y="325" textAnchor="middle" fill="#374151" 
                fontSize="10">aplicabilidad</text>
              
              <rect x="650" y="250" width="150" height="100" rx="8" 
                fill="#fce4ec" stroke="#ec4899" strokeWidth="2" />
              <text x="725" y="275" textAnchor="middle" fill="#be185d" 
                fontSize="14" fontWeight="bold">⚙️ sgc_procesos_relacionados</text>
              <text x="725" y="295" textAnchor="middle" fill="#374151" 
                fontSize="10">proceso_id (PK)</text>
              <text x="725" y="310" textAnchor="middle" fill="#374151" 
                fontSize="10">nombre_proceso</text>
              <text x="725" y="325" textAnchor="middle" fill="#374151" 
                fontSize="10">descripcion</text>
              
              {/* Flechas de Relación */}
              <line x1="200" y1="110" x2="250" y2="110" 
                stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="225" y="105" fill="#6b7280" fontSize="10">1:N</text>
              
              <line x1="200" y1="110" x2="250" y2="170" 
                stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="225" y="150" fill="#6b7280" fontSize="10">1:N</text>
              
              <line x1="400" y1="110" x2="450" y2="110" 
                stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="425" y="105" fill="#6b7280" fontSize="10">1:N</text>
              
              <line x1="600" y1="110" x2="650" y2="110" 
                stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="625" y="105" fill="#6b7280" fontSize="10">1:N</text>
              
              {/* Relaciones SGC */}
              <line x1="125" y1="350" x2="125" y2="250" 
                stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="325" y1="350" x2="325" y2="250" 
                stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="525" y1="350" x2="525" y2="250" 
                stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="725" y1="350" x2="725" y2="250" 
                stroke="#ec4899" strokeWidth="2" markerEnd="url(#arrowhead)" />
            </g>
          </svg>
        </div>
      );
    }
    
    // Diagrama de estructura de archivos detallado
    return (
      <div className="w-full overflow-x-auto">
        <svg width="1200" height="800" viewBox="0 0 1200 800" className="w-full">
          <defs>
            <marker id="arrowhead2" markerWidth="10" markerHeight="7" 
              refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
            </marker>
          </defs>
          
          {/* Nodos del diagrama de estructura */}
          <g>
            {/* Nodo raíz */}
            <rect x="550" y="20" width="120" height="50" rx="8" 
              fill="#e3f2fd" stroke="#3b82f6" strokeWidth="2" />
            <text x="610" y="50" textAnchor="middle" fill="#1e40af" 
              fontSize="16" fontWeight="bold">📦 9001app2</text>
            
            {/* Backend */}
            <rect x="50" y="120" width="120" height="50" rx="6" 
              fill="#f3e5f5" stroke="#8b5cf6" strokeWidth="2" />
            <text x="110" y="150" textAnchor="middle" fill="#581c87" 
              fontSize="14" fontWeight="bold">🔧 Backend</text>
            
            {/* Frontend */}
            <rect x="200" y="120" width="120" height="50" rx="6" 
              fill="#e8f5e8" stroke="#22c55e" strokeWidth="2" />
            <text x="260" y="150" textAnchor="middle" fill="#166534" 
              fontSize="14" fontWeight="bold">🎨 Frontend</text>
            
            {/* Docs */}
            <rect x="350" y="120" width="120" height="50" rx="6" 
              fill="#fff3e0" stroke="#f97316" strokeWidth="2" />
            <text x="410" y="150" textAnchor="middle" fill="#c2410c" 
              fontSize="14" fontWeight="bold">📚 Docs</text>
            
            {/* Scripts */}
            <rect x="500" y="120" width="120" height="50" rx="6" 
              fill="#fce4ec" stroke="#ec4899" strokeWidth="2" />
            <text x="560" y="150" textAnchor="middle" fill="#be185d" 
              fontSize="14" fontWeight="bold">🛠️ Scripts</text>
            
            {/* Logs */}
            <rect x="650" y="120" width="120" height="50" rx="6" 
              fill="#f1f8e9" stroke="#689f38" strokeWidth="2" />
            <text x="710" y="150" textAnchor="middle" fill="#33691e" 
              fontSize="14" fontWeight="bold">📊 Logs</text>
            
            {/* Subdirectorios Backend */}
            <rect x="20" y="220" width="100" height="40" rx="4" 
              fill="#f3e5f5" stroke="#8b5cf6" strokeWidth="1" />
            <text x="70" y="245" textAnchor="middle" fill="#581c87" 
              fontSize="12">Controllers</text>
            
            <rect x="130" y="220" width="100" height="40" rx="4" 
              fill="#f3e5f5" stroke="#8b5cf6" strokeWidth="1" />
            <text x="180" y="245" textAnchor="middle" fill="#581c87" 
              fontSize="12">Routes</text>
            
            <rect x="20" y="280" width="100" height="40" rx="4" 
              fill="#f3e5f5" stroke="#8b5cf6" strokeWidth="1" />
            <text x="70" y="305" textAnchor="middle" fill="#581c87" 
              fontSize="12">Services</text>
            
            <rect x="130" y="280" width="100" height="40" rx="4" 
              fill="#f3e5f5" stroke="#8b5cf6" strokeWidth="1" />
            <text x="180" y="305" textAnchor="middle" fill="#581c87" 
              fontSize="12">Database</text>
            
            <rect x="20" y="340" width="100" height="40" rx="4" 
              fill="#f3e5f5" stroke="#8b5cf6" strokeWidth="1" />
            <text x="70" y="365" textAnchor="middle" fill="#581c87" 
              fontSize="12">Middleware</text>
            
            <rect x="130" y="340" width="100" height="40" rx="4" 
              fill="#f3e5f5" stroke="#8b5cf6" strokeWidth="1" />
            <text x="180" y="365" textAnchor="middle" fill="#581c87" 
              fontSize="12">RAG-Backend</text>
            
            {/* Subdirectorios Frontend */}
            <rect x="220" y="220" width="100" height="40" rx="4" 
              fill="#e8f5e8" stroke="#22c55e" strokeWidth="1" />
            <text x="270" y="245" textAnchor="middle" fill="#166534" 
              fontSize="12">Components</text>
            
            <rect x="330" y="220" width="100" height="40" rx="4" 
              fill="#e8f5e8" stroke="#22c55e" strokeWidth="1" />
            <text x="380" y="245" textAnchor="middle" fill="#166534" 
              fontSize="12">Pages</text>
            
            <rect x="220" y="280" width="100" height="40" rx="4" 
              fill="#e8f5e8" stroke="#22c55e" strokeWidth="1" />
            <text x="270" y="305" textAnchor="middle" fill="#166534" 
              fontSize="12">Services</text>
            
            <rect x="330" y="280" width="100" height="40" rx="4" 
              fill="#e8f5e8" stroke="#22c55e" strokeWidth="1" />
            <text x="380" y="305" textAnchor="middle" fill="#166534" 
              fontSize="12">Hooks</text>
            
            <rect x="220" y="340" width="100" height="40" rx="4" 
              fill="#e8f5e8" stroke="#22c55e" strokeWidth="1" />
            <text x="270" y="365" textAnchor="middle" fill="#166534" 
              fontSize="12">Types</text>
            
            <rect x="330" y="340" width="100" height="40" rx="4" 
              fill="#e8f5e8" stroke="#22c55e" strokeWidth="1" />
            <text x="380" y="365" textAnchor="middle" fill="#166534" 
              fontSize="12">Utils</text>
            
            {/* Archivos específicos */}
            <rect x="20" y="420" width="80" height="30" rx="3" 
              fill="#f3e5f5" stroke="#8b5cf6" strokeWidth="1" />
            <text x="60" y="440" textAnchor="middle" fill="#581c87" 
              fontSize="10">authController.js</text>
            
            <rect x="110" y="420" width="80" height="30" rx="3" 
              fill="#f3e5f5" stroke="#8b5cf6" strokeWidth="1" />
            <text x="150" y="440" textAnchor="middle" fill="#581c87" 
              fontSize="10">personalController.js</text>
            
            <rect x="200" y="420" width="80" height="30" rx="3" 
              fill="#f3e5f5" stroke="#8b5cf6" strokeWidth="1" />
            <text x="240" y="440" textAnchor="middle" fill="#581c87" 
              fontSize="10">hallazgosController.js</text>
            
            <rect x="290" y="420" width="80" height="30" rx="3" 
              fill="#f3e5f5" stroke="#8b5cf6" strokeWidth="1" />
            <text x="330" y="440" textAnchor="middle" fill="#581c87" 
              fontSize="10">auditoriasController.js</text>
            
            <rect x="220" y="470" width="80" height="30" rx="3" 
              fill="#e8f5e8" stroke="#22c55e" strokeWidth="1" />
            <text x="260" y="490" textAnchor="middle" fill="#166534" 
              fontSize="10">App.jsx</text>
            
            <rect x="310" y="470" width="80" height="30" rx="3" 
              fill="#e8f5e8" stroke="#22c55e" strokeWidth="1" />
            <text x="350" y="490" textAnchor="middle" fill="#166534" 
              fontSize="10">main.jsx</text>
            
            <rect x="400" y="470" width="80" height="30" rx="3" 
              fill="#e8f5e8" stroke="#22c55e" strokeWidth="1" />
            <text x="440" y="490" textAnchor="middle" fill="#166534" 
              fontSize="10">index.css</text>
            
            {/* Archivos de documentación */}
            <rect x="350" y="220" width="100" height="40" rx="4" 
              fill="#fff3e0" stroke="#f97316" strokeWidth="1" />
            <text x="400" y="245" textAnchor="middle" fill="#c2410c" 
              fontSize="12">COORDINACION-AGENTES.md</text>
            
            <rect x="460" y="220" width="100" height="40" rx="4" 
              fill="#fff3e0" stroke="#f97316" strokeWidth="1" />
            <text x="510" y="245" textAnchor="middle" fill="#c2410c" 
              fontSize="12">database-flow-diagram.md</text>
            
            <rect x="570" y="220" width="100" height="40" rx="4" 
              fill="#fff3e0" stroke="#f97316" strokeWidth="1" />
            <text x="620" y="245" textAnchor="middle" fill="#c2410c" 
              fontSize="12">file-structure-diagram.md</text>
            
            {/* Scripts */}
            <rect x="500" y="280" width="100" height="40" rx="4" 
              fill="#fce4ec" stroke="#ec4899" strokeWidth="1" />
            <text x="550" y="305" textAnchor="middle" fill="#be185d" 
              fontSize="12">agent-monitor.js</text>
            
            <rect x="610" y="280" width="100" height="40" rx="4" 
              fill="#fce4ec" stroke="#ec4899" strokeWidth="1" />
            <text x="660" y="305" textAnchor="middle" fill="#be185d" 
              fontSize="12">auto-cleanup.js</text>
            
            <rect x="720" y="280" width="100" height="40" rx="4" 
              fill="#fce4ec" stroke="#ec4899" strokeWidth="1" />
            <text x="770" y="305" textAnchor="middle" fill="#be185d" 
              fontSize="12">database-tracker.js</text>
            
            {/* Flechas principales */}
            <line x1="610" y1="70" x2="110" y2="120" 
              stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead2)" />
            <line x1="610" y1="70" x2="260" y2="120" 
              stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead2)" />
            <line x1="610" y1="70" x2="410" y2="120" 
              stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead2)" />
            <line x1="610" y1="70" x2="560" y2="120" 
              stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead2)" />
            <line x1="610" y1="70" x2="710" y2="120" 
              stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead2)" />
            
            {/* Flechas subdirectorios */}
            <line x1="110" y1="170" x2="70" y2="220" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="110" y1="170" x2="180" y2="220" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="110" y1="170" x2="70" y2="280" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="110" y1="170" x2="180" y2="280" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="110" y1="170" x2="70" y2="340" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="110" y1="170" x2="180" y2="340" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            
            <line x1="260" y1="170" x2="270" y2="220" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="260" y1="170" x2="380" y2="220" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="260" y1="170" x2="270" y2="280" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="260" y1="170" x2="380" y2="280" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="260" y1="170" x2="270" y2="340" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="260" y1="170" x2="380" y2="340" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            
            {/* Flechas a archivos específicos */}
            <line x1="70" y1="260" x2="60" y2="420" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="180" y1="260" x2="150" y2="420" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="70" y1="260" x2="240" y2="420" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="180" y1="260" x2="330" y2="420" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            
            <line x1="270" y1="380" x2="260" y2="470" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="380" y1="380" x2="350" y2="470" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
            <line x1="380" y1="380" x2="440" y2="470" 
              stroke="#374151" strokeWidth="1" markerEnd="url(#arrowhead2)" />
          </g>
        </svg>
      </div>
    );
  };

  return (
    <div className={`mermaid-diagram ${className}`}>
      {generateSimpleDiagram(chart)}
    </div>
  );
};

export default MermaidDiagram;
