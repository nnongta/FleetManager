// src/services/db.ts

export interface Booking {
    id: string;
    requester_id: number;
    purpose: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed' | 'Canceled';
    start_datetime: string;
    end_datetime: string;
    vehicle_id?: number;
    pickup_location?: string;
    dropoff_location?: string;
    passenger_count?: number;
    reject_reason?: string;
}

const STORAGE_KEY = 'fleet_bookings';

export const dbService = {
    getAllBookings(): Booking[] {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            const seed: Booking[] = [
                {
                    id: "#BK-2026-8564",
                    requester_id: 1,
                    purpose: "Client Meeting",
                    status: "Pending",
                    start_datetime: "2026-01-20T09:00",
                    end_datetime: "2026-01-20T14:00",
                    pickup_location: "Head Office",
                    dropoff_location: "Central Plaza",
                    passenger_count: 2,
                    vehicle_id: 101
                }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
            return seed;
        }
        return JSON.parse(data);
    },

    getBookingById(id: string) {
        const bookings = this.getAllBookings();
        return bookings.find(b => b.id === id);
    },


  createBooking(data: Omit<Booking, 'id' | 'status'>): Booking {
        const current = this.getAllBookings();
        const newBooking: Booking = {
            ...data,
            id: `#BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Pending'
        };
        const updated = [newBooking, ...current];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return newBooking;
    },

    approveBooking(id: string) {
        const updated = this.getAllBookings().map(b =>
            b.id === id ? { ...b, status: 'Approved' } : b
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    rejectBooking(id: string, reason: string) {
        const updated = this.getAllBookings().map(b =>
            b.id === id ? { ...b, status: 'Rejected', reject_reason: reason } : b
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
};
