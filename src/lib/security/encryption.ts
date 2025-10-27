/**
 * Phase 6.5 - Security Hardening: Encryption Utilities
 * Comprehensive encryption and data protection utilities
 */

import crypto from 'crypto'

// ============================================================================
// Types
// ============================================================================

export interface EncryptionConfig {
  algorithm: string
  keyLength: number
  saltLength: number
  iterations: number
  digest: string
}

export interface EncryptedData {
  ciphertext: string
  iv: string
  salt: string
  algorithm: string
  tag?: string
}

export interface KeyDerivationResult {
  key: Buffer
  salt: Buffer
  iterations: number
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_CONFIG: EncryptionConfig = {
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  saltLength: 16,
  iterations: 100000,
  digest: 'sha256',
}

const MASTER_KEY_ENV = 'ENCRYPTION_MASTER_KEY'

// ============================================================================
// Key Management
// ============================================================================

let masterKey: Buffer | null = null

/**
 * Initialize the encryption system with master key
 */
export function initializeEncryption(key?: string): void {
  if (key) {
    masterKey = Buffer.from(key, 'hex')
  } else if (typeof process !== 'undefined' && process.env[MASTER_KEY_ENV]) {
    masterKey = Buffer.from(process.env[MASTER_KEY_ENV]!, 'hex')
  } else {
    throw new Error(`Encryption master key not found. Set ${MASTER_KEY_ENV} environment variable.`)
  }

  if (masterKey.length < 32) {
    throw new Error('Master key must be at least 32 bytes (256 bits)')
  }
}

/**
 * Generate a new random master key
 */
export function generateMasterKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Get current master key status
 */
export function getMasterKeyStatus(): boolean {
  return masterKey !== null
}

// ============================================================================
// Key Derivation
// ============================================================================

/**
 * Derive a key from a password using PBKDF2
 */
export function deriveKeyFromPassword(
  password: string,
  salt?: Buffer,
  config: EncryptionConfig = DEFAULT_CONFIG
): KeyDerivationResult {
  const derivedSalt = salt || crypto.randomBytes(config.saltLength)

  const key = crypto.pbkdf2Sync(
    password,
    derivedSalt,
    config.iterations,
    config.keyLength,
    config.digest
  )

  return {
    key,
    salt: derivedSalt,
    iterations: config.iterations,
  }
}

/**
 * Derive a key for a specific data item (uses master key + data identifier)
 */
export function deriveKeyForData(
  dataId: string,
  config: EncryptionConfig = DEFAULT_CONFIG
): Buffer {
  if (!masterKey) {
    throw new Error('Encryption not initialized. Call initializeEncryption() first.')
  }

  return crypto.pbkdf2Sync(
    masterKey,
    dataId,
    config.iterations,
    config.keyLength,
    config.digest
  )
}

// ============================================================================
// Encryption
// ============================================================================

/**
 * Encrypt data using AES-256-GCM
 */
export function encrypt(
  data: string,
  key?: Buffer,
  config: EncryptionConfig = DEFAULT_CONFIG
): EncryptedData {
  const encryptionKey = key || masterKey

  if (!encryptionKey) {
    throw new Error('Encryption key not provided and master key not initialized')
  }

  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(config.algorithm, encryptionKey, iv)

  let ciphertext = cipher.update(data, 'utf8', 'hex')
  ciphertext += cipher.final('hex')

  const tag = cipher.getAuthTag()

  return {
    ciphertext,
    iv: iv.toString('hex'),
    salt: '',
    algorithm: config.algorithm,
    tag: tag.toString('hex'),
  }
}

/**
 * Encrypt data with a password (includes key derivation)
 */
export function encryptWithPassword(
  data: string,
  password: string,
  config: EncryptionConfig = DEFAULT_CONFIG
): EncryptedData {
  const derivation = deriveKeyFromPassword(password, undefined, config)
  const encrypted = encrypt(data, derivation.key, config)

  return {
    ...encrypted,
    salt: derivation.salt.toString('hex'),
  }
}

/**
 * Encrypt object as JSON
 */
export function encryptObject<T extends object>(
  obj: T,
  key?: Buffer,
  config?: EncryptionConfig
): EncryptedData {
  const jsonString = JSON.stringify(obj)
  return encrypt(jsonString, key, config)
}

/**
 * Encrypt object with password
 */
export function encryptObjectWithPassword<T extends object>(
  obj: T,
  password: string,
  config?: EncryptionConfig
): EncryptedData {
  const jsonString = JSON.stringify(obj)
  return encryptWithPassword(jsonString, password, config)
}

// ============================================================================
// Decryption
// ============================================================================

/**
 * Decrypt data using AES-256-GCM
 */
export function decrypt(
  encrypted: EncryptedData,
  key?: Buffer,
  config: EncryptionConfig = DEFAULT_CONFIG
): string {
  const decryptionKey = key || masterKey

  if (!decryptionKey) {
    throw new Error('Decryption key not provided and master key not initialized')
  }

  const iv = Buffer.from(encrypted.iv, 'hex')
  const ciphertext = Buffer.from(encrypted.ciphertext, 'hex')
  const tag = encrypted.tag ? Buffer.from(encrypted.tag, 'hex') : undefined

  const decipher = crypto.createDecipheriv(config.algorithm, decryptionKey, iv)

  if (tag) {
    decipher.setAuthTag(tag)
  }

  let plaintext = decipher.update(ciphertext)
  plaintext = Buffer.concat([plaintext, decipher.final()])

  return plaintext.toString('utf8')
}

/**
 * Decrypt data with a password
 */
export function decryptWithPassword(
  encrypted: EncryptedData,
  password: string,
  config: EncryptionConfig = DEFAULT_CONFIG
): string {
  const salt = Buffer.from(encrypted.salt, 'hex')
  const derivation = deriveKeyFromPassword(password, salt, config)
  return decrypt(encrypted, derivation.key, config)
}

/**
 * Decrypt object from JSON
 */
export function decryptObject<T extends object>(
  encrypted: EncryptedData,
  key?: Buffer,
  config?: EncryptionConfig
): T {
  const jsonString = decrypt(encrypted, key, config)
  return JSON.parse(jsonString) as T
}

/**
 * Decrypt object with password
 */
export function decryptObjectWithPassword<T extends object>(
  encrypted: EncryptedData,
  password: string,
  config?: EncryptionConfig
): T {
  const jsonString = decryptWithPassword(encrypted, password, config)
  return JSON.parse(jsonString) as T
}

// ============================================================================
// Hashing
// ============================================================================

/**
 * Generate a cryptographic hash (SHA-256)
 */
export function hash(data: string, algorithm: string = 'sha256'): string {
  return crypto.createHash(algorithm).update(data).digest('hex')
}

/**
 * Generate a bcrypt-style hash for passwords (PBKDF2 with high iterations)
 */
export function hashPassword(password: string, iterations: number = 100000): string {
  const salt = crypto.randomBytes(16)
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha256')

  return `${salt.toString('hex')}.${derivedKey.toString('hex')}.${iterations}`
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, passwordHash: string): boolean {
  const [saltHex, hashHex, iterationsStr] = passwordHash.split('.')

  if (!saltHex || !hashHex || !iterationsStr) {
    return false
  }

  const salt = Buffer.from(saltHex, 'hex')
  const iterations = parseInt(iterationsStr, 10)
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha256')

  return derivedKey.toString('hex') === hashHex
}

// ============================================================================
// HMAC
// ============================================================================

/**
 * Generate HMAC for data integrity verification
 */
export function generateHMAC(
  data: string,
  key?: Buffer,
  algorithm: string = 'sha256'
): string {
  const hmacKey = key || masterKey

  if (!hmacKey) {
    throw new Error('HMAC key not provided and master key not initialized')
  }

  return crypto.createHmac(algorithm, hmacKey).update(data).digest('hex')
}

/**
 * Verify HMAC
 */
export function verifyHMAC(data: string, hmac: string, key?: Buffer, algorithm: string = 'sha256'): boolean {
  const expectedHmac = generateHMAC(data, key, algorithm)
  return crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(expectedHmac, 'hex'))
}

// ============================================================================
// Secure Random Generation
// ============================================================================

/**
 * Generate secure random bytes
 */
export function generateRandomBytes(length: number = 32): Buffer {
  return crypto.randomBytes(length)
}

/**
 * Generate secure random token
 */
export function generateRandomToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Generate secure random UUID
 */
export function generateRandomUUID(): string {
  return crypto.randomUUID()
}

// ============================================================================
// Data Serialization
// ============================================================================

/**
 * Serialize encrypted data for storage/transmission
 */
export function serializeEncryptedData(data: EncryptedData): string {
  return Buffer.from(JSON.stringify(data)).toString('base64')
}

/**
 * Deserialize encrypted data from storage/transmission
 */
export function deserializeEncryptedData(serialized: string): EncryptedData {
  const json = Buffer.from(serialized, 'base64').toString('utf8')
  return JSON.parse(json) as EncryptedData
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if data has been encrypted
 */
export function isEncrypted(data: unknown): data is EncryptedData {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const obj = data as Record<string, unknown>
  return (
    typeof obj.ciphertext === 'string' &&
    typeof obj.iv === 'string' &&
    typeof obj.algorithm === 'string'
  )
}

/**
 * Get encryption configuration
 */
export function getEncryptionConfig(algorithm?: string): EncryptionConfig {
  return {
    ...DEFAULT_CONFIG,
    algorithm: algorithm || DEFAULT_CONFIG.algorithm,
  }
}

/**
 * Benchmark encryption performance
 */
export function benchmarkEncryption(iterations: number = 1000): { duration: number; opsPerSecond: number } {
  const testData = 'Test data for benchmarking'
  const startTime = performance.now()

  for (let i = 0; i < iterations; i++) {
    encrypt(testData)
  }

  const duration = performance.now() - startTime
  const opsPerSecond = (iterations / duration) * 1000

  return { duration, opsPerSecond }
}

// ============================================================================
// Environment-specific Initialization
// ============================================================================

/**
 * Auto-initialize encryption if in Node.js environment
 */
if (typeof process !== 'undefined' && process.env[MASTER_KEY_ENV]) {
  try {
    initializeEncryption()
  } catch {
    // Silently fail - encryption will be initialized later when needed
  }
}
