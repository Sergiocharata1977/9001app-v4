import { EventEmitter } from 'events';
import { AgentMessage, MessagePriority, MessageType } from '../types/agent.types';
import { Logger } from '../utils/Logger';

export class MessageBus extends EventEmitter {
  private messages: AgentMessage[] = [];
  private subscribers: Map<string, Set<string>> = new Map();
  private logger: Logger;
  private isRunning: boolean = false;
  private messageQueue: AgentMessage[] = [];
  private processingQueue: boolean = false;

  constructor() {
    super();
    this.logger = new Logger('MessageBus');
  }

  /**
   * Enviar mensaje a un agente específico
   */
  sendMessage(message: Omit<AgentMessage, 'id' | 'timestamp'>): string {
    const fullMessage: AgentMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    this.messageQueue.push(fullMessage);
    this.messages.push(fullMessage);
    
    this.logger.debug(`Mensaje enviado: ${fullMessage.type} de ${fullMessage.from} a ${fullMessage.to}`, {
      messageId: fullMessage.id,
      priority: fullMessage.priority
    });

    // Procesar cola si no está siendo procesada
    if (!this.processingQueue) {
      this.processMessageQueue();
    }

    return fullMessage.id;
  }

  /**
   * Enviar mensaje a múltiples agentes
   */
  broadcastMessage(message: Omit<AgentMessage, 'id' | 'timestamp' | 'to'>): string[] {
    const messageIds: string[] = [];
    
    // Enviar a todos los agentes registrados
    for (const [agentId] of this.subscribers) {
      const broadcastMessage: AgentMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        to: agentId
      };
      
      messageIds.push(this.sendMessage(broadcastMessage));
    }

    this.logger.info(`Mensaje broadcast enviado: ${message.type} a ${messageIds.length} agentes`);
    return messageIds;
  }

  /**
   * Suscribir un agente para recibir mensajes
   */
  subscribe(agentId: string, messageTypes: MessageType[] = []): void {
    if (!this.subscribers.has(agentId)) {
      this.subscribers.set(agentId, new Set());
    }

    const subscriber = this.subscribers.get(agentId)!;
    messageTypes.forEach(type => subscriber.add(type));

    this.logger.info(`Agente ${agentId} suscrito para mensajes: ${messageTypes.join(', ')}`);
  }

  /**
   * Desuscribir un agente
   */
  unsubscribe(agentId: string, messageTypes: MessageType[] = []): void {
    if (!this.subscribers.has(agentId)) {
      return;
    }

    const subscriber = this.subscribers.get(agentId)!;
    
    if (messageTypes.length === 0) {
      // Desuscribir de todos los tipos
      this.subscribers.delete(agentId);
      this.logger.info(`Agente ${agentId} desuscrito de todos los mensajes`);
    } else {
      // Desuscribir de tipos específicos
      messageTypes.forEach(type => subscriber.delete(type));
      this.logger.info(`Agente ${agentId} desuscrito de: ${messageTypes.join(', ')}`);
    }
  }

  /**
   * Obtener mensajes para un agente específico
   */
  getMessagesForAgent(agentId: string, messageTypes: MessageType[] = []): AgentMessage[] {
    return this.messages.filter(message => {
      if (message.to !== agentId) return false;
      
      if (messageTypes.length > 0) {
        return messageTypes.includes(message.type);
      }
      
      return true;
    });
  }

  /**
   * Obtener mensajes por prioridad
   */
  getMessagesByPriority(priority: MessagePriority): AgentMessage[] {
    return this.messages.filter(message => message.priority === priority);
  }

  /**
   * Obtener mensajes por tipo
   */
  getMessagesByType(type: MessageType): AgentMessage[] {
    return this.messages.filter(message => message.type === type);
  }

  /**
   * Procesar cola de mensajes
   */
  private async processMessageQueue(): Promise<void> {
    if (this.processingQueue || this.messageQueue.length === 0) {
      return;
    }

    this.processingQueue = true;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      
      try {
        await this.deliverMessage(message);
      } catch (error) {
        this.logger.error(`Error entregando mensaje ${message.id}`, error);
        
        // Reintentar mensajes urgentes
        if (message.priority === 'urgent' && this.messageQueue.length < 100) {
          this.messageQueue.unshift(message);
        }
      }
    }

    this.processingQueue = false;
  }

  /**
   * Entregar mensaje a su destinatario
   */
  private async deliverMessage(message: AgentMessage): Promise<void> {
    // Verificar si el destinatario está suscrito
    const subscriber = this.subscribers.get(message.to);
    if (!subscriber) {
      this.logger.warn(`Destinatario ${message.to} no está suscrito`);
      return;
    }

    // Verificar si está suscrito al tipo de mensaje
    if (subscriber.size > 0 && !subscriber.has(message.type)) {
      this.logger.debug(`Destinatario ${message.to} no está suscrito al tipo ${message.type}`);
      return;
    }

    // Emitir evento para que el agente lo procese
    this.emit(message.type, message);
    this.emit('message_delivered', message);

    this.logger.debug(`Mensaje ${message.id} entregado a ${message.to}`);
  }

  /**
   * Obtener estadísticas de mensajes
   */
  getMessageStats(): {
    totalMessages: number;
    pendingMessages: number;
    deliveredMessages: number;
    subscribers: number;
    messageTypes: Record<MessageType, number>;
  } {
    const messageTypes: Record<MessageType, number> = {} as any;
    
    this.messages.forEach(message => {
      messageTypes[message.type] = (messageTypes[message.type] || 0) + 1;
    });

    return {
      totalMessages: this.messages.length,
      pendingMessages: this.messageQueue.length,
      deliveredMessages: this.messages.length - this.messageQueue.length,
      subscribers: this.subscribers.size,
      messageTypes
    };
  }

  /**
   * Limpiar mensajes antiguos
   */
  cleanupOldMessages(maxAge: number = 24 * 60 * 60 * 1000): void { // 24 horas por defecto
    const cutoffTime = Date.now() - maxAge;
    const initialCount = this.messages.length;
    
    this.messages = this.messages.filter(message => 
      new Date(message.timestamp).getTime() > cutoffTime
    );
    
    const removedCount = initialCount - this.messages.length;
    if (removedCount > 0) {
      this.logger.info(`Limpiados ${removedCount} mensajes antiguos`);
    }
  }

  /**
   * Obtener suscriptores activos
   */
  getActiveSubscribers(): Map<string, Set<string>> {
    return new Map(this.subscribers);
  }

  /**
   * Verificar si un agente está suscrito
   */
  isSubscribed(agentId: string, messageType?: MessageType): boolean {
    const subscriber = this.subscribers.get(agentId);
    if (!subscriber) return false;
    
    if (messageType) {
      return subscriber.has(messageType);
    }
    
    return true;
  }

  /**
   * Iniciar el bus de mensajes
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('MessageBus ya está ejecutándose');
      return;
    }

    this.isRunning = true;
    this.logger.info('Iniciando MessageBus');
    
    // Iniciar procesamiento de cola
    this.processMessageQueue();
    
    this.logger.info('MessageBus iniciado exitosamente');
  }

  /**
   * Detener el bus de mensajes
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('MessageBus no está ejecutándose');
      return;
    }

    this.isRunning = false;
    this.logger.info('Deteniendo MessageBus');
    
    // Esperar a que se procese la cola
    while (this.processingQueue || this.messageQueue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.logger.info('MessageBus detenido');
  }

  /**
   * Obtener estado del bus de mensajes
   */
  getStatus(): {
    isRunning: boolean;
    queueLength: number;
    processingQueue: boolean;
    totalSubscribers: number;
  } {
    return {
      isRunning: this.isRunning,
      queueLength: this.messageQueue.length,
      processingQueue: this.processingQueue,
      totalSubscribers: this.subscribers.size
    };
  }
}
