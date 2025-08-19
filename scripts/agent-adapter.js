#!/usr/bin/env node

/**
 * ADAPTADOR DE AGENTES
 * Sincroniza el sistema auto-planner con el sistema de coordinación
 * 
 * Uso: node scripts/agent-adapter.js
 */

const fs = require('fs');
const path = require('path');

class AgentAdapter {
  constructor() {
    this.autoPlannerConfigPath = 'sistema-auto-planner-completo/scripts/auto-planner-config.json';
    this.coordinationFilePath = 'COORDINACION-AGENTES.md';
    this.autoPlannerUrl = 'http://localhost:3001';
    this.coordinationUrl = 'http://localhost:3000';
    
    // Mapeo de agentes especializados a generales
    this.agentMapping = {
      // AGENTE 1: STABILITY & CORE
      'refactor': {
        generalAgent: 'AGENTE 1: STABILITY & CORE',
        responsibilities: ['Refactorización', 'Migración TypeScript', 'Corrección de errores'],
        progress: 0
      },
      'typescript': {
        generalAgent: 'AGENTE 1: STABILITY & CORE',
        responsibilities: ['Migración TypeScript', 'Tipos', 'Configuración'],
        progress: 0
      },
      
      // AGENTE 2: UX & FEATURES
      'development': {
        generalAgent: 'AGENTE 2: UX & FEATURES',
        responsibilities: ['Desarrollo', 'Nuevas funcionalidades', 'Integración'],
        progress: 0
      },
      'qa': {
        generalAgent: 'AGENTE 2: UX & FEATURES',
        responsibilities: ['Testing', 'Calidad', 'Validación'],
        progress: 0
      },
      'forms': {
        generalAgent: 'AGENTE 2: UX & FEATURES',
        responsibilities: ['Formularios', 'UI/UX', 'Validación'],
        progress: 0
      },
      'amfe': {
        generalAgent: 'AGENTE 2: UX & FEATURES',
        responsibilities: ['Análisis de riesgos', 'Gestión de calidad'],
        progress: 0
      }
    };
    
    // Estado actual de los agentes generales
    this.generalAgents = {
      'AGENTE 1: STABILITY & CORE': {
        status: 'EN PROGRESO',
        progress: 33,
        completedTasks: 0,
        totalTasks: 0,
        specializedAgents: ['refactor', 'typescript'],
        currentTask: null
      },
      'AGENTE 2: UX & FEATURES': {
        status: 'COMPLETADO',
        progress: 100,
        completedTasks: 0,
        totalTasks: 0,
        specializedAgents: ['development', 'qa', 'forms', 'amfe'],
        currentTask: null
      }
    };
  }

  /**
   * Cargar configuración del auto-planner
   */
  loadAutoPlannerConfig() {
    try {
      if (fs.existsSync(this.autoPlannerConfigPath)) {
        const config = JSON.parse(fs.readFileSync(this.autoPlannerConfigPath, 'utf8'));
        console.log('✅ Configuración del auto-planner cargada');
        return config;
      } else {
        console.log('⚠️ Archivo de configuración del auto-planner no encontrado');
        return null;
      }
    } catch (error) {
      console.error('❌ Error cargando configuración del auto-planner:', error.message);
      return null;
    }
  }

  /**
   * Cargar estado actual de coordinación
   */
  loadCoordinationState() {
    try {
      if (fs.existsSync(this.coordinationFilePath)) {
        const content = fs.readFileSync(this.coordinationFilePath, 'utf8');
        console.log('✅ Estado de coordinación cargado');
        return this.parseCoordinationFile(content);
      } else {
        console.log('⚠️ Archivo de coordinación no encontrado');
        return null;
      }
    } catch (error) {
      console.error('❌ Error cargando estado de coordinación:', error.message);
      return null;
    }
  }

  /**
   * Parsear archivo de coordinación para extraer información
   */
  parseCoordinationFile(content) {
    const state = {
      agente1: { status: 'PENDIENTE', progreso: 0 },
      agente2: { status: 'PENDIENTE', progreso: 0 },
      problemas: [],
      ultimaActualizacion: new Date().toISOString()
    };

    // Extraer estado de AGENTE 1
    const agente1Match = content.match(/AGENTE 1.*?Estado:\*\* (.*?)\s*\*\*Progreso:\*\* (\d+)%/);
    if (agente1Match) {
      state.agente1.status = agente1Match[1].trim();
      state.agente1.progreso = parseInt(agente1Match[2]);
    }

    // Extraer estado de AGENTE 2
    const agente2Match = content.match(/AGENTE 2.*?Estado:\*\* (.*?)\s*\*\*Progreso:\*\* (\d+)%/);
    if (agente2Match) {
      state.agente2.status = agente2Match[1].trim();
      state.agente2.progreso = parseInt(agente2Match[2]);
    }

    // Extraer problemas críticos
    const problemasMatch = content.match(/PROBLEMA CRÍTICO IDENTIFICADO[\s\S]*?Estado:\*\* (.*?)\s*\*\*/);
    if (problemasMatch) {
      state.problemas.push(problemasMatch[1].trim());
    }

    return state;
  }

  /**
   * Sincronizar estados entre sistemas
   */
  async syncStates() {
    console.log('🔄 Iniciando sincronización de estados...');
    
    // Cargar configuraciones
    const autoPlannerConfig = this.loadAutoPlannerConfig();
    const coordinationState = this.loadCoordinationState();
    
    if (!autoPlannerConfig && !coordinationState) {
      console.log('⚠️ No se pudo cargar ninguna configuración');
      return;
    }

    // Actualizar agentes generales con información del auto-planner
    if (autoPlannerConfig) {
      this.updateGeneralAgentsFromAutoPlanner(autoPlannerConfig);
    }

    // Actualizar agentes generales con información de coordinación
    if (coordinationState) {
      this.updateGeneralAgentsFromCoordination(coordinationState);
    }

    // Generar reporte de sincronización
    this.generateSyncReport();
    
    console.log('✅ Sincronización completada');
  }

  /**
   * Actualizar agentes generales con datos del auto-planner
   */
  updateGeneralAgentsFromAutoPlanner(config) {
    console.log('📊 Actualizando desde auto-planner...');
    
    if (config.agents) {
      Object.keys(config.agents).forEach(agentKey => {
        const agent = config.agents[agentKey];
        const mapping = this.agentMapping[agentKey];
        
        if (mapping) {
          const generalAgent = this.generalAgents[mapping.generalAgent];
          if (generalAgent) {
            // Actualizar progreso basado en tareas completadas
            if (agent.completed !== undefined) {
              generalAgent.completedTasks += agent.completed;
            }
            
            // Actualizar estado
            if (agent.status === 'completed') {
              generalAgent.status = 'COMPLETADO';
            } else if (agent.status === 'in-progress') {
              generalAgent.status = 'EN PROGRESO';
            }
          }
        }
      });
    }

    // Calcular progreso total
    Object.keys(this.generalAgents).forEach(agentKey => {
      const agent = this.generalAgents[agentKey];
      if (agent.totalTasks > 0) {
        agent.progress = Math.round((agent.completedTasks / agent.totalTasks) * 100);
      }
    });
  }

  /**
   * Actualizar agentes generales con datos de coordinación
   */
  updateGeneralAgentsFromCoordination(state) {
    console.log('📋 Actualizando desde coordinación...');
    
    if (state.agente1) {
      this.generalAgents['AGENTE 1: STABILITY & CORE'].progress = state.agente1.progreso;
      this.generalAgents['AGENTE 1: STABILITY & CORE'].status = state.agente1.status;
    }
    
    if (state.agente2) {
      this.generalAgents['AGENTE 2: UX & FEATURES'].progress = state.agente2.progreso;
      this.generalAgents['AGENTE 2: UX & FEATURES'].status = state.agente2.status;
    }
  }

  /**
   * Generar reporte de sincronización
   */
  generateSyncReport() {
    const report = {
      timestamp: new Date().toISOString(),
      generalAgents: this.generalAgents,
      agentMapping: this.agentMapping,
      summary: {
        totalAgents: Object.keys(this.generalAgents).length,
        agentsInProgress: Object.values(this.generalAgents).filter(a => a.status === 'EN PROGRESO').length,
        agentsCompleted: Object.values(this.generalAgents).filter(a => a.status === 'COMPLETADO').length,
        averageProgress: Math.round(
          Object.values(this.generalAgents).reduce((sum, agent) => sum + agent.progress, 0) / 
          Object.keys(this.generalAgents).length
        )
      }
    };

    // Guardar reporte
    const reportPath = 'scripts/agent-sync-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📄 Reporte de sincronización generado:', reportPath);
    console.log('📊 Resumen:', report.summary);
  }

  /**
   * Mapear tareas especializadas a generales
   */
  mapTasks(specializedTasks) {
    const mappedTasks = {
      'AGENTE 1: STABILITY & CORE': [],
      'AGENTE 2: UX & FEATURES': []
    };

    specializedTasks.forEach(task => {
      const mapping = this.agentMapping[task.agent];
      if (mapping) {
        mappedTasks[mapping.generalAgent].push({
          ...task,
          originalAgent: task.agent,
          mappedAgent: mapping.generalAgent
        });
      }
    });

    return mappedTasks;
  }

  /**
   * Obtener estado unificado de agentes
   */
  getUnifiedAgentStatus() {
    return {
      agents: this.generalAgents,
      mapping: this.agentMapping,
      lastSync: new Date().toISOString()
    };
  }

  /**
   * Crear nueva orden de trabajo
   */
  createWorkOrder(workOrder) {
    console.log('📥 Creando nueva orden de trabajo:', workOrder.id);
    
    // Analizar requisitos
    const analysis = this.analyzeRequirements(workOrder);
    
    // Dividir en tareas
    const tasks = this.divideIntoTasks(analysis);
    
    // Asignar a agentes
    const assignments = this.assignToAgents(tasks);
    
    return {
      workOrder,
      analysis,
      tasks,
      assignments,
      estimatedDuration: this.calculateDuration(assignments)
    };
  }

  /**
   * Analizar requisitos de la orden de trabajo
   */
  analyzeRequirements(workOrder) {
    const analysis = {
      modules: [],
      technologies: workOrder.technologies || [],
      complexity: 'MEDIA',
      estimatedHours: workOrder.presupuesto_horas || 40
    };

    // Identificar módulos basado en requisitos
    if (workOrder.requisitos) {
      workOrder.requisitos.forEach(req => {
        if (req.toLowerCase().includes('cliente')) {
          analysis.modules.push('clientes');
        }
        if (req.toLowerCase().includes('encuesta')) {
          analysis.modules.push('encuestas');
        }
        if (req.toLowerCase().includes('dashboard')) {
          analysis.modules.push('dashboard');
        }
        if (req.toLowerCase().includes('api')) {
          analysis.modules.push('backend');
        }
      });
    }

    return analysis;
  }

  /**
   * Dividir análisis en tareas específicas
   */
  divideIntoTasks(analysis) {
    const tasks = [];

    if (analysis.modules.includes('backend')) {
      tasks.push({
        id: 'backend-api',
        name: 'Desarrollo de APIs',
        agent: 'AGENTE 1: STABILITY & CORE',
        estimatedHours: analysis.estimatedHours * 0.4,
        priority: 'ALTA'
      });
    }

    if (analysis.modules.includes('clientes') || analysis.modules.includes('encuestas')) {
      tasks.push({
        id: 'frontend-ui',
        name: 'Desarrollo de UI/UX',
        agent: 'AGENTE 2: UX & FEATURES',
        estimatedHours: analysis.estimatedHours * 0.5,
        priority: 'ALTA'
      });
    }

    tasks.push({
      id: 'testing',
      name: 'Testing y QA',
      agent: 'AGENTE 2: UX & FEATURES',
      estimatedHours: analysis.estimatedHours * 0.1,
      priority: 'MEDIA'
    });

    return tasks;
  }

  /**
   * Asignar tareas a agentes
   */
  assignToAgents(tasks) {
    const assignments = {
      'AGENTE 1: STABILITY & CORE': [],
      'AGENTE 2: UX & FEATURES': []
    };

    tasks.forEach(task => {
      assignments[task.agent].push(task);
    });

    return assignments;
  }

  /**
   * Calcular duración total
   */
  calculateDuration(assignments) {
    let totalHours = 0;
    
    Object.values(assignments).forEach(agentTasks => {
      agentTasks.forEach(task => {
        totalHours += task.estimatedHours;
      });
    });

    return {
      totalHours,
      estimatedDays: Math.ceil(totalHours / 8),
      parallelExecution: this.canExecuteInParallel(assignments)
    };
  }

  /**
   * Verificar si las tareas pueden ejecutarse en paralelo
   */
  canExecuteInParallel(assignments) {
    const agent1Tasks = assignments['AGENTE 1: STABILITY & CORE'].length;
    const agent2Tasks = assignments['AGENTE 2: UX & FEATURES'].length;
    
    return agent1Tasks > 0 && agent2Tasks > 0;
  }
}

// Función principal
async function main() {
  const adapter = new AgentAdapter();
  
  console.log('🤖 Iniciando Adaptador de Agentes...');
  
  // Sincronizar estados
  await adapter.syncStates();
  
  // Ejemplo: Crear orden de trabajo
  const workOrder = {
    id: 'CRM-001',
    titulo: 'CRM de Clientes + Encuestas',
    descripcion: 'Sistema completo de CRM con encuestas',
    prioridad: 'ALTA',
    requisitos: [
      'Gestión de clientes',
      'Encuestas anuales',
      'Dashboard de métricas'
    ],
    tecnologias: ['React', 'TypeScript', 'Node.js'],
    presupuesto_horas: 80
  };
  
  const result = adapter.createWorkOrder(workOrder);
  console.log('📋 Orden de trabajo creada:', JSON.stringify(result, null, 2));
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AgentAdapter;
