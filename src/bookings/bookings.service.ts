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
    
    const event = this.events.findOne(eventId);
    if(dto.seats > event.capacity - event.booked){
      throw new ConflictException(`only ${event.capacity - event.booked} seat(s) left`)
    }
    event.booked += dto.seats;
    const newBooking: Booking = {
      id: this.nextId++,
      eventId: eventId,
      name: dto.name,
      email: dto.email,
      seats: dto.seats,
      createdAt: new Date().toISOString(),
    };
    this.bookings.push(newBooking);
    return newBooking;
    }

  // TODO C3: remove(id): 404 if the booking does not exist; give its seats back to the event; delete it.
  remove(id: number): void {
    if(!this.bookings.find((booking) => booking.id === id)){
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    const bookingIndex = this.bookings.findIndex((booking) => booking.id === id);
    const booking = this.bookings[bookingIndex];
    const event = this.events.findOne(booking.eventId);
    event.booked -= booking.seats;
    this.bookings.splice(bookingIndex, 1);
  }
}
