import '../config/env.js';
import { PrismaClient } from '@prisma/client';
import { INITIAL_PRODUCTS, SEED_CATEGORIES } from '../data/seedData.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando siembra (seeding) de la base de datos D’ Victor Fragancias...');

  // 1. Crear Roles si no existen
  const adminRole = await prisma.role.upsert({
    where: { id: 1n },
    update: {},
    create: {
      id: 1n,
      nombre: 'Administrador',
      descripcion: 'Acceso total a la gestión del catálogo y pedidos',
    },
  });

  const clientRole = await prisma.role.upsert({
    where: { id: 2n },
    update: {},
    create: {
      id: 2n,
      nombre: 'Cliente',
      descripcion: 'Visitante con capacidad de compra y pedidos',
    },
  });

  console.log('✅ Roles asegurados:', adminRole.nombre, clientRole.nombre);

  // 2. Crear Categorías
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

  // 3. Crear Usuario Administrador de demostración
  const adminUser = await prisma.usuario.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      rol_id: adminRole.id,
      nombre: 'D’ Victor Administración',
      email: 'admin@dvictorfragancias.com',
      password_hash: '$2b$10$demoHashDVictor2026',
      activo: true,
    },
  });
  console.log('✅ Usuario Administrador asegurado:', adminUser.email);

  // 4. Sembrar Productos Iniciales
  console.log(`📦 Sembrando ${INITIAL_PRODUCTS.length} perfumes en la base de datos...`);
  let count = 0;
  for (const prod of INITIAL_PRODUCTS) {
    const catId = categoriesMap.get(prod.categoriaNombre) || 1n;
    await prisma.producto.create({
      data: {
        categoria_id: catId,
        usuario_id: adminUser.id,
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

  console.log(`✨ Siembra completada con éxito: ${count} perfumes insertados.`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante la siembra de la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
