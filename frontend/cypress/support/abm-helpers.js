/**
 * 🤖 Helpers para Sistema de Control ABM - SGC ISO 9001
 * 📅 Última Actualización: 20-08-2025
 * 
 * Este archivo contiene helpers y utilidades para las pruebas del sistema
 * de control automático de ABM (Altas, Bajas, Modificaciones).
 */

// Configuración de módulos del sistema
export const MODULES_CONFIG = {
  // Módulos completamente funcionales
  functional: [
    {
      name: 'Personal',
      path: '/app/personal',
      service: 'personal',
      testData: {
        create: {
          nombres: 'Juan',
          apellidos: 'Pérez',
          email: 'juan.perez@test.com',
          telefono: '123456789'
        },
        update: {
          nombres: 'María',
          apellidos: 'García'
        }
      }
    },
    {
      name: 'Puestos',
      path: '/app/puestos',
      service: 'puestos',
      testData: {
        create: {
          nombre: 'Desarrollador Senior',
          descripcion: 'Desarrollo de aplicaciones web',
          responsabilidades: 'Código, testing, documentación'
        },
        update: {
          nombre: 'Desarrollador Full Stack'
        }
      }
    },
    {
      name: 'Departamentos',
      path: '/app/departamentos',
      service: 'departamentos',
      testData: {
        create: {
          nombre: 'Tecnología',
          descripcion: 'Departamento de desarrollo tecnológico',
          objetivos: 'Innovación y desarrollo de software'
        },
        update: {
          nombre: 'Tecnología e Innovación'
        }
      }
    },
    {
      name: 'Procesos',
      path: '/app/procesos',
      service: 'procesos',
      testData: {
        create: {
          nombre: 'Desarrollo de Software',
          descripcion: 'Proceso de desarrollo de aplicaciones',
          tipo: 'Principal'
        },
        update: {
          nombre: 'Desarrollo Ágil de Software'
        }
      }
    },
    {
      name: 'Documentos',
      path: '/app/documentos',
      service: 'documentos',
      testData: {
        create: {
          titulo: 'Manual de Procedimientos',
          descripcion: 'Manual de procedimientos operativos',
          tipo: 'Procedimiento'
        },
        update: {
          titulo: 'Manual de Procedimientos Actualizado'
        }
      }
    },
    {
      name: 'Normas',
      path: '/app/normas',
      service: 'normas',
      testData: {
        create: {
          codigo: 'NORM-001',
          titulo: 'Norma de Calidad',
          descripcion: 'Norma interna de calidad'
        },
        update: {
          titulo: 'Norma de Calidad Actualizada'
        }
      }
    },
    {
      name: 'CRM',
      path: '/app/crm',
      service: 'crm',
      testData: {
        create: {
          nombre: 'Empresa Test',
          email: 'contacto@empresatest.com',
          telefono: '987654321'
        },
        update: {
          nombre: 'Empresa Test Actualizada'
        }
      }
    },
    {
      name: 'Capacitaciones',
      path: '/app/capacitaciones',
      service: 'capacitaciones',
      testData: {
        create: {
          titulo: 'Capacitación ISO 9001',
          descripcion: 'Capacitación en gestión de calidad',
          duracion: '8 horas'
        },
        update: {
          titulo: 'Capacitación ISO 9001:2015'
        }
      }
    },
    {
      name: 'Productos',
      path: '/app/productos',
      service: 'productos',
      testData: {
        create: {
          nombre: 'Producto Test',
          descripcion: 'Producto de prueba',
          categoria: 'Software'
        },
        update: {
          nombre: 'Producto Test Mejorado'
        }
      }
    },
    {
      name: 'Encuestas',
      path: '/app/encuestas',
      service: 'encuestas',
      testData: {
        create: {
          titulo: 'Encuesta de Satisfacción',
          descripcion: 'Encuesta para medir satisfacción',
          tipo: 'Satisfacción'
        },
        update: {
          titulo: 'Encuesta de Satisfacción 2025'
        }
      }
    },
    {
      name: 'Usuarios',
      path: '/app/usuarios',
      service: 'usuarios',
      testData: {
        create: {
          nombre: 'Usuario Test',
          email: 'usuario.test@test.com',
          rol: 'Usuario'
        },
        update: {
          nombre: 'Usuario Test Actualizado'
        }
      }
    },
    {
      name: 'Tickets',
      path: '/app/tickets',
      service: 'tickets',
      testData: {
        create: {
          titulo: 'Ticket de Soporte',
          descripcion: 'Solicitud de soporte técnico',
          prioridad: 'Media'
        },
        update: {
          titulo: 'Ticket de Soporte Urgente'
        }
      }
    }
  ],
  
  // Módulos parcialmente implementados
  partial: [
    {
      name: 'Auditorías',
      path: '/app/auditorias',
      service: 'auditorias',
      testData: {
        create: {
          tipo: 'Interna',
          fecha: '2025-08-20',
          auditor: 'Auditor Test'
        }
      }
    },
    {
      name: 'Hallazgos',
      path: '/app/hallazgos',
      service: 'hallazgos',
      testData: {
        create: {
          descripcion: 'Hallazgo de prueba',
          severidad: 'Media',
          estado: 'Abierto'
        }
      }
    },
    {
      name: 'Acciones',
      path: '/app/acciones',
      service: 'acciones',
      testData: {
        create: {
          descripcion: 'Acción correctiva',
          tipo: 'Correctiva',
          responsable: 'Responsable Test'
        }
      }
    },
    {
      name: 'Minutas',
      path: '/app/minutas',
      service: 'minutas',
      testData: {
        create: {
          titulo: 'Minuta de Reunión',
          fecha: '2025-08-20',
          participantes: 'Equipo Test'
        }
      }
    },
    {
      name: 'Competencias',
      path: '/app/competencias',
      service: 'competencias',
      testData: {
        create: {
          nombre: 'Competencia Test',
          descripcion: 'Descripción de competencia',
          nivel: 'Intermedio'
        }
      }
    }
  ]
};

// Helpers para validación de CRUD
export const CRUDHelpers = {
  /**
   * Valida las operaciones CRUD básicas de un módulo
   * @param {string} moduleName - Nombre del módulo
   * @param {string} modulePath - Ruta del módulo
   * @param {Object} testData - Datos de prueba
   */
  validateCRUDOperations(moduleName, modulePath, testData) {
    cy.visit(modulePath);
    
    // Validar que la página se carga correctamente
    cy.get('[data-testid="listing-container"]').should('be.visible');
    cy.get('[data-testid="unified-header"]').should('be.visible');
    
    // Validar operación CREATE
    if (testData.create) {
      cy.get('[data-testid="btn-nuevo"]').click();
      cy.get('[data-testid="form-container"]').should('be.visible');
      
      // Llenar formulario con datos de prueba
      Object.entries(testData.create).forEach(([field, value]) => {
        cy.get(`[data-testid="input-${field}"]`).type(value);
      });
      
      cy.get('[data-testid="btn-guardar"]').click();
      cy.get('[data-testid="success-message"]').should('be.visible');
    }
    
    // Validar operación READ
    cy.get('[data-testid="data-table"]').should('be.visible');
    cy.get('[data-testid="data-row"]').should('have.length.greaterThan', 0);
    
    // Validar operación UPDATE
    if (testData.update) {
      cy.get('[data-testid="btn-editar"]').first().click();
      cy.get('[data-testid="form-container"]').should('be.visible');
      
      // Actualizar campos
      Object.entries(testData.update).forEach(([field, value]) => {
        cy.get(`[data-testid="input-${field}"]`).clear().type(value);
      });
      
      cy.get('[data-testid="btn-guardar"]').click();
      cy.get('[data-testid="success-message"]').should('be.visible');
    }
    
    // Validar operación DELETE
    cy.get('[data-testid="btn-eliminar"]').first().click();
    cy.get('[data-testid="confirm-delete"]').click();
    cy.get('[data-testid="success-message"]').should('be.visible');
  },

  /**
   * Valida la integridad de datos de un módulo
   * @param {string} moduleName - Nombre del módulo
   * @param {string} serviceName - Nombre del servicio
   */
  validateDataIntegrity(moduleName, serviceName) {
    // Validar endpoint de API
    cy.request('GET', `/api/${serviceName}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('data');
      
      // Validar estructura de datos
      if (response.body.data && response.body.data.length > 0) {
        const firstRecord = response.body.data[0];
        expect(firstRecord).to.have.property('id');
        expect(firstRecord).to.have.property('created_at');
      }
    });
  },

  /**
   * Valida las relaciones entre módulos
   * @param {string} sourceModule - Módulo origen
   * @param {string} targetModule - Módulo destino
   */
  validateRelationships(sourceModule, targetModule) {
    cy.visit(sourceModule.path);
    cy.get('[data-testid="data-row"]').first().click();
    
    // Validar que se muestran las relaciones
    cy.get(`[data-testid="${targetModule.name.toLowerCase()}-info"]`).should('be.visible');
  }
};

// Helpers para validación de calidad
export const QualityHelpers = {
  /**
   * Valida la calidad general del módulo
   * @param {string} moduleName - Nombre del módulo
   */
  validateModuleQuality(moduleName) {
    cy.visit('/app/abm-control');
    cy.get('[data-testid="module-quality-check"]').click();
    cy.get(`[data-testid="${moduleName.toLowerCase()}-quality"]`).should('be.visible');
  },

  /**
   * Genera reporte de calidad
   */
  generateQualityReport() {
    cy.visit('/app/abm-control');
    cy.get('[data-testid="generate-quality-report"]').click();
    cy.get('[data-testid="quality-report"]').should('be.visible');
  },

  /**
   * Valida cumplimiento ISO 9001
   */
  validateISOCompliance() {
    cy.visit('/app/abm-control');
    cy.get('[data-testid="iso-compliance-check"]').click();
    cy.get('[data-testid="compliance-results"]').should('be.visible');
  }
};

// Helpers para validación de rendimiento
export const PerformanceHelpers = {
  /**
   * Valida el tiempo de carga de una página
   * @param {string} pagePath - Ruta de la página
   * @param {number} maxTime - Tiempo máximo en milisegundos
   */
  validatePageLoadTime(pagePath, maxTime = 5000) {
    const startTime = Date.now();
    cy.visit(pagePath);
    cy.get('[data-testid="listing-container"]', { timeout: maxTime }).should('be.visible');
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    expect(loadTime).to.be.lessThan(maxTime);
  },

  /**
   * Valida el tiempo de respuesta de la API
   * @param {string} endpoint - Endpoint de la API
   * @param {number} maxTime - Tiempo máximo en milisegundos
   */
  validateAPIResponseTime(endpoint, maxTime = 2000) {
    cy.request({
      method: 'GET',
      url: endpoint,
      timeout: maxTime * 2
    }).then((response) => {
      expect(response.duration).to.be.lessThan(maxTime);
    });
  }
};

// Helpers para validación de seguridad
export const SecurityHelpers = {
  /**
   * Valida permisos de usuario
   * @param {string} userRole - Rol del usuario
   * @param {string} modulePath - Ruta del módulo
   */
  validateUserPermissions(userRole, modulePath) {
    // Cambiar a usuario con rol específico
    cy.login(`${userRole}@test.com`, 'password123');
    cy.visit(modulePath);
    
    // Validar que los elementos apropiados están visibles/ocultos
    if (userRole === 'admin') {
      cy.get('[data-testid="btn-nuevo"]').should('be.visible');
      cy.get('[data-testid="btn-eliminar"]').should('be.visible');
    } else {
      cy.get('[data-testid="btn-nuevo"]').should('not.exist');
      cy.get('[data-testid="btn-eliminar"]').should('not.exist');
    }
  },

  /**
   * Valida aislamiento de datos entre organizaciones
   */
  validateDataIsolation() {
    cy.visit('/app/personal');
    cy.get('[data-testid="organization-filter"]').should('be.visible');
    
    // Cambiar organización y validar que los datos cambian
    cy.get('[data-testid="organization-filter"]').select('2');
    cy.get('[data-testid="data-table"]').should('be.visible');
  }
};

// Helpers para generación de reportes
export const ReportHelpers = {
  /**
   * Genera reporte detallado de validación
   * @param {string} moduleName - Nombre del módulo
   */
  generateValidationReport(moduleName) {
    cy.visit('/app/abm-control');
    cy.get('[data-testid="detailed-report"]').click();
    cy.get('[data-testid="module-breakdown"]').should('be.visible');
    cy.get(`[data-testid="${moduleName.toLowerCase()}-report"]`).should('be.visible');
  },

  /**
   * Exporta reporte en diferentes formatos
   * @param {string} format - Formato de exportación (pdf, excel, json)
   */
  exportReport(format) {
    cy.visit('/app/abm-control');
    cy.get('[data-testid="export-report"]').click();
    cy.get(`[data-testid="export-${format}"]`).click();
    
    // Validar que se descarga el archivo
    cy.readFile(`cypress/downloads/report.${format}`).should('exist');
  }
};

// Helpers para manejo de errores
export const ErrorHelpers = {
  /**
   * Simula error de API y valida manejo
   * @param {string} endpoint - Endpoint a simular error
   */
  simulateAPIError(endpoint) {
    cy.intercept('GET', endpoint, { statusCode: 500 });
    cy.visit('/app/personal');
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="retry-button"]').should('be.visible');
  },

  /**
   * Valida manejo de errores de validación
   */
  validateErrorHandling() {
    cy.visit('/app/personal');
    cy.get('[data-testid="btn-nuevo"]').click();
    cy.get('[data-testid="btn-guardar"]').click();
    cy.get('[data-testid="validation-errors"]').should('be.visible');
  }
};

// Comandos personalizados de Cypress
Cypress.Commands.add('validateModuleCRUD', (moduleName, modulePath, testData) => {
  CRUDHelpers.validateCRUDOperations(moduleName, modulePath, testData);
});

Cypress.Commands.add('validateDataIntegrity', (moduleName, serviceName) => {
  CRUDHelpers.validateDataIntegrity(moduleName, serviceName);
});

Cypress.Commands.add('validateModuleQuality', (moduleName) => {
  QualityHelpers.validateModuleQuality(moduleName);
});

Cypress.Commands.add('validatePagePerformance', (pagePath, maxTime) => {
  PerformanceHelpers.validatePageLoadTime(pagePath, maxTime);
});

Cypress.Commands.add('validateUserPermissions', (userRole, modulePath) => {
  SecurityHelpers.validateUserPermissions(userRole, modulePath);
});

Cypress.Commands.add('generateValidationReport', (moduleName) => {
  ReportHelpers.generateValidationReport(moduleName);
});

Cypress.Commands.add('simulateAPIError', (endpoint) => {
  ErrorHelpers.simulateAPIError(endpoint);
});
