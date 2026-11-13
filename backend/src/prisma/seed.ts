import '../config/env.js';
import { PrismaClient } from '@prisma/client';
import { INITIAL_PRODUCTS, SEED_CATEGORIES } from '../data/seedData.js';
import { hashPassword } from '../utils/security.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando siembra (seeding) de la base de datos D’ Victor Fragancias en Supabase...');

  // 1. Crear / Asegurar Roles del Sistema
  const superAdminRole = await prisma.role.upsert({
    where: { id: 1n },
    update: {
      nombre: 'SuperAdmin',
      descripcion: 'Dueño de la tienda con control total del sistema y gestión de usuarios',
    },
    create: {
      id: 1n,
      nombre: 'SuperAdmin',
      descripcion: 'Dueño de la tienda con control total del sistema y gestión de usuarios',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { id: 2n },
    update: {
      nombre: 'Administrador',
      descripcion: 'Administrador delegado con acceso a catálogo y productos',
    },
    create: {
      id: 2n,
      nombre: 'Administrador',
      descripcion: 'Administrador delegado con acceso a catálogo y productos',
    },
  });

  console.log('✅ Roles asegurados: [1] SuperAdmin, [2] Administrador');

  // 2. Crear / Asegurar Categorías
  const categoriesMap = new Map<string, bigint>();
  for (const cat of SEED_CATEGORIES) {
    const record = await prisma.categoria.upsert({
      where: { id: BigInt(cat.id) },
      update: { nombre: cat.nombre },
      create: {
        id: BigInt(cat.id),
        nombre: cat.nombre,
      },
    });
    categoriesMap.set(cat.nombre, record.id);
  }
  console.log('✅ Categorías aseguradas:', Array.from(categoriesMap.keys()).join(', '));

  // 3. Crear Usuarios de Acceso al Panel de Administración
  const superAdminHash = hashPassword('dvictor2026');
  const regularAdminHash = hashPassword('admin123');

  // 3.1 Dueño (SuperAdmin): usuario 'admin'
  let superAdminUser = await prisma.usuario.findFirst({
    where: {
      OR: [{ email: 'admin' }, { email: 'admin@dvictor.com' }],
    },
  });

  if (superAdminUser) {
    superAdminUser = await prisma.usuario.update({
      where: { id: superAdminUser.id },
      data: {
        nombre: 'Víctor (Dueño)',
        email: 'admin',
        password_hash: superAdminHash,
        rol_id: superAdminRole.id,
        activo: true,
      },
    });
  } else {
    superAdminUser = await prisma.usuario.create({
      data: {
        nombre: 'Víctor (Dueño)',
        email: 'admin',
        password_hash: superAdminHash,
        rol_id: superAdminRole.id,
        activo: true,
      },
    });
  }
  console.log('👑 Usuario SuperAdmin (Dueño) asegurado: "admin" (clave: dvictor2026)');

  // 3.2 Administrador Delegado de Prueba: usuario 'carlos'
  let carlosUser = await prisma.usuario.findFirst({
    where: { email: 'carlos' },
  });

  if (carlosUser) {
    carlosUser = await prisma.usuario.update({
      where: { id: carlosUser.id },
      data: {
        nombre: 'Carlos (Administrador)',
        email: 'carlos',
        password_hash: regularAdminHash,
        rol_id: adminRole.id,
        activo: true,
      },
    });
  } else {
    carlosUser = await prisma.usuario.create({
      data: {
        nombre: 'Carlos (Administrador)',
        email: 'carlos',
        password_hash: regularAdminHash,
        rol_id: adminRole.id,
        activo: true,
      },
    });
  }
  console.log('🛡️  Usuario Administrador delegado asegurado: "carlos" (clave: admin123)');

  // 4. Sembrar Catálogo Completo de Productos (14 Perfumes)
  console.log('🧹 Limpiando productos anteriores para evitar duplicados...');
  await prisma.producto.deleteMany({});

  console.log(`📦 Sembrando los ${INITIAL_PRODUCTS.length} perfumes oficiales en la tabla productos...`);
  let count = 0;
  for (const prod of INITIAL_PRODUCTS) {
    const catId = categoriesMap.get(prod.categoriaNombre) || 1n;
    await prisma.producto.create({
      data: {
        categoria_id: catId,
        usuario_id: superAdminUser.id,
        nombre: prod.nombre,
        marca: prod.marca,
        imagen_url: prod.imagen_url,
        genero: prod.genero,
        concentracion: prod.concentracion,
        familia_olfativa: prod.familia_olfativa,
        notas_principales: prod.notas_principales,
        tamano_ml: prod.tamano_ml,
        precio: prod.precio,
        destacado: prod.destacado,
        disponible: prod.disponible,
      },
    });
    count++;
  }

  console.log(`✨ Siembra completada con éxito: ${count} perfumes introducidos en PostgreSQL.`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante la siembra de la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
