const mongoClient = require('../lib/mongoClient.js');

class DatabaseSetupService {
    constructor() {
        this.mongoClient = mongoClient;
    }

    /**
     * Crear colección personalizada
     */
    async createCollection(collectionName, options = {}) {
        try {
            const db = await this.mongoClient.connect();
            await db.createCollection(collectionName, options);
            
            return {
                success: true,
                message: `Colección ${collectionName} creada exitosamente`
            };
        } catch (error) {
            console.error('Error creando colección:', error);
            return {
                success: false,
                message: `Error creando colección ${collectionName}: ${error.message}`,
                error: error.message
            };
        }
    }

    /**
     * Crear índice
     */
    async createIndex(collectionName, indexSpec, options = {}) {
        try {
            const collection = this.mongoClient.collection(collectionName);
            await collection.createIndex(indexSpec, options);
            
            return {
                success: true,
                message: `Índice creado exitosamente en ${collectionName}`
            };
        } catch (error) {
            console.error('Error creando índice:', error);
            return {
                success: false,
                message: `Error creando índice en ${collectionName}: ${error.message}`,
                error: error.message
            };
        }
    }

    /**
     * Insertar datos
     */
    async insertData(collectionName, data) {
        try {
            const collection = this.mongoClient.collection(collectionName);
            
            // Agregar timestamps si no existen
            if (!data.created_at) {
                data.created_at = new Date();
            }
            if (!data.updated_at) {
                data.updated_at = new Date();
            }
            
            const result = await collection.insertOne(data);
            
            return {
                success: true,
                message: `Datos insertados en ${collectionName} exitosamente`,
                insertedId: result.insertedId
            };
        } catch (error) {
            console.error('Error insertando datos:', error);
            return {
                success: false,
                message: `Error insertando datos en ${collectionName}: ${error.message}`,
                error: error.message
            };
        }
    }

    /**
     * Insertar múltiples documentos
     */
    async insertMany(collectionName, documents) {
        try {
            const collection = this.mongoClient.collection(collectionName);
            
            // Agregar timestamps a todos los documentos
            const documentsWithTimestamps = documents.map(doc => ({
                ...doc,
                created_at: doc.created_at || new Date(),
                updated_at: doc.updated_at || new Date()
            }));
            
            const result = await collection.insertMany(documentsWithTimestamps);
            
            return {
                success: true,
                message: `${result.insertedCount} documentos insertados en ${collectionName}`,
                insertedIds: result.insertedIds
            };
        } catch (error) {
            console.error('Error insertando múltiples documentos:', error);
            return {
                success: false,
                message: `Error insertando documentos en ${collectionName}: ${error.message}`,
                error: error.message
            };
        }
    }

    /**
     * Verificar si colección existe
     */
    async collectionExists(collectionName) {
        try {
            const db = await this.mongoClient.connect();
            const collections = await db.listCollections({ name: collectionName }).toArray();
            
            return {
                exists: collections.length > 0,
                success: true,
                message: collections.length > 0 ? `Colección ${collectionName} existe` : `Colección ${collectionName} no existe`
            };
        } catch (error) {
            console.error('Error verificando colección:', error);
            return {
                exists: false,
                success: false,
                message: `Error verificando colección ${collectionName}: ${error.message}`,
                error: error.message
            };
        }
    }

    /**
     * Obtener estructura de colección (esquema de documentos)
     */
    async getCollectionStructure(collectionName) {
        try {
            const collection = this.mongoClient.collection(collectionName);
            const sample = await collection.findOne();
            
            if (!sample) {
                return {
                    success: true,
                    structure: {},
                    message: `Colección ${collectionName} está vacía`
                };
            }
            
            // Analizar estructura del documento
            const structure = this.analyzeDocumentStructure(sample);
            
            return {
                success: true,
                structure,
                message: `Estructura de colección ${collectionName} obtenida`
            };
        } catch (error) {
            console.error('Error obteniendo estructura:', error);
            return {
                success: false,
                message: `Error obteniendo estructura de ${collectionName}: ${error.message}`,
                error: error.message
            };
        }
    }

    /**
     * Analizar estructura de documento
     */
    analyzeDocumentStructure(doc, prefix = '') {
        const structure = {};
        
        for (const [key, value] of Object.entries(doc)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            
            if (value === null) {
                structure[fullKey] = 'null';
            } else if (Array.isArray(value)) {
                structure[fullKey] = 'array';
                if (value.length > 0) {
                    structure[`${fullKey}[0]`] = typeof value[0];
                }
            } else if (typeof value === 'object') {
                structure[fullKey] = 'object';
                Object.assign(structure, this.analyzeDocumentStructure(value, fullKey));
            } else {
                structure[fullKey] = typeof value;
            }
        }
        
        return structure;
    }

    /**
     * Configuración predefinida para CRM
     */
    async setupCRM() {
        const results = [];

        // Verificar colecciones existentes antes de crear
        const collectionsToCheck = ['clientes_agro', 'oportunidades_agro', 'contactos', 'crm_analisis_riesgo'];
        
        for (const collectionName of collectionsToCheck) {
            const exists = await this.collectionExists(collectionName);
            if (exists.exists) {
                console.log(`✅ Colección ${collectionName} ya existe, saltando creación`);
                results.push({
                    success: true,
                    message: `Colección ${collectionName} ya existe`,
                    skipped: true
                });
                continue;
            }
        }

        // 1. Crear colección clientes_agro (solo si no existe)
        const clientesExists = await this.collectionExists('clientes_agro');
        if (!clientesExists.exists) {
            results.push(await this.createCollection('clientes_agro'));
        }

        // 2. Crear colección oportunidades_agro (solo si no existe)
        const oportunidadesExists = await this.collectionExists('oportunidades_agro');
        if (!oportunidadesExists.exists) {
            results.push(await this.createCollection('oportunidades_agro'));
        }

        // 3. Crear colección contactos (solo si no existe)
        const contactosExists = await this.collectionExists('contactos');
        if (!contactosExists.exists) {
            results.push(await this.createCollection('contactos'));
        }

        // 4. Crear colección crm_analisis_riesgo (solo si no existe)
        const analisisRiesgoExists = await this.collectionExists('crm_analisis_riesgo');
        if (!analisisRiesgoExists.exists) {
            results.push(await this.createCollection('crm_analisis_riesgo'));
        }

        // 5. Crear índices
        results.push(await this.createIndex('clientes_agro', { nombre: 1 }));
        results.push(await this.createIndex('clientes_agro', { tipo_cliente: 1 }));
        results.push(await this.createIndex('oportunidades_agro', { cliente_id: 1 }));
        results.push(await this.createIndex('oportunidades_agro', { etapa: 1 }));
        results.push(await this.createIndex('contactos', { cliente_id: 1 }));
        results.push(await this.createIndex('crm_analisis_riesgo', { cliente_id: 1 }));
        results.push(await this.createIndex('crm_analisis_riesgo', { fecha_analisis: 1 }));
        results.push(await this.createIndex('crm_analisis_riesgo', { organization_id: 1 }));

        return {
            success: results.every(r => r.success),
            results,
            message: 'Configuración CRM completada'
        };
    }

    /**
     * Insertar datos de ejemplo CRM
     */
    async insertCRMData() {
        const results = [];

        // Datos de clientes
        const clientes = [
            {
                nombre: 'Agroindustrias del Norte S.A.',
                tipo_cliente: 'Empresa',
                sector: 'Agricultura',
                tamanio: 'Grande',
                ubicacion: 'Norte del país',
                contacto_principal: 'Juan Pérez',
                telefono: '+54 11 1234-5678',
                email: 'juan.perez@agronorte.com',
                notas: 'Gran productor de maíz, 2500 hectáreas',
                estado: 'Activo'
            },
            {
                nombre: 'Hortalizas Frescas del Valle',
                tipo_cliente: 'Empresa',
                sector: 'Horticultura',
                tamanio: 'Mediano',
                ubicacion: 'Valle Central',
                contacto_principal: 'María González',
                telefono: '+54 11 2345-6789',
                email: 'maria@hortalizasvalle.com',
                notas: 'Productor de hortalizas, 150 hectáreas',
                estado: 'Activo'
            },
            {
                nombre: 'Cooperativa Campesina Unidos',
                tipo_cliente: 'Cooperativa',
                sector: 'Agricultura',
                tamanio: 'Mediano',
                ubicacion: 'Zona Sur',
                contacto_principal: 'Carlos Rodríguez',
                telefono: '+54 11 3456-7890',
                email: 'carlos@coopunidos.org',
                notas: 'Cooperativa con 25 socios, 500 hectáreas',
                estado: 'Activo'
            }
        ];

        results.push(await this.insertMany('clientes_agro', clientes));

        // Datos de oportunidades
        const oportunidades = [
            {
                cliente_id: 1,
                titulo: 'Sistema de Riego Inteligente',
                descripcion: 'Implementación de sistema de riego automatizado con sensores',
                valor_estimado: 2500000,
                etapa: 'Negociación',
                probabilidad: 75,
                fecha_cierre_esperada: new Date('2024-06-30'),
                fuente: 'Referencia',
                notas: 'Proyecto de alta prioridad para el cliente',
                estado: 'Activa'
            },
            {
                cliente_id: 2,
                titulo: 'Fertilizantes Orgánicos',
                descripcion: 'Suministro de fertilizantes orgánicos certificados',
                valor_estimado: 450000,
                etapa: 'Propuesta Técnica',
                probabilidad: 60,
                fecha_cierre_esperada: new Date('2024-05-15'),
                fuente: 'Feria Agrícola',
                notas: 'Cliente interesado en productos orgánicos',
                estado: 'Activa'
            }
        ];

        results.push(await this.insertMany('oportunidades_agro', oportunidades));

        return {
            success: results.every(r => r.success),
            results,
            message: 'Datos de ejemplo CRM insertados'
        };
    }

    /**
     * Configurar índices para todas las colecciones principales
     */
    async setupIndexes() {
        const results = [];

        // Índices para usuarios
        results.push(await this.createIndex('users', { email: 1 }, { unique: true }));
        results.push(await this.createIndex('users', { organization_id: 1 }));

        // Índices para acciones
        results.push(await this.createIndex('acciones', { organization_id: 1 }));
        results.push(await this.createIndex('acciones', { estado: 1 }));
        results.push(await this.createIndex('acciones', { created_at: -1 }));

        // Índices para hallazgos
        results.push(await this.createIndex('hallazgos', { organization_id: 1 }));
        results.push(await this.createIndex('hallazgos', { estado: 1 }));
        results.push(await this.createIndex('hallazgos', { created_at: -1 }));

        // Índices para auditorias
        results.push(await this.createIndex('auditorias', { organization_id: 1 }));
        results.push(await this.createIndex('auditorias', { fecha: -1 }));

        // Índices para procesos
        results.push(await this.createIndex('procesos', { organization_id: 1 }));
        results.push(await this.createIndex('procesos', { estado: 1 }));

        return {
            success: results.every(r => r.success),
            results,
            message: 'Índices configurados exitosamente'
        };
    }
}

module.exports = DatabaseSetupService;
