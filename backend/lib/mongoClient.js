const { MongoClient } = require('mongodb');
require('dotenv').config();

class MongoClientWrapper {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
    this.useMockData = false; // Cambiar a false para usar MongoDB real
  }

  async connect() {
    try {
      // Verificar si tenemos configuración de MongoDB
      if (!process.env.MONGODB_URI) {
        console.log('⚠️ MONGODB_URI no configurada, usando datos mock');
        this.useMockData = true;
        this.isConnected = true;
        return this;
      }

      console.log('🔌 Conectando a MongoDB real...');
      console.log('📋 URI:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Ocultar credenciales
      
      this.client = new MongoClient(process.env.MONGODB_URI);
      await this.client.connect();
      
      this.db = this.client.db(process.env.MONGODB_DB_NAME || '9001app-v2');
      this.isConnected = true;
      
      console.log('✅ Conexión exitosa a MongoDB');
      console.log('📊 Base de datos:', this.db.databaseName);
      
      // Verificar si hay datos
      const usersCollection = this.db.collection('users');
      const userCount = await usersCollection.countDocuments();
      console.log('👥 Usuarios en la base de datos:', userCount);
      
      if (userCount === 0) {
        console.log('⚠️ No hay usuarios en la base de datos, creando usuario de prueba...');
        await this.createTestUser();
      }
      
      return this;
    } catch (error) {
      console.error('❌ Error conectando a MongoDB:', error.message);
      console.log('🔄 Cambiando a datos mock...');
      this.useMockData = true;
      this.isConnected = true;
      return this;
    }
  }

  async createTestUser() {
    try {
      const bcrypt = require('bcryptjs');
      const testPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      
      const testUser = {
        name: 'Admin Test',
        email: 'admin@9001app.com',
        password_hash: hashedPassword,
        role: 'admin',
        organization_id: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const usersCollection = this.db.collection('users');
      const result = await usersCollection.insertOne(testUser);
      
      console.log('✅ Usuario de prueba creado:', result.insertedId);
      console.log('🔑 Credenciales de prueba:');
      console.log('   Email: admin@9001app.com');
      console.log('   Password: admin123');
      
    } catch (error) {
      console.error('❌ Error creando usuario de prueba:', error);
    }
  }

  async execute(query) {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      console.log('🔍 Ejecutando query:', query.sql);
      console.log('📋 Args:', query.args);
      
      if (this.useMockData) {
        return this.executeMock(query);
      } else {
        return this.executeReal(query);
      }
    } catch (error) {
      console.error('❌ Error ejecutando query:', error);
      throw error;
    }
  }

  async executeMock(query) {
    console.log('🎭 Usando datos mock');
    
    // Datos mock
    const mockData = {
      users: [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@9001app.com',
          password_hash: '$2a$10$AZldzatjvsu/tl2nEDFGpO71JXr0lZ3VDqE0AG7/bkXtrpz85ti72',
          role: 'admin',
          organization_id: 1,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      organizations: [
        {
          id: 1,
          name: '9001app Demo',
          description: 'Organización de demostración',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
    };

    // Simular consultas básicas
    if (query.sql.includes('SELECT') && query.sql.includes('usuarios') && query.sql.includes('organizations')) {
      const usersWithOrg = mockData.users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        password_hash: user.password_hash,
        role: user.role,
        organization_id: user.organization_id,
        organization_name: '9001app Demo',
        organization_plan: 'premium'
      }));
      
      if (query.args && query.args[0]) {
        const filteredUsers = usersWithOrg.filter(user => user.email === query.args[0]);
        console.log('📊 Resultado mock:', filteredUsers);
        return { rows: filteredUsers };
      }
      
      return { rows: usersWithOrg };
    }
    
    return { rows: [] };
  }

  async executeReal(query) {
    console.log('🗄️ Usando MongoDB real');
    
    // Convertir SQL a operaciones de MongoDB
    if (query.sql.includes('SELECT') && query.sql.includes('usuarios') && query.sql.includes('organizations')) {
      const usersCollection = this.db.collection('users');
      const organizationsCollection = this.db.collection('organizations');
      
      let userQuery = { is_active: true };
      if (query.args && query.args[0]) {
        userQuery.email = query.args[0];
      }
      
      const users = await usersCollection.find(userQuery).toArray();
      console.log('📊 Usuarios encontrados:', users.length);
      
      // Agregar información de organización
      const usersWithOrg = await Promise.all(users.map(async (user) => {
        let org = null;
        if (user.organization_id) {
          org = await organizationsCollection.findOne({ id: user.organization_id });
        }
        
        return {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          password_hash: user.password_hash,
          role: user.role,
          organization_id: user.organization_id,
          organization_name: org ? org.name : 'Sin organización',
          organization_plan: org ? org.plan : 'basic'
        };
      }));
      
      console.log('📊 Resultado real:', usersWithOrg);
      return { rows: usersWithOrg };
    }
    
    // Consulta por _id (para authMiddleware)
    if (query.sql.includes('SELECT') && query.sql.includes('usuarios') && query.sql.includes('_id')) {
      const usersCollection = this.db.collection('users');
      
      if (query.args && query.args[0]) {
        const { ObjectId } = require('mongodb');
        let userId = query.args[0];
        
        console.log('🔍 Buscando usuario por ID:', userId);
        
        // Si es un string, convertirlo a ObjectId
        if (typeof userId === 'string') {
          try {
            userId = new ObjectId(userId);
            console.log('✅ ID convertido a ObjectId:', userId);
          } catch (error) {
            console.log('❌ ID inválido:', userId);
            return { rows: [] };
          }
        }
        
        const user = await usersCollection.findOne({ _id: userId, is_active: true });
        console.log('📊 Usuario encontrado por _id:', user ? 'Sí' : 'No');
        
        if (user) {
          console.log('✅ Usuario encontrado:', user.name, user.email);
          return { 
            rows: [{
              id: user._id.toString(),
              organization_id: user.organization_id,
              name: user.name,
              email: user.email,
              role: user.role,
              is_active: user.is_active
            }]
          };
        } else {
          console.log('❌ Usuario no encontrado en la base de datos');
        }
      }
      
      return { rows: [] };
    }
    
    return { rows: [] };
  }

  async query(sql, args = []) {
    return this.execute({ sql, args });
  }

  async close() {
    if (this.client) {
      await this.client.close();
    }
    this.isConnected = false;
    console.log('🔌 Desconectado de MongoDB');
  }

  collection(name) {
    if (!this.isConnected) {
      throw new Error('No conectado');
    }
    
    if (this.useMockData) {
      return this.getMockCollection(name);
    } else {
      return this.db.collection(name);
    }
  }

  getMockCollection(name) {
    const mockData = {
      users: [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@9001app.com',
          password_hash: '$2a$10$AZldzatjvsu/tl2nEDFGpO71JXr0lZ3VDqE0AG7/bkXtrpz85ti72',
          role: 'admin',
          organization_id: 1,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      organizations: [
        {
          id: 1,
          name: '9001app Demo',
          description: 'Organización de demostración',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
    };

    return {
      find: (query = {}) => ({
        toArray: async () => mockData[name] || []
      }),
      findOne: async (query = {}) => {
        const collection = mockData[name] || [];
        return collection.find(item => 
          Object.keys(query).every(key => item[key] === query[key])
        );
      },
      insertOne: async (doc) => {
        if (!mockData[name]) mockData[name] = [];
        const newDoc = { ...doc, id: mockData[name].length + 1 };
        mockData[name].push(newDoc);
        return { insertedId: newDoc.id };
      },
      countDocuments: async () => (mockData[name] || []).length
    };
  }
}

// Instancia singleton
const mongoClient = new MongoClientWrapper();

module.exports = mongoClient;
