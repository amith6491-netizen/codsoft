'use server';

import { connectDB } from '@/lib/mongodb';
import { Table, Reservation, User } from '@/lib/models';
import { revalidatePath } from 'next/cache';
import { Types } from 'mongoose';

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

type TableRecord = {
  _id: Types.ObjectId;
  number: number;
  capacity: number;
};

type BookedRecord = {
  tableId?: Types.ObjectId;
};

async function ensureTablesExist() {
  const count = await Table.countDocuments();
  if (count === 0) {
    await Table.insertMany([
      { number: 1, capacity: 2 },
      { number: 2, capacity: 2 },
      { number: 3, capacity: 4 },
      { number: 4, capacity: 4 },
      { number: 5, capacity: 6 },
      { number: 6, capacity: 6 },
      { number: 7, capacity: 8 },
      { number: 8, capacity: 8 },
    ]);
  }
}

export async function makeReservationAction(
  prevState: ReservationState,
  formData: FormData
): Promise<ReservationState> {
  try {
    await connectDB();
    await ensureTablesExist();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const guestsStr = formData.get('guests') as string;
    const guests = parseInt(guestsStr, 10);

    if (!name || !email || !date || !time || !guests) {
      return { error: 'Please fill in all required fields.' };
    }

    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (reservationDate < today) {
      return { error: 'Reservation date must be today or in the future.' };
    }

    const allTables = (await Table.find(
      { capacity: { $gte: guests } },
      {},
      { sort: { capacity: 1 } }
    ).lean()) as unknown as TableRecord[];

    if (allTables.length === 0) {
      return { error: `No tables available for ${guests} guests. Please try a smaller party size.` };
    }

    const bookedTableIds = (await Reservation.find(
      {
        date: reservationDate,
        time: time,
        status: 'CONFIRMED',
      },
      { tableId: 1 }
    ).lean()) as unknown as BookedRecord[];

    const bookedIds = new Set(bookedTableIds.map((r) => r.tableId?.toString()));
    const availableTable = allTables.find((t) => !bookedIds.has(t._id.toString()));

    if (!availableTable) {
      return {
        error: `Sorry, all tables for ${guests} guests are booked at ${time} on ${date}. Please try a different time or date.`,
      };
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        phone: phone || null,
        password: null,
        role: 'CUSTOMER',
      });
    } else if (phone && !user.phone) {
      user.phone = phone;
      await user.save();
    }

    const reservation = await Reservation.create({
      userId: user._id,
      tableId: availableTable._id,
      date: reservationDate,
      time,
      guests,
      status: 'CONFIRMED',
    });

    revalidatePath('/reservations');

    return {
      success: true,
      message: `🎉 Reservation confirmed!`,
      reservation: {
        id: reservation._id.toString(),
        tableNumber: availableTable.number,
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
