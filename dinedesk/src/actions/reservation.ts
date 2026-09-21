'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// Seed tables if none exist
async function ensureTablesExist() {
  const count = await prisma.table.count();
  if (count === 0) {
    await prisma.table.createMany({
      data: [
        { number: 1, capacity: 2 },
        { number: 2, capacity: 2 },
        { number: 3, capacity: 4 },
        { number: 4, capacity: 4 },
        { number: 5, capacity: 6 },
        { number: 6, capacity: 6 },
        { number: 7, capacity: 8 },
        { number: 8, capacity: 8 },
      ],
    });
  }
}

export type ReservationState = {
  success?: boolean;
  message?: string;
  error?: string;
  reservation?: {
    id: string;
    tableNumber: number;
    date: string;
    time: string;
    guests: number;
    name: string;
  };
};

export async function makeReservationAction(
  prevState: ReservationState,
  formData: FormData
): Promise<ReservationState> {
  try {
    await ensureTablesExist();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const guestsStr = formData.get('guests') as string;
    const guests = parseInt(guestsStr, 10);

    // Validate required fields
    if (!name || !email || !date || !time || !guests) {
      return { error: 'Please fill in all required fields.' };
    }

    // Validate date is in the future
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (reservationDate < today) {
      return { error: 'Reservation date must be today or in the future.' };
    }

    // Find an available table with enough capacity
    const allTables = await prisma.table.findMany({
      where: { capacity: { gte: guests } },
      orderBy: { capacity: 'asc' },
    });

    if (allTables.length === 0) {
      return { error: `No tables available for ${guests} guests. Please try a smaller party size.` };
    }

    // Check which tables are already booked at this date/time
    const bookedTableIds = await prisma.reservation.findMany({
      where: {
        date: reservationDate,
        time: time,
        status: 'CONFIRMED',
      },
      select: { tableId: true },
    });

    const bookedIds = new Set(bookedTableIds.map((r) => r.tableId));
    const availableTable = allTables.find((t) => !bookedIds.has(t.id));

    if (!availableTable) {
      return {
        error: `Sorry, all tables for ${guests} guests are booked at ${time} on ${date}. Please try a different time or date.`,
      };
    }

    // Find or create a user by email
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, password: '', role: 'CUSTOMER' },
      });
    }

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: user.id,
        tableId: availableTable.id,
        date: reservationDate,
        time,
        guests,
        status: 'CONFIRMED',
      },
      include: { table: true },
    });

    revalidatePath('/reservations');

    return {
      success: true,
      message: `🎉 Reservation confirmed!`,
      reservation: {
        id: reservation.id,
        tableNumber: reservation.table.number,
        date,
        time,
        guests,
        name,
      },
    };
  } catch (error) {
    console.error('Reservation error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}
