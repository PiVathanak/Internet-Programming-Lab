import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service.js';
import type { Booking } from './booking.entity.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  private bookings: Booking[] = [];
  private nextId = 1;

  // Nest creates EventsService once and passes it in: dependency injection
  constructor(private readonly events: EventsService) {}

  findAll(): Booking[] {
    return [...this.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // TODO C2: create(eventId, dto)
  //   1. find the event (EventsService.findOne already throws 404)
  //   2. if dto.seats is more than the seats left, throw ConflictException (409)
  //      with a message such as "Only 3 seat(s) left"
  //   3. increase event.booked, store a new Booking with the next id and createdAt = now, return it
  create(eventId: number, dto: CreateBookingDto): Booking {
    void [ConflictException, this.events, this.nextId];
    throw new Error(`TODO C2: book ${dto.seats} seats on ${eventId}`);
  }

  // TODO C3: remove(id): 404 if the booking does not exist; give its seats back to the event; delete it.
  remove(id: number): void {
    void NotFoundException;
    throw new Error(`TODO C3: cancel ${id}`);
  }
}
