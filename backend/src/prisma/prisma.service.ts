import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit {
  constructor(private configService: ConfigService) {
    // Construct DATABASE_URL from separate env vars
    const dbHost = configService.get<string>('DB_HOST')
    const dbPort = configService.get<string>('DB_PORT')
    const dbUser = configService.get<string>('DB_USER')
    const dbPass = configService.get<string>('DB_PASS')
    const dbName = configService.get<string>('DB_NAME')

    const databaseUrl = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`

    // Set the DATABASE_URL in process.env
    process.env.DATABASE_URL = databaseUrl

    super()
  }

  async onModuleInit() {
    await this.$connect()
  }
}
