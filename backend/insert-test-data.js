const { MongoClient } = require('mongodb');

// Configuración con la contraseña real de MongoDB Atlas
const MONGODB_PASSWORD = 'jFIIJY5D4PoWicU8';
const MONGODB_URI = `mongodb+srv://9001app-v2:${MONGODB_PASSWORD}@9001app-v2.xqydf2m.mongodb.net/?retryWrites=true&w=majority&appName=9001app-v2`;
const DB_NAME = '9001app-v2';

async function insertTestData() {
  console.log('🚀 INSERTANDO DATOS DE PRUEBA EN MONGODB');
  
  let mongoClient;
  
  try {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    console.log('✅ Conectado a MongoDB');

    const db = mongoClient.db(DB_NAME);

    // 1. INSERTAR ORGANIZACIONES DE PRUEBA
    console.log('\n🏢 Insertando organizaciones...');
    const organizationsCollection = db.collection('organizations');
    const organizations = [
      {
        id: 1,
        name: 'Agroindustria del Norte S.A.',
        description: 'Empresa líder en producción agrícola del norte argentino',
        plan: 'enterprise',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Cooperativa Agropecuaria Sur',
        description: 'Cooperativa de pequeños productores del sur',
        plan: 'profesional',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'Estancia Los Pinos',
        description: 'Estancia familiar dedicada a la ganadería',
        plan: 'basic',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await organizationsCollection.deleteMany({});
    const orgResult = await organizationsCollection.insertMany(organizations);
    console.log(`✅ ${orgResult.insertedCount} organizaciones insertadas`);

    // 2. INSERTAR USUARIOS DE PRUEBA
    console.log('\n👥 Insertando usuarios...');
    const usersCollection = db.collection('users');
    const users = [
      {
        name: 'Juan Carlos López',
        email: 'juan.lopez@agronorte.com',
        password_hash: '$2a$10$dWTnqWHoqSbTDbOk3sBSUeeO1Z0f0ClKpOYVtVgh3iDyjUUyNO0QG',
        role: 'admin',
        organization_id: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'María González',
        email: 'maria.gonzalez@coopagro.com',
        password_hash: '$2a$10$dWTnqWHoqSbTDbOk3sBSUeeO1Z0f0ClKpOYVtVgh3iDyjUUyNO0QG',
        role: 'manager',
        organization_id: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@estancialospinos.com',
        password_hash: '$2a$10$dWTnqWHoqSbTDbOk3sBSUeeO1Z0f0ClKpOYVtVgh3iDyjUUyNO0QG',
        role: 'user',
        organization_id: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Ana Martínez',
        email: 'ana.martinez@agronorte.com',
        password_hash: '$2a$10$dWTnqWHoqSbTDbOk3sBSUeeO1Z0f0ClKpOYVtVgh3iDyjUUyNO0QG',
        role: 'auditor',
        organization_id: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Roberto Silva',
        email: 'roberto.silva@coopagro.com',
        password_hash: '$2a$10$dWTnqWHoqSbTDbOk3sBSUeeO1Z0f0ClKpOYVtVgh3iDyjUUyNO0QG',
        role: 'user',
        organization_id: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await usersCollection.deleteMany({});
    const usersResult = await usersCollection.insertMany(users);
    console.log(`✅ ${usersResult.insertedCount} usuarios insertados`);

    // 3. INSERTAR PERSONAL DE PRUEBA
    console.log('\n👨‍💼 Insertando personal...');
    const personalCollection = db.collection('personal');
    const personal = [
      {
        id: 'per_001',
        organization_id: 1,
        nombres: 'Juan Carlos',
        apellidos: 'López',
        email: 'juan.lopez@agronorte.com',
        telefono: '+54 9 11 1234-5678',
        documento_identidad: 'DNI 12345678',
        fecha_nacimiento: '1985-03-15',
        nacionalidad: 'Argentina',
        direccion: 'Av. San Martín 1234, San Nicolás',
        telefono_emergencia: '+54 9 11 8765-4321',
        fecha_contratacion: '2020-01-15',
        numero_legajo: 'EMP001',
        estado: 'Activo',
        tipo_personal: 'gerencial',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'per_002',
        organization_id: 1,
        nombres: 'Ana María',
        apellidos: 'Martínez',
        email: 'ana.martinez@agronorte.com',
        telefono: '+54 9 11 2345-6789',
        documento_identidad: 'DNI 23456789',
        fecha_nacimiento: '1990-07-22',
        nacionalidad: 'Argentina',
        direccion: 'Belgrano 567, San Nicolás',
        telefono_emergencia: '+54 9 11 7654-3210',
        fecha_contratacion: '2021-03-01',
        numero_legajo: 'EMP002',
        estado: 'Activo',
        tipo_personal: 'tecnico',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'per_003',
        organization_id: 2,
        nombres: 'María Elena',
        apellidos: 'González',
        email: 'maria.gonzalez@coopagro.com',
        telefono: '+54 9 11 3456-7890',
        documento_identidad: 'DNI 34567890',
        fecha_nacimiento: '1988-11-10',
        nacionalidad: 'Argentina',
        direccion: 'Rivadavia 890, Bahía Blanca',
        telefono_emergencia: '+54 9 11 6543-2109',
        fecha_contratacion: '2019-06-15',
        numero_legajo: 'EMP003',
        estado: 'Activo',
        tipo_personal: 'administrativo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await personalCollection.deleteMany({});
    const personalResult = await personalCollection.insertMany(personal);
    console.log(`✅ ${personalResult.insertedCount} empleados insertados`);

    // 4. INSERTAR DEPARTAMENTOS DE PRUEBA
    console.log('\n🏢 Insertando departamentos...');
    const departamentosCollection = db.collection('departamentos');
    const departamentos = [
      {
        id: 'dept_001',
        nombre: 'Recursos Humanos',
        descripcion: 'Gestión del capital humano de la organización',
        responsable_id: 'per_001',
        organization_id: 1,
        objetivos: 'Gestionar el desarrollo profesional y bienestar del personal',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'dept_002',
        nombre: 'Producción Agrícola',
        descripcion: 'Gestión de cultivos y producción agrícola',
        responsable_id: 'per_002',
        organization_id: 1,
        objetivos: 'Maximizar la producción agrícola con calidad y eficiencia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'dept_003',
        nombre: 'Administración',
        descripcion: 'Gestión administrativa y financiera',
        responsable_id: 'per_003',
        organization_id: 2,
        objetivos: 'Gestionar eficientemente los recursos financieros',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await departamentosCollection.deleteMany({});
    const deptResult = await departamentosCollection.insertMany(departamentos);
    console.log(`✅ ${deptResult.insertedCount} departamentos insertados`);

    // 5. INSERTAR CLIENTES CRM AGRO
    console.log('\n🌾 Insertando clientes CRM Agro...');
    const clientesCollection = db.collection('crm_clientes_agro');
    const clientes = [
      {
        id: 'cli_001',
        organization_id: 1,
        nombre_empresa: 'Estancia La Esperanza',
        tipo_cliente: 'productor',
        categoria: 'premium',
        supervisor_comercial_id: 'per_001',
        tecnico_asignado_id: 'per_002',
        vendedor_asignado_id: 'per_001',
        contacto_id: 'cont_001',
        direccion: 'Ruta 9 Km 180, San Nicolás',
        telefono: '+54 336 555-1234',
        email: 'info@estancialaesperanza.com',
        sitio_web: 'www.estancialaesperanza.com',
        fecha_registro: '2024-01-15',
        estado: 'activo',
        observaciones: 'Cliente estratégico con 5000 hectáreas',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'cli_002',
        organization_id: 1,
        nombre_empresa: 'Agropecuaria Los Alamos',
        tipo_cliente: 'productor',
        categoria: 'standard',
        supervisor_comercial_id: 'per_001',
        tecnico_asignado_id: 'per_002',
        vendedor_asignado_id: 'per_001',
        contacto_id: 'cont_002',
        direccion: 'Ruta 188 Km 45, Pergamino',
        telefono: '+54 2477 456-789',
        email: 'ventas@agropecuarialosalamos.com',
        sitio_web: 'www.agropecuarialosalamos.com',
        fecha_registro: '2024-02-20',
        estado: 'activo',
        observaciones: 'Cliente nuevo con potencial de crecimiento',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await clientesCollection.deleteMany({});
    const clientesResult = await clientesCollection.insertMany(clientes);
    console.log(`✅ ${clientesResult.insertedCount} clientes insertados`);

    // 6. INSERTAR CONTACTOS CRM
    console.log('\n📞 Insertando contactos...');
    const contactosCollection = db.collection('crm_contactos');
    const contactos = [
      {
        id: 'cont_001',
        organization_id: 1,
        nombre: 'Roberto',
        apellido: 'Fernández',
        cargo: 'Gerente General',
        telefono: '+54 9 11 1111-1111',
        email: 'roberto.fernandez@estancialaesperanza.com',
        tipo_contacto: 'principal',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'cont_002',
        organization_id: 1,
        nombre: 'Silvia',
        apellido: 'Mendoza',
        cargo: 'Directora Comercial',
        telefono: '+54 9 11 2222-2222',
        email: 'silvia.mendoza@agropecuarialosalamos.com',
        tipo_contacto: 'principal',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await contactosCollection.deleteMany({});
    const contactosResult = await contactosCollection.insertMany(contactos);
    console.log(`✅ ${contactosResult.insertedCount} contactos insertados`);

    // 7. INSERTAR PROCESOS SGC
    console.log('\n📋 Insertando procesos SGC...');
    const procesosCollection = db.collection('procesos');
    const procesos = [
      {
        id: 'proc_001',
        organization_id: 1,
        nombre: 'Gestión de Recursos Humanos',
        descripcion: 'Proceso de gestión del capital humano',
        responsable: 'Juan Carlos López',
        entrada: 'Necesidades de personal',
        salida: 'Personal capacitado y motivado',
        recursos: 'Personal, presupuesto, instalaciones',
        estado: 'activo',
        observaciones: 'Proceso crítico para el éxito organizacional',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'proc_002',
        organization_id: 1,
        nombre: 'Producción Agrícola',
        descripcion: 'Proceso de producción de cultivos',
        responsable: 'Ana María Martínez',
        entrada: 'Semillas, fertilizantes, agua',
        salida: 'Cultivos cosechados',
        recursos: 'Maquinaria, personal, tierra',
        estado: 'activo',
        observaciones: 'Proceso principal del negocio',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'proc_003',
        organization_id: 2,
        nombre: 'Gestión Financiera',
        descripcion: 'Proceso de gestión de recursos financieros',
        responsable: 'María Elena González',
        entrada: 'Ingresos y gastos',
        salida: 'Estados financieros',
        recursos: 'Sistema contable, personal',
        estado: 'activo',
        observaciones: 'Proceso de control financiero',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await procesosCollection.deleteMany({});
    const procesosResult = await procesosCollection.insertMany(procesos);
    console.log(`✅ ${procesosResult.insertedCount} procesos insertados`);

    // 8. INSERTAR INDICADORES
    console.log('\n📊 Insertando indicadores...');
    const indicadoresCollection = db.collection('indicadores');
    const indicadores = [
      {
        id: 'ind_001',
        organization_id: 1,
        proceso_id: 'proc_001',
        nombre: 'Satisfacción del Personal',
        descripcion: 'Nivel de satisfacción del personal',
        tipo_indicador: 'satisfaccion',
        unidad_medida: 'porcentaje',
        meta: 85,
        estado: 'activo',
        observaciones: 'Medido trimestralmente',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ind_002',
        organization_id: 1,
        proceso_id: 'proc_002',
        nombre: 'Rendimiento por Hectárea',
        descripcion: 'Producción por hectárea cultivada',
        tipo_indicador: 'productividad',
        unidad_medida: 'toneladas/hectárea',
        meta: 4.5,
        estado: 'activo',
        observaciones: 'Medido por campaña',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ind_003',
        organization_id: 2,
        proceso_id: 'proc_003',
        nombre: 'Rentabilidad',
        descripcion: 'Rentabilidad de la organización',
        tipo_indicador: 'financiero',
        unidad_medida: 'porcentaje',
        meta: 15,
        estado: 'activo',
        observaciones: 'Medido mensualmente',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await indicadoresCollection.deleteMany({});
    const indicadoresResult = await indicadoresCollection.insertMany(indicadores);
    console.log(`✅ ${indicadoresResult.insertedCount} indicadores insertados`);

    // 9. INSERTAR MEDICIONES
    console.log('\n📈 Insertando mediciones...');
    const medicionesCollection = db.collection('mediciones');
    const mediciones = [
      {
        id: 'med_001',
        organization_id: 1,
        indicador_id: 'ind_001',
        fecha_medicion: '2024-10-01',
        valor: 87.5,
        observaciones: 'Excelente nivel de satisfacción',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'med_002',
        organization_id: 1,
        indicador_id: 'ind_002',
        fecha_medicion: '2024-09-30',
        valor: 4.8,
        observaciones: 'Superó la meta establecida',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'med_003',
        organization_id: 2,
        indicador_id: 'ind_003',
        fecha_medicion: '2024-10-01',
        valor: 16.2,
        observaciones: 'Rentabilidad por encima de la meta',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await medicionesCollection.deleteMany({});
    const medicionesResult = await medicionesCollection.insertMany(mediciones);
    console.log(`✅ ${medicionesResult.insertedCount} mediciones insertadas`);

    // 10. INSERTAR DOCUMENTOS
    console.log('\n📄 Insertando documentos...');
    const documentosCollection = db.collection('documentos');
    const documentos = [
      {
        id: 1,
        organization_id: 1,
        titulo: 'Manual de Calidad v1.0',
        descripcion: 'Manual del sistema de gestión de calidad',
        tipo_documento: 'manual',
        url_archivo: '/documentos/manual-calidad-v1.pdf',
        version: '1.0',
        estado: 'activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        organization_id: 1,
        titulo: 'Procedimiento de Contratación',
        descripcion: 'Procedimiento para contratación de personal',
        tipo_documento: 'procedimiento',
        url_archivo: '/documentos/proc-contratacion.pdf',
        version: '2.1',
        estado: 'activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        organization_id: 2,
        titulo: 'Política de Calidad',
        descripcion: 'Política de calidad de la organización',
        tipo_documento: 'politica',
        url_archivo: '/documentos/politica-calidad.pdf',
        version: '1.0',
        estado: 'activo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await documentosCollection.deleteMany({});
    const documentosResult = await documentosCollection.insertMany(documentos);
    console.log(`✅ ${documentosResult.insertedCount} documentos insertados`);

    // 11. INSERTAR FEATURES DE ORGANIZACIÓN
    console.log('\n⚙️ Insertando features de organización...');
    const featuresCollection = db.collection('organization_features');
    const features = [
      {
        id: 'feat_001',
        organization_id: 1,
        feature_name: 'crm_agro',
        is_enabled: 1,
        configuracion: '{"max_clientes": 500, "max_contactos": 1000}',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'feat_002',
        organization_id: 1,
        feature_name: 'sgc',
        is_enabled: 1,
        configuracion: '{"max_procesos": 500, "max_indicadores": 750}',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'feat_003',
        organization_id: 1,
        feature_name: 'rrhh',
        is_enabled: 1,
        configuracion: '{"max_empleados": 200, "max_departamentos": 50}',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'feat_004',
        organization_id: 2,
        feature_name: 'crm_agro',
        is_enabled: 1,
        configuracion: '{"max_clientes": 125, "max_contactos": 250}',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await featuresCollection.deleteMany({});
    const featuresResult = await featuresCollection.insertMany(features);
    console.log(`✅ ${featuresResult.insertedCount} features insertadas`);

    // 12. INSERTAR SUSCRIPCIONES
    console.log('\n💳 Insertando suscripciones...');
    const suscripcionesCollection = db.collection('suscripciones');
    const suscripciones = [
      {
        id: 1,
        organization_id: 1,
        plan_id: 3, // Enterprise
        estado: 'activa',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        fecha_renovacion: '2024-12-01',
        precio_pagado: 1999.99,
        moneda: 'USD',
        metodo_pago: 'tarjeta_credito',
        periodo: 'anual',
        cancelada_por_usuario: false,
        motivo_cancelacion: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        organization_id: 2,
        plan_id: 2, // Profesional
        estado: 'activa',
        fecha_inicio: '2024-03-01',
        fecha_fin: '2025-02-28',
        fecha_renovacion: '2025-02-01',
        precio_pagado: 799.99,
        moneda: 'USD',
        metodo_pago: 'transferencia',
        periodo: 'anual',
        cancelada_por_usuario: false,
        motivo_cancelacion: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await suscripcionesCollection.deleteMany({});
    const suscripcionesResult = await suscripcionesCollection.insertMany(suscripciones);
    console.log(`✅ ${suscripcionesResult.insertedCount} suscripciones insertadas`);

    // VERIFICACIÓN FINAL
    console.log('\n🔍 VERIFICACIÓN FINAL:');
    const collections = [
      'organizations', 'users', 'personal', 'departamentos', 
      'crm_clientes_agro', 'crm_contactos', 'procesos', 'indicadores',
      'mediciones', 'documentos', 'organization_features', 'suscripciones'
    ];

    for (const collectionName of collections) {
      const count = await db.collection(collectionName).countDocuments();
      console.log(`   - ${collectionName}: ${count} documentos`);
    }

    console.log('\n🎉 DATOS DE PRUEBA INSERTADOS EXITOSAMENTE');
    console.log('===========================================');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (mongoClient) {
      await mongoClient.close();
      console.log('🔌 Conexión cerrada');
    }
  }
}

if (require.main === module) {
  insertTestData()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { insertTestData };
