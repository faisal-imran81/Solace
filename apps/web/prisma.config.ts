import path from 'node:path'
import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'prisma/config'

loadEnv({ path: '.env.local' })

export default defineConfig({
  earlyAccess: true,
  debug: true,
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
})
