import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AntiSpamService {
  // Almacena los últimos registros por IP (en memoria)
  private recentSubmissions = new Map<string, Array<{ content: string; timestamp: number }>>();

  // Tiempo en milisegundos para considerar contenido como duplicado
  private readonly DUPLICATE_WINDOW = 60000; // 1 minuto
  
  // Máximo de registros idénticos permitidos en el window
  private readonly MAX_DUPLICATES = 2;

  /**
   * Valida si el contenido es spam
   * @param content Contenido del registro
   * @param clientIp IP del cliente
   * @returns true si pasa la validación
   * @throws BadRequestException si detecta spam
   */
  validateContent(content: string, clientIp: string): boolean {
    const now = Date.now();
    
    // Obtener submissions recientes de esta IP
    let ipHistory = this.recentSubmissions.get(clientIp) || [];
    
    // Limpiar submissions antiguas (fuera del window)
    ipHistory = ipHistory.filter(entry => now - entry.timestamp < this.DUPLICATE_WINDOW);
    
    // Detectar contenido repetitivo exacto
    const duplicateCount = ipHistory.filter(entry => entry.content === content).length;
    
    if (duplicateCount >= this.MAX_DUPLICATES) {
      throw new BadRequestException(
        `Contenido duplicado detectado. Has enviado este mismo texto ${duplicateCount} veces en el último minuto.`
      );
    }
    
    // Detectar patrones sospechosos en el contenido
    const suspiciousPatterns = [
      /ATACA(?:NDO|DO|R)/i,
      /PETICI[ÓO]N\s*#\d+/i,
      /SIENDO\s+ATACAD[OA]/i,
      /D+O+S+/i,
      /SPAM/i,
      /(.)\1{10,}/,  // Caracteres repetidos 10+ veces
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        throw new BadRequestException(
          'Contenido sospechoso detectado. Tu registro ha sido bloqueado por seguridad.'
        );
      }
    }
    
    // Detectar si el contenido es demasiado similar a envíos recientes (85% similar)
    for (const entry of ipHistory) {
      if (this.calculateSimilarity(content, entry.content) > 0.85) {
        throw new BadRequestException(
          'El contenido es muy similar a un registro reciente. Por favor varía tu entrada.'
        );
      }
    }
    
    // Agregar este registro al historial
    ipHistory.push({ content, timestamp: now });
    this.recentSubmissions.set(clientIp, ipHistory);
    
    // Limpiar el Map periódicamente para no consumir demasiada memoria
    this.cleanupOldEntries();
    
    return true;
  }

  /**
   * Calcula la similitud entre dos strings (algoritmo simple de Jaccard)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = new Set(str1.toLowerCase().split(/\s+/));
    const words2 = new Set(str2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  /**
   * Limpia entradas antiguas del Map para liberar memoria
   */
  private cleanupOldEntries(): void {
    const now = Date.now();
    
    for (const [ip, history] of this.recentSubmissions.entries()) {
      const recentEntries = history.filter(entry => now - entry.timestamp < this.DUPLICATE_WINDOW);
      
      if (recentEntries.length === 0) {
        this.recentSubmissions.delete(ip);
      } else {
        this.recentSubmissions.set(ip, recentEntries);
      }
    }
  }

  /**
   * Limpia el historial de una IP específica (útil para testing)
   */
  clearIpHistory(clientIp: string): void {
    this.recentSubmissions.delete(clientIp);
  }

  /**
   * Obtiene estadísticas del sistema anti-spam
   */
  getStats(): { totalIPs: number; totalSubmissions: number } {
    let totalSubmissions = 0;
    
    for (const history of this.recentSubmissions.values()) {
      totalSubmissions += history.length;
    }
    
    return {
      totalIPs: this.recentSubmissions.size,
      totalSubmissions,
    };
  }
}
