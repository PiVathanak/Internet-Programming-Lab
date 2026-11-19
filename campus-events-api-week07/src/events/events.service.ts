import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Event, Prisma } from '../generated/prisma/client.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { ListEventsQuery } from './dto/list-events.query.js';

// Same methods as week 6, but the data now lives in PostgreSQL.
// Every method is async because every call goes over the network to the database.
@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: ListEventsQuery = {}): Promise<Event[]> {
    const search = query.search?.trim();
    const where: Prisma.EventWhereInput = {
      category: query.category,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
    return this.prisma.event.findMany({ where, orderBy: { startsAt: 'asc' } });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  // TODO B1: insert a new event and return it (booked and description have defaults in the schema)
  create(dto: CreateEventDto): Promise<Event> {
   return this.prisma.$transaction(async (tx) => {
    const event = await tx.event.create({
      data: {
        ...dto,
      },
    });
    return event;
    });
  }

  // TODO B2: 404 if the event does not exist, otherwise update only the fields in dto
  async update(id: number, dto: UpdateEventDto): Promise<Event> {
    await this.findOne(id);
    return this.prisma.event.update(
      {
        where: {id},
        data: dto,
      }
    )
  }

  // TODO B3: 404 if the event does not exist, otherwise delete it
  async remove(id: number): Promise<void> {
    
    await this.findOne(id)
    await this.prisma.event.delete({
      where: {id},
    })
  }
}
