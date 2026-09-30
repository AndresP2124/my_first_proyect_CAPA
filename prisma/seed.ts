import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes para evitar duplicados
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // Crear un Tenant de prueba
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Tech Solutions S.A.',
    },
  });

  // Encriptar contraseñas de prueba
  const hashedPasswordAdmin = await bcrypt.hash('password123', 10);
  const hashedPasswordUser = await bcrypt.hash('user123', 10);

  // Crear usuario Administrador
  const admin = await prisma.user.create({
    data: {
      email: 'admin@techsolutions.com',
      name: 'Admin Tech Solutions',
      password: hashedPasswordAdmin,
      telephone: '+1-555-0101',
      role: 'ADMIN',
      tenantId: tenant.id,
    },
  });

  // Crear usuario estándar
  const user = await prisma.user.create({
    data: {
      email: 'user@techsolutions.com',
      name: 'John Developer',
      password: hashedPasswordUser,
      telephone: '+1-555-0102',
      role: 'USER',
      tenantId: tenant.id,
    },
  });

  console.log('Seeder completado con éxito:');
  console.log({ admin: admin.email, user: user.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });