import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

// One PrismaClient for the whole app. Services inject this class
// and call this.prisma.event.findMany() and so on.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }), log: ['query']  });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
