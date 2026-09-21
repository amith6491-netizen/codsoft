'use client';

import { Calendar, Clock, Users, ArrowRight, CheckCircle, Phone, Mail, User, AlertCircle } from 'lucide-react';
import { useActionState } from 'react';
import { makeReservationAction, ReservationState } from '@/actions/reservation';

const timeSlots = [
  '12:00 (12:00 PM)',
  '12:30 (12:30 PM)',
  '13:00 (1:00 PM)',
  '13:30 (1:30 PM)',
  '14:00 (2:00 PM)',
  '18:00 (6:00 PM)',
  '18:30 (6:30 PM)',
  '19:00 (7:00 PM)',
  '19:30 (7:30 PM)',
  '20:00 (8:00 PM)',
  '20:30 (8:30 PM)',
  '21:00 (9:00 PM)',
  '21:30 (9:30 PM)',
];

const initialState: ReservationState = {};

export default function ReservationsPage() {
  const [state, formAction, isPending] = useActionState(makeReservationAction, initialState);

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  if (state.success && state.reservation) {
    const res = state.reservation;
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="glass-effect rounded-3xl p-10 border border-white/20 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-outfit font-bold mb-2">Reservation Confirmed!</h1>
            <p className="text-foreground/60 mb-8">We look forward to seeing you, {res.name}!</p>
            
            <div className="grid grid-cols-2 gap-4 text-left mb-8">
              <div className="bg-background/50 rounded-2xl p-4">
                <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Table</p>
                <p className="text-2xl font-bold font-outfit text-primary">#{res.tableNumber}</p>
              </div>
              <div className="bg-background/50 rounded-2xl p-4">
                <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Guests</p>
                <p className="text-2xl font-bold font-outfit">{res.guests} People</p>
              </div>
              <div className="bg-background/50 rounded-2xl p-4">
                <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Date</p>
                <p className="text-lg font-semibold">{new Date(res.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="bg-background/50 rounded-2xl p-4">
                <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Time</p>
                <p className="text-lg font-semibold">{res.time}</p>
              </div>
            </div>

            <div className="bg-primary/10 rounded-2xl p-4 mb-6 text-sm text-foreground/70">
              <p>📧 A confirmation has been noted for <strong>{res.name}</strong></p>
              <p className="mt-1 text-xs text-foreground/50">Reservation ID: {res.id.slice(0, 12).toUpperCase()}</p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Make Another Reservation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-4">Book a Table</h1>
        <p className="text-foreground/70 max-w-xl mx-auto">
          Reserve your spot at DineDesk. We look forward to hosting you for an unforgettable dining experience.
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <form className="relative z-10 space-y-8" action={formAction}>
          {/* Reservation Details */}
          <div className="space-y-4">
            <h3 className="font-outfit text-xl font-bold border-b border-border pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Reservation Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  min={today}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Time <span className="text-red-500">*</span>
                </label>
                <select
                  id="time"
                  name="time"
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot.split(' ')[0]}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="guests" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Guests <span className="text-red-500">*</span>
                </label>
                <select
                  id="guests"
                  name="guests"
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Person' : 'People'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-outfit text-xl font-bold border-b border-border pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="requests" className="text-sm font-semibold text-foreground/80">
                  Special Requests <span className="text-foreground/40 font-normal">(Optional)</span>
                </label>
                <input
                  id="requests"
                  name="requests"
                  type="text"
                  placeholder="Anniversary, allergies, high chair needed..."
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {state.error && (
            <div className="flex items-center gap-3 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{state.error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group text-lg shadow-md shadow-primary/20 disabled:opacity-70"
          >
            {isPending ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Checking availability...
              </>
            ) : (
              <>
                Confirm Reservation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
