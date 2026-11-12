import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cargar variables de entorno estrictamente desde backend/.env
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dvictor_default_secret_2026',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
