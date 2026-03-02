import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const permissions = [
    {key: 'dashboard:read' , description: 'Read Dashboard'} ,
    {key: 'users:read' , description: 'Read users'} ,
    {key: 'users:create' , description: 'Create users'} ,
    {key: 'users:update' , description: 'Update users'} ,
    {key: 'users:delete' , description: 'Delete users'} ,
  ];

  await prisma.permission.createMany({
    data: permissions
  });

  const admin = await prisma.role.upsert({
    where: {name: 'admin'} ,
    update: {} ,
    create: {name: 'admin' , description: 'Administrator'} ,
  });

  const user = await prisma.role.upsert({
    where: {name: 'user'} ,
    update: {} ,
    create: {name: 'user' , description: 'Default user'} ,
  });

  const viewer = await prisma.role.upsert({
    where: {name: 'viewer'} ,
    update: {} ,
    create: {name: 'viewer' , description: 'Viewer'} ,
  });

  const allPerms = await prisma.permission.findMany({
    where: {key: {in: permissions.map(p => p.key)}} ,
    select: {id: true} ,
  });

  await prisma.role.update({
    where: {id: admin.id} ,
    data: {
      permissions: {
        connect: allPerms ,
      } ,
    } ,
  });

  const readDashboard = await prisma.permission.findUnique({
    where: {key: 'dashboard:read'} ,
    select: {id: true} ,
  });

  await prisma.role.update({
    where: {id: user.id} ,
    data: {
      permissions: {
        set: readDashboard ? [readDashboard] : [] ,
      } ,
    } ,
  });

  const readPerms = await prisma.permission.findMany({
    where: {key: {in: ['dashboard:read' , 'users:read']}} ,
    select: {id: true} ,
  });

  await prisma.role.update({
    where: {id: viewer.id} ,
    data: {
      permissions: {
        connect: readPerms ,
      } ,
    } ,
  });

  const passwordPlain = process.env.SEED_TEST_PASSWORD ?? 'admin123';
  const hashed = await bcrypt.hash(passwordPlain, 12);

  // Admin
  await prisma.user.upsert({
    where: { userName: 'admin' },
    update: {
      firstName: 'Admin',
      lastName: 'Test',
      email: 'admin@test.com',
      password: hashed,
      isActive: true,
      role: { connect: { id: admin.id } },
    },
    create: {
      firstName: 'Admin',
      lastName: 'Test',
      email: 'admin@test.com',
      userName: 'admin',
      password: hashed,
      isActive: true,
      role: { connect: { id: admin.id } },
    },
  });

  // Viewer
  await prisma.user.upsert({
    where: { userName: 'viewer' },
    update: {
      firstName: 'Viewer',
      lastName: 'Test',
      email: 'viewer@test.com',
      password: hashed,
      isActive: true,
      role: { connect: { id: viewer.id } },
    },
    create: {
      firstName: 'Viewer',
      lastName: 'Test',
      email: 'viewer@test.com',
      userName: 'viewer',
      password: hashed,
      isActive: true,
      role: { connect: { id: viewer.id } },
    },
  });

  // User
  await prisma.user.upsert({
    where: { userName: 'user' },
    update: {
      firstName: 'User',
      lastName: 'Test',
      email: 'user@test.com',
      password: hashed,
      isActive: true,
      role: { connect: { id: user.id } },
    },
    create: {
      firstName: 'User',
      lastName: 'Test',
      email: 'user@test.com',
      userName: 'user',
      password: hashed,
      isActive: true,
      role: { connect: { id: user.id } },
    },
  });
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
