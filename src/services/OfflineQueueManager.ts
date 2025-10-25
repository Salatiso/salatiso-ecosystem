/**
 * OfflineQueueManager - IndexedDB-based Offline Operation Queue
 * 
 * Manages offline operations with automatic retry, conflict resolution,
 * and seamless sync when connection is restored.
 */

export enum OperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum QueueStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CONFLICT = 'CONFLICT',
}

export interface QueueOperation {
  id: string;
  type: OperationType;
  collection: string;
  documentId: string;
  data: any;
  status: QueueStatus;
  attempts: number;
  maxAttempts: number;
  createdAt: number;
  updatedAt: number;
  error?: string;
  version: number;
}

export interface ConflictResolution {
  operationId: string;
  strategy: 'local' | 'remote' | 'merge' | 'manual';
  resolvedData?: any;
}

export interface QueueStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  conflicts: number;
}

class OfflineQueueManagerClass {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'SalatisoOfflineQueue';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'operations';
  private isProcessing = false;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private retryInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize IndexedDB
   */
  async initialize(): Promise<void> {
    if (this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('[OfflineQueue] Failed to open database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[OfflineQueue] Database opened successfully');
        
        // Start automatic retry loop
        this.startRetryLoop();
        
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          
          // Create indexes for efficient querying
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('collection', 'collection', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('documentId', 'documentId', { unique: false });
          
          console.log('[OfflineQueue] Object store created');
        }
      };
    });
  }

  /**
   * Add operation to queue
   */
  async enqueue(
    type: OperationType,
    collection: string,
    documentId: string,
    data: any
  ): Promise<string> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const operation: QueueOperation = {
      id: this.generateId(),
      type,
      collection,
      documentId,
      data,
      status: QueueStatus.PENDING,
      attempts: 0,
      maxAttempts: 3,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.add(operation);

      request.onsuccess = () => {
        console.log('[OfflineQueue] Operation enqueued:', operation.id, type, collection);
        this.notifyListeners('operationAdded', operation);
        resolve(operation.id);
        
        // Try to process immediately
        this.processQueue().catch(console.error);
      };

      request.onerror = () => {
        console.error('[OfflineQueue] Failed to enqueue operation:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get operation by ID
   */
  async getOperation(id: string): Promise<QueueOperation | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Get all operations with optional status filter
   */
  async getOperations(status?: QueueStatus): Promise<QueueOperation[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      
      let request: IDBRequest;
      if (status) {
        const index = store.index('status');
        request = index.getAll(status);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<QueueStats> {
    const operations = await this.getOperations();
    
    return operations.reduce((stats, op) => {
      switch (op.status) {
        case QueueStatus.PENDING:
          stats.pending++;
          break;
        case QueueStatus.PROCESSING:
          stats.processing++;
          break;
        case QueueStatus.COMPLETED:
          stats.completed++;
          break;
        case QueueStatus.FAILED:
          stats.failed++;
          break;
        case QueueStatus.CONFLICT:
          stats.conflicts++;
          break;
      }
      return stats;
    }, { pending: 0, processing: 0, completed: 0, failed: 0, conflicts: 0 });
  }

  /**
   * Process queue
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing || !this.db) {
      return;
    }

    this.isProcessing = true;
    console.log('[OfflineQueue] Starting queue processing...');

    try {
      const operations = await this.getOperations(QueueStatus.PENDING);
      
      for (const operation of operations) {
        try {
          await this.processOperation(operation);
        } catch (error) {
          console.error('[OfflineQueue] Failed to process operation:', operation.id, error);
        }
      }
      
      console.log('[OfflineQueue] Queue processing complete');
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Retry failed operations
   */
  async retryFailed(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const failedOps = await this.getOperations(QueueStatus.FAILED);
    
    for (const op of failedOps) {
      if (op.attempts < op.maxAttempts) {
        await this.updateOperation(op.id, {
          status: QueueStatus.PENDING,
          attempts: op.attempts + 1,
          updatedAt: Date.now(),
        });
      }
    }

    await this.processQueue();
  }

  /**
   * Resolve conflict
   */
  async resolveConflict(resolution: ConflictResolution): Promise<void> {
    const operation = await this.getOperation(resolution.operationId);
    if (!operation) {
      throw new Error('Operation not found');
    }

    if (operation.status !== QueueStatus.CONFLICT) {
      throw new Error('Operation is not in conflict state');
    }

    switch (resolution.strategy) {
      case 'local':
        // Keep local changes, retry operation
        await this.updateOperation(operation.id, {
          status: QueueStatus.PENDING,
          updatedAt: Date.now(),
        });
        await this.processQueue();
        break;

      case 'remote':
        // Discard local changes
        await this.updateOperation(operation.id, {
          status: QueueStatus.COMPLETED,
          updatedAt: Date.now(),
        });
        break;

      case 'merge':
        // Use merged data
        if (!resolution.resolvedData) {
          throw new Error('Resolved data required for merge strategy');
        }
        await this.updateOperation(operation.id, {
          data: resolution.resolvedData,
          status: QueueStatus.PENDING,
          updatedAt: Date.now(),
        });
        await this.processQueue();
        break;

      case 'manual':
        // Keep in conflict state for manual resolution
        break;
    }

    this.notifyListeners('conflictResolved', { operation, resolution });
  }

  /**
   * Clear completed operations
   */
  async clearCompleted(): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const completed = await this.getOperations(QueueStatus.COMPLETED);
    let cleared = 0;

    for (const op of completed) {
      await this.deleteOperation(op.id);
      cleared++;
    }

    console.log('[OfflineQueue] Cleared', cleared, 'completed operations');
    return cleared;
  }

  /**
   * Clear all operations
   */
  async clearAll(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('[OfflineQueue] All operations cleared');
        this.notifyListeners('queueCleared', null);
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Subscribe to events
   */
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Shutdown
   */
  shutdown(): void {
    if (this.retryInterval) {
      clearInterval(this.retryInterval);
      this.retryInterval = null;
    }

    if (this.db) {
      this.db.close();
      this.db = null;
    }

    this.listeners.clear();
    console.log('[OfflineQueue] Shutdown complete');
  }

  /**
   * Private: Process single operation
   */
  private async processOperation(operation: QueueOperation): Promise<void> {
    console.log('[OfflineQueue] Processing operation:', operation.id, operation.type);

    // Update status to processing
    await this.updateOperation(operation.id, {
      status: QueueStatus.PROCESSING,
      updatedAt: Date.now(),
    });

    try {
      // Check for conflicts
      const hasConflict = await this.checkForConflicts(operation);
      if (hasConflict) {
        await this.updateOperation(operation.id, {
          status: QueueStatus.CONFLICT,
          error: 'Version conflict detected',
          updatedAt: Date.now(),
        });
        this.notifyListeners('conflict', operation);
        return;
      }

      // Execute operation (this would integrate with Firestore/backend)
      await this.executeOperation(operation);

      // Mark as completed
      await this.updateOperation(operation.id, {
        status: QueueStatus.COMPLETED,
        updatedAt: Date.now(),
      });

      this.notifyListeners('operationCompleted', operation);
      console.log('[OfflineQueue] Operation completed:', operation.id);
    } catch (error: any) {
      console.error('[OfflineQueue] Operation failed:', operation.id, error);

      const newAttempts = operation.attempts + 1;
      const status = newAttempts >= operation.maxAttempts ? QueueStatus.FAILED : QueueStatus.PENDING;

      await this.updateOperation(operation.id, {
        status,
        attempts: newAttempts,
        error: error.message || 'Unknown error',
        updatedAt: Date.now(),
      });

      if (status === QueueStatus.FAILED) {
        this.notifyListeners('operationFailed', operation);
      }
    }
  }

  /**
   * Private: Execute operation
   */
  private async executeOperation(operation: QueueOperation): Promise<void> {
    // This is a placeholder - in real implementation, this would:
    // 1. Check network connectivity
    // 2. Execute Firestore operation
    // 3. Handle errors and retries
    
    // Simulate operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // For now, just log
    console.log('[OfflineQueue] Executing:', operation.type, operation.collection, operation.documentId);
  }

  /**
   * Private: Check for conflicts
   */
  private async checkForConflicts(operation: QueueOperation): Promise<boolean> {
    // This would check if remote version has changed
    // For now, return false (no conflicts)
    return false;
  }

  /**
   * Private: Update operation
   */
  private async updateOperation(id: string, updates: Partial<QueueOperation>): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const operation = getRequest.result;
        if (operation) {
          const updated = { ...operation, ...updates };
          const putRequest = store.put(updated);

          putRequest.onsuccess = () => {
            this.notifyListeners('operationUpdated', updated);
            resolve();
          };

          putRequest.onerror = () => {
            reject(putRequest.error);
          };
        } else {
          reject(new Error('Operation not found'));
        }
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    });
  }

  /**
   * Private: Delete operation
   */
  private async deleteOperation(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Private: Start retry loop
   */
  private startRetryLoop(): void {
    this.retryInterval = setInterval(() => {
      this.processQueue().catch(console.error);
    }, 30000); // Retry every 30 seconds
  }

  /**
   * Private: Notify listeners
   */
  private notifyListeners(event: string, data: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('[OfflineQueue] Listener error:', error);
        }
      });
    }
  }

  /**
   * Private: Generate ID
   */
  private generateId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton
export const OfflineQueueManager = new OfflineQueueManagerClass();
