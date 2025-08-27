const axios = require('axios');

// Configuración
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
const AUTH_TOKEN = process.env.AUTH_TOKEN; // Token JWT del usuario autenticado

class CRMSetupAPI {
    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_TOKEN ? `Bearer ${AUTH_TOKEN}` : ''
            }
        });
    }

    async setupCRM() {
        console.log('🚀 Iniciando configuración CRM por API...');
        
        try {
            // 1. Verificar información de la base de datos
            console.log('📊 Verificando información de la base de datos...');
            const dbInfo = await this.api.get('/database/info');
            console.log('✅ Base de datos:', dbInfo.data);

            // 2. Crear tablas CRM
            console.log('🔧 Creando tablas CRM...');
            const setupResult = await this.api.post('/database/setup-crm');
            console.log('✅ Tablas CRM creadas:', setupResult.data);

            // 3. Insertar datos de ejemplo
            console.log('📝 Insertando datos de ejemplo...');
            const dataResult = await this.api.post('/database/insert-crm-data');
            console.log('✅ Datos de ejemplo insertados:', dataResult.data);

            // 4. Verificar tablas creadas
            console.log('🔍 Verificando tablas creadas...');
            const clientesExists = await this.api.get('/database/table-exists/clientes_agro');
            const oportunidadesExists = await this.api.get('/database/table-exists/oportunidades_agro');
            const contactosExists = await this.api.get('/database/table-exists/contactos');

            console.log('✅ Clientes:', clientesExists.data);
            console.log('✅ Oportunidades:', oportunidadesExists.data);
            console.log('✅ Contactos:', contactosExists.data);

            console.log('🎉 ¡Configuración CRM completada exitosamente!');
            return {
                success: true,
                message: 'CRM configurado correctamente',
                data: {
                    dbInfo: dbInfo.data,
                    setup: setupResult.data,
                    dataInsert: dataResult.data,
                    tables: {
                        clientes: clientesExists.data,
                        oportunidades: oportunidadesExists.data,
                        contactos: contactosExists.data
                    }
                }
            };

        } catch (error) {
            console.error('❌ Error en configuración CRM:', error.response?.data || error.message);
            return {
                success: false,
                message: 'Error en configuración CRM',
                error: error.response?.data || error.message
            };
        }
    }

    async verifyCRM() {
        console.log('🔍 Verificando estado del CRM...');
        
        try {
            const tables = ['clientes_agro', 'oportunidades_agro', 'contactos'];
            const results = {};

            for (const table of tables) {
                const exists = await this.api.get(`/database/table-exists/${table}`);
                const structure = await this.api.get(`/database/table-structure/${table}`);
                results[table] = {
                    exists: exists.data,
                    structure: structure.data
                };
            }

            console.log('✅ Estado del CRM:', results);
            return {
                success: true,
                data: results
            };

        } catch (error) {
            console.error('❌ Error verificando CRM:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }
}

// Función principal
async function main() {
    const setup = new CRMSetupAPI();
    
    // Verificar argumentos
    const args = process.argv.slice(2);
    const command = args[0] || 'setup';

    switch (command) {
        case 'setup':
            console.log('🔧 Ejecutando configuración completa...');
            const result = await setup.setupCRM();
            console.log('Resultado:', JSON.stringify(result, null, 2));
            break;

        case 'verify':
            console.log('🔍 Ejecutando verificación...');
            const verifyResult = await setup.verifyCRM();
            console.log('Resultado:', JSON.stringify(verifyResult, null, 2));
            break;

        default:
            console.log('❌ Comando no válido. Uso: node setup-crm-api.js [setup|verify]');
            console.log('📋 Comandos disponibles:');
            console.log('  setup  - Configurar CRM completo');
            console.log('  verify - Verificar estado del CRM');
            break;
    }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
    main().catch(console.error);
}

module.exports = CRMSetupAPI;
