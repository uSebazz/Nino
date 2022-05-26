/* eslint-disable no-unused-vars */
import '@sapphire/plugin-logger/register'
import '@sapphire/plugin-i18next/register'
import '@sapphire/plugin-editable-commands/register'

import type { ArrayString } from '@skyra/env-utilities'
import type { PrismaClient } from '@prisma/client'

declare module '@sapphire/framework' {
  interface Preconditions {
    DevOnly: never
    Administrator: never
  }
}

declare module '@sapphire/pieces' {
  interface Container {
    prisma: PrismaClient
  }
}

declare module '@skyra/env-utilities' {
  interface Env {
    DISCORD_TOKEN: string
    MONGO_URL: string
    CLIENT_OWNERS: ArrayString
  }
}
