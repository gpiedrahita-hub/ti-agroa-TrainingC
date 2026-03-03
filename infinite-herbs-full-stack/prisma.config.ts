import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const DATABASE_URL = process.env.DATABASE_URL!
// const host = process.env.DB_HOST!
// const port = process.env.DB_PORT ?? '1433'
// const db = process.env.DB_NAME!
// const user = process.env.DB_USER!
// const pass = process.env.DB_PASSWORD!

export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'src/prisma/migrations',
    seed: 'tsx src/prisma/seed.ts',
  },
  datasource: {
    // url: `sqlserver://${host}:${port};database=${db};user=${user};password=${pass};trustServerCertificate=true;encrypt=false`,
    url: DATABASE_URL
  },
})