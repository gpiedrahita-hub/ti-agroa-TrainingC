import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const createPrisma = () => new PrismaClient().$extends(withAccelerate());

export type PrismaAcceleratedClient = ReturnType<typeof createPrisma>;

export const prisma: PrismaAcceleratedClient = createPrisma();