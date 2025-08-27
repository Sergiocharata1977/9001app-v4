import mongoose from 'mongoose';
import { Logger } from '../utils/Logger';

interface MongoDBConfig {
  uri: string;
  options: mongoose.ConnectOptions;
  databaseName: string;
}

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private logger: Logger;
  private isConnected: boolean = false;
  private config: MongoDBConfig;

  private constructor() {
    this.logger = new Logger('MongoDB-Agent');
    
    this.config = {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
      databaseName: process.env.MONGODB_DB_NAME || '9001app-v2',
      options: {
        retryWrites: true,
        w: 'majority',
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    };
  }

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      this.logger.info('MongoDB ya está conectado');
      return;
    }

    try {
      this.logger.info('Conectando a MongoDB desde Agent Coordinator...');
      
      await mongoose.connect(this.config.uri, this.config.options);
      
      this.isConnected = true;
      this.logger.info(`✅ MongoDB conectado exitosamente a: ${this.config.databaseName}`);
      
      // Configurar eventos de conexión
      mongoose.connection.on('error', (error) => {
        this.logger.error('Error en conexión MongoDB:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        this.logger.warn('MongoDB desconectado');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        this.logger.info('MongoDB reconectado');
        this.isConnected = true;
      });

    } catch (error) {
      this.logger.error('Error conectando a MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      this.logger.info('MongoDB desconectado');
    } catch (error) {
      this.logger.error('Error desconectando MongoDB:', error);
      throw error;
    }
  }

  getConnection(): mongoose.Connection {
    return mongoose.connection;
  }

  isConnectedToDB(): boolean {
    return this.isConnected;
  }

  getDatabaseName(): string {
    return this.config.databaseName;
  }

  async healthCheck(): Promise<{ healthy: boolean; details: any }> {
    try {
      if (!this.isConnected) {
        return { healthy: false, details: { error: 'No conectado' } };
      }

      const adminDb = mongoose.connection.db.admin();
      const result = await adminDb.ping();
      
      return {
        healthy: true,
        details: {
          ping: result,
          database: this.config.databaseName,
          collections: await this.getCollectionsCount()
        }
      };
    } catch (error) {
      return {
        healthy: false,
        details: { error: error.message }
      };
    }
  }

  private async getCollectionsCount(): Promise<number> {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      return collections.length;
    } catch (error) {
      return 0;
    }
  }
}

export default MongoDBConnection;
