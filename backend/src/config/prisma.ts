import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

let prismaInstance: PrismaClient | null = null;
let isDbConnected = false;

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }
  return prismaInstance;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  if (!env.DATABASE_URL) {
    console.log('⚠️ [Prisma] DATABASE_URL no está configurada en el entorno.');
    isDbConnected = false;
    return false;
  }

  // Detectar si aún tiene los corchetes o marcadores de plantilla
  if (env.DATABASE_URL.includes('[') || env.DATABASE_URL.includes('TU_PASSWORD')) {
    console.log('ℹ️ [Prisma] DATABASE_URL tiene marcadores pendientes de configurar ([TU_PASSWORD], etc.).');
    console.log('ℹ️ [Prisma] Operando con repositorio de catálogo sincronizado hasta colocar credenciales de Supabase.');
    isDbConnected = false;
    return false;
  }

  try {
    const prisma = getPrismaClient();
    // Test de conexión con timeout generoso para handshakes TLS con Supabase
    const connectPromise = prisma.$queryRaw`SELECT 1`;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Tiempo de espera agotado al conectar a PostgreSQL en Supabase')), 8000)
    );

    await Promise.race([connectPromise, timeoutPromise]);
    isDbConnected = true;
    console.log('✅ [Prisma] Conexión establecida exitosamente con PostgreSQL en Supabase.');
    return true;
  } catch (error: any) {
    isDbConnected = false;
    console.warn('⚠️ [Prisma] Base de datos no accesible en este momento:', error.message || error);
    console.log('ℹ️ [Prisma] Operando con repositorio sincronizado de alto rendimiento para permitir pruebas inmediatas.');
    return false;
  }
}

export function isDatabaseReady(): boolean {
  return isDbConnected;
}

export const prisma = getPrismaClient();
