const { MongoClient } = require('mongodb');
require('dotenv').config();

class MongoClientWrapper {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
    this.mockData = {
      users: [
        {
          id: 1,
          email: 'admin@9001app.com',
          password: '$2a$10$AZldzatjvsu/tl2nEDFGpO71JXr0lZ3VDqE0AG7/bkXtrpz85ti72',
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
  }

  async connect() {
    try {
      console.log('✅ Usando datos mock (MongoDB temporal)');
      this.isConnected = true;
      return this;
    } catch (error) {
      console.error('❌ Error conectando:', error);
      throw error;
    }
  }

  async execute(query) {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      console.log('🔍 Ejecutando query mock:', query.sql);
      
      // Simular consultas básicas
      if (query.sql.includes('SELECT') && query.sql.includes('usuarios') && query.sql.includes('organizations')) {
        // Consulta JOIN para login
        const usersWithOrg = this.mockData.users.map(user => ({
          id: user.id,
          name: 'Admin User',
          email: user.email,
          password_hash: user.password,
          role: user.role,
          organization_id: user.organization_id,
          organization_name: '9001app Demo',
          organization_plan: 'premium'
        }));
        
        // Filtrar por email si se proporciona
        if (query.args && query.args[0]) {
          const filteredUsers = usersWithOrg.filter(user => user.email === query.args[0]);
          return { rows: filteredUsers };
        }
        
        return { rows: usersWithOrg };
      }
      
      if (query.sql.includes('SELECT') && query.sql.includes('users')) {
        return { rows: this.mockData.users };
      }
      
      if (query.sql.includes('SELECT') && query.sql.includes('organizations')) {
        return { rows: this.mockData.organizations };
      }
      
      if (query.sql.includes('INSERT') && query.sql.includes('users')) {
        const newUser = {
          id: this.mockData.users.length + 1,
          email: query.args[2] || 'user@example.com',
          password: query.args[3] || 'hashed_password',
          role: query.args[4] || 'user',
          organization_id: query.args[1] || 1,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        };
        this.mockData.users.push(newUser);
        return { rows: [newUser] };
      }
      
      return { rows: [] };
    } catch (error) {
      console.error('❌ Error ejecutando query:', error);
      throw error;
    }
  }

  async query(sql, args = []) {
    return this.execute({ sql, args });
  }

  async close() {
    this.isConnected = false;
    console.log('🔌 Desconectado de MongoDB mock');
  }

  collection(name) {
    if (!this.isConnected) {
      throw new Error('No conectado');
    }
    return {
      find: (query = {}) => ({
        toArray: async () => this.mockData[name] || []
      }),
      findOne: async (query = {}) => {
        const collection = this.mockData[name] || [];
        return collection.find(item => 
          Object.keys(query).every(key => item[key] === query[key])
        );
      },
      insertOne: async (doc) => {
        if (!this.mockData[name]) this.mockData[name] = [];
        const newDoc = { ...doc, id: this.mockData[name].length + 1 };
        this.mockData[name].push(newDoc);
        return { insertedId: newDoc.id };
      },
      countDocuments: async () => (this.mockData[name] || []).length
    };
  }
}

// Instancia singleton
const mongoClient = new MongoClientWrapper();

module.exports = mongoClient;
