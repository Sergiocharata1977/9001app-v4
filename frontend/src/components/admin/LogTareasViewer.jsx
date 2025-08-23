import { CheckCircle, Clock, Plus, RefreshCw, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const LogTareasViewer = () => {
    const [content, setContent] = useState('');
    const [lastUpdate, setLastUpdate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Función para cargar el contenido del documento
    const loadDocument = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Contenido del log de tareas (versión actualizada)
            const data = `# 🎯 LOG DE TAREAS - AGENTES IA

**📅 Última actualización:** 22/8/2025, 11:00:00  
**🎯 Propósito:** Registro cronológico de tareas realizadas por agentes IA  
**📋 Formato:** Tareas más recientes en la parte superior  

---

## 🚀 **TAREAS CRONOLÓGICAS**

### **Tarea #006 - 22/8/2025, 10:50:00 a 22/8/2025, 11:00:00**
- **Agente:** Claude Sonnet 4
- **Tarea realizada:** Reorganización completa del sistema de documentación
- **Documentos trabajados:** 
  - Eliminación de archivos obsoletos
  - Creación de nueva estructura cronológica
  - Actualización de documentación de proyectos
- **Estado:** ✅ Completada
- **Contexto:** Sistema de documentación limpio y organizado

### **Tarea #005 - 22/8/2025, 10:39:31 a 22/8/2025, 10:50:00**
- **Agente:** Claude Sonnet 4
- **Tarea realizada:** Implementación del sistema de control y monitoreo de scripts
- **Documentos trabajados:** 
  - control-sistema-scripts.js
  - proyecto-coordinacion-hibrida.md
  - Documentación unificada del sistema
- **Estado:** ✅ Completada
- **Contexto:** Monitoreo automático cada 5 minutos, alertas de fallos

### **Tarea #004 - 22/8/2025, 10:30:34 a 22/8/2025, 10:39:31**
- **Agente:** Sistema de Actualización Automática
- **Tarea realizada:** Actualización automática de documentación y mapas
- **Documentos trabajados:** 
  - Mapa de archivos automático
  - Mapa de base de datos automático
  - Documentos de coordinación
- **Estado:** ✅ Completada
- **Contexto:** Mantenimiento automático del contexto para agentes IA

### **Tarea #003 - 22/8/2025, 10:20:00 a 22/8/2025, 10:30:34**
- **Agente:** Claude Sonnet 4
- **Tarea realizada:** Resolución de problemas del sistema de coordinación
- **Documentos trabajados:** 
  - CoordinacionTareasViewer.jsx
  - SuperAdminRoutes.jsx
  - Configuración de rutas
- **Estado:** ✅ Completada
- **Contexto:** Sistema de coordinación funcionando correctamente

### **Tarea #002 - 22/8/2025, 10:00:00 a 22/8/2025, 10:20:00**
- **Agente:** Claude Sonnet 4
- **Tarea realizada:** Consolidación y simplificación del sistema de coordinación
- **Documentos trabajados:** 
  - Documentos de coordinación
  - Scripts de actualización
  - Eliminación de scripts obsoletos
- **Estado:** ✅ Completada
- **Contexto:** Sistema unificado con datos esenciales y reglas de guardado

### **Tarea #001 - 22/8/2025, 09:30:00 a 22/8/2025, 10:00:00**
- **Agente:** Claude Sonnet 4
- **Tarea realizada:** Análisis inicial del sistema de documentación
- **Documentos trabajados:** 
  - Revisión de estructura actual
  - Identificación de problemas
  - Planificación de mejoras
- **Estado:** ✅ Completada
- **Contexto:** Diagnóstico inicial del sistema de documentación

---

## 📊 **ESTADÍSTICAS DE TAREAS**

### **Tareas por Agente**
- **Claude Sonnet 4:** 5 tareas
- **Sistema de Actualización Automática:** 1 tarea

### **Tareas por Estado**
- **Completadas:** 6 tareas
- **En progreso:** 0 tareas
- **Fallidas:** 0 tareas

### **Tareas por Tipo**
- **Desarrollo:** 3 tareas
- **Mantenimiento:** 2 tareas
- **Automatización:** 1 tarea

---

## 📝 **INSTRUCCIONES PARA AGENTES**

### **Cómo Registrar una Nueva Tarea**
1. **Abrir** este documento
2. **Agregar** nueva entrada en la parte superior
3. **Incrementar** el número de tarea
4. **Registrar** fecha de inicio y finalización
5. **Documentar** agente, tarea, archivos y estado
6. **Actualizar** estadísticas al final

### **Formato de Entrada**
\`\`\`
### **Tarea #XXX - [FECHA INICIO] a [FECHA FINALIZACIÓN]**
- **Agente:** [NOMBRE AGENTE]
- **Tarea realizada:** [DESCRIPCIÓN DETALLADA]
- **Documentos trabajados:** [LISTA DE ARCHIVOS]
- **Estado:** ✅ Completada / 🔄 En progreso / ❌ Fallida
- **Contexto:** [INFORMACIÓN RELEVANTE]
\`\`\`

---

**🎯 Documento generado automáticamente por el Sistema de Actualización Automática**  
**📅 Última revisión:** 22/8/2025, 11:00:00`;

            setContent(data);
            setLastUpdate(new Date().toLocaleString('es-ES'));
            setIsLoading(false);
        } catch (error) {
            console.error('Error cargando documento:', error);
            setError('Error al cargar el documento de tareas');
            setIsLoading(false);
        }
    };

    // Cargar documento al montar el componente
    useEffect(() => {
        loadDocument();
    }, []);

    // Auto-refresh cada 5 minutos si está habilitado
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            loadDocument();
        }, 5 * 60 * 1000); // 5 minutos

        return () => clearInterval(interval);
    }, [autoRefresh]);

    // Función para renderizar markdown básico
    const renderMarkdown = (text) => {
        return text
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-blue-600 mt-4 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-800 mt-6 mb-3">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-4">$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/✅/g, '<span class="text-green-600">✅</span>')
            .replace(/🔄/g, '<span class="text-yellow-600">🔄</span>')
            .replace(/❌/g, '<span class="text-red-600">❌</span>')
            .replace(/🎯/g, '<span class="text-blue-600">🎯</span>')
            .replace(/📅/g, '<span class="text-gray-600">📅</span>')
            .replace(/📋/g, '<span class="text-gray-600">📋</span>')
            .replace(/🚀/g, '<span class="text-purple-600">🚀</span>')
            .replace(/📊/g, '<span class="text-indigo-600">📊</span>')
            .replace(/📝/g, '<span class="text-green-600">📝</span>')
            .replace(/\n/g, '<br>');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Cargando log de tareas...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-800">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🎯 Log de Tareas - Agentes IA</h1>
                    <p className="text-gray-600 mt-1">
                        Registro cronológico de actividades de agentes IA
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={loadDocument}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Actualizar
                    </button>
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${autoRefresh
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <Clock className="h-4 w-4 mr-1" />
                        Auto-refresh
                    </button>
                </div>
            </div>

            {/* Last Update */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <div className="flex items-center text-blue-800">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                        Última actualización: {lastUpdate}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none">
                <div
                    className="markdown-content"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                />
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                            Sistema funcionando
                        </span>
                        <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-blue-600" />
                            Actualización automática cada 5 min
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Plus className="h-4 w-4 mr-1" />
                        <span>Para agregar nueva tarea, editar el documento</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogTareasViewer;
