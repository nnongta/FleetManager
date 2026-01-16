// src/services/db.ts

const STORAGE_KEY = "bookings";


export interface Booking {
    id: string;
    requester_id: number;
    purpose: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed' | 'Canceled';
    start_datetime: string;
    end_datetime: string;
    vehicle_id?: number;
    vehicleType: string;
    pickup_location?: string;
    dropoff_location?: string;
    passenger_count?: number;
    reject_reason?: string;
}

/**
 * 🔹 Helper: อ่านข้อมูลจาก storage แบบปลอดภัย
 */
function readStorage(): Booking[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as Booking[];
    } catch (err) {
        console.error("Failed to read bookings:", err);
        return [];
    }
}

/**
 * 🔹 Helper: เขียนข้อมูลลง storage
 */
function writeStorage(data: Booking[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateBookingId(bookings: Booking[]): string {
    // ดึงเฉพาะ id ที่ขึ้นต้นด้วย BK-
    const ids = bookings
        .map(b => b.id)
        .filter(id => id.startsWith("BK-"))
        .map(id => Number(id.replace("BK-", "")))
        .filter(n => !isNaN(n));

    const nextNumber = ids.length > 0 ? Math.max(...ids) + 1 : 1;

    return `BK-${String(nextNumber).padStart(6, "0")}`;
}


export const bookingDB = {

    getAllBookings(): Booking[] {
        return readStorage();
    },

    getBookingById(id: string): Booking | undefined {
        return this.getAllBookings().find(b => b.id === id);
    },

    createBooking(booking: Omit<Booking, "id"> & { id?: string }) {
        const bookings = this.getAllBookings();

        const id = booking.id ?? generateBookingId(bookings);

        const exists = bookings.some(b => b.id === id);
        if (exists) {
            throw new Error("Booking ID already exists");
        }

        bookings.push({
            ...booking,
            id,
            status: booking.status ?? "Pending"
        });

        writeStorage(bookings);
    },


    updateBooking(updatedBooking: Booking) {
        const bookings = this.getAllBookings().map(b =>
            b.id === updatedBooking.id ? updatedBooking : b
        );

        writeStorage(bookings);
    },

    approveBooking(id: string) {
        const updated = this.getAllBookings().map(b =>
            b.id === id ? { ...b, status: 'Approved' } : b
        );
        writeStorage(updated);
    },

    rejectBooking(id: string, reason: string) {
        const updated = this.getAllBookings().map(b =>
            b.id === id
                ? { ...b, status: 'Rejected', reject_reason: reason }
                : b
        );
        writeStorage(updated);
    },

    cancelBooking(id: string) {
        const updated = this.getAllBookings().map(b =>
            b.id === id ? { ...b, status: 'Canceled' } : b
        );
        writeStorage(updated);
    },

    clearAll() {
        localStorage.removeItem(STORAGE_KEY);
    }
};

export const dbService = bookingDB;

