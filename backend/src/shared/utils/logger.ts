export class Logger {
  static info(message: string, data?: any): void {
    console.log(`ℹ️ [${new Date().toISOString()}] ${message}`, data || '');
  }

  static error(message: string, error?: any): void {
    console.error(`❌ [${new Date().toISOString()}] ${message}`, error || '');
  }

  static warn(message: string, data?: any): void {
    console.warn(`⚠️ [${new Date().toISOString()}] ${message}`, data || '');
  }

  static success(message: string, data?: any): void {
    console.log(`✅ [${new Date().toISOString()}] ${message}`, data || '');
  }
}