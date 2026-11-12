import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { checkDatabaseConnection } from './config/prisma.js';
import apiRouter from './routes/index.js';

const app = express();

// ── Middlewares de seguridad y formato ───────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes locales (ej. Vite en puerto 3000 o cualquier puerto local) y llamadas sin origin (Postman/Curl)
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger básico para depuración de rutas
if (env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ── Montaje de rutas ─────────────────────────────────────────────────────────
app.use('/api', apiRouter);

// Ruta raíz informativa
app.get('/', (_req, res) => {
  res.json({
    name: 'D’ Victor Fragancias API Server',
    status: 'online',
    endpoints: {
      productos: '/api/productos',
      destacados: '/api/productos/destacados',
      disponibles: '/api/productos/disponibles',
      categorias: '/api/categorias',
      health: '/api/health',
    },
  });
});

// Manejador 404
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Recurso no encontrado en el servidor API',
  });
});

// Manejador centralizado de errores
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Error no controlado en el servidor:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
});

// ── Inicialización del servidor ─────────────────────────────────────────────
async function startServer() {
  console.log('🚀 Iniciando servidor backend D’ Victor Fragancias...');

  // Verificar conexión con la base de datos
  await checkDatabaseConnection();

  const server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`✨ Servidor Backend ejecutándose en: http://localhost:${env.PORT}`);
    console.log(`📡 Endpoints principales:`);
    console.log(`   - Productos: http://localhost:${env.PORT}/api/productos`);
    console.log(`   - Destacados: http://localhost:${env.PORT}/api/productos/destacados`);
    console.log(`   - Disponibles: http://localhost:${env.PORT}/api/productos/disponibles`);
    console.log(`   - Categorías: http://localhost:${env.PORT}/api/categorias`);
    console.log(`   - Diagnóstico: http://localhost:${env.PORT}/api/health`);
    console.log(`======================================================\n`);
  });

  const shutdown = () => {
    console.log('\n🛑 Cerrando servidor backend...');
    server.close(() => {
      console.log('Servidor finalizado con éxito.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer().catch((error) => {
  console.error('Fallo crítico al iniciar el servidor:', error);
  process.exit(1);
});
