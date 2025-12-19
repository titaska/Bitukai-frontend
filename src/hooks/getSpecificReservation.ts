import { ReservationInfoDto } from "../types/reservation";
import { API_BASE } from "../constants/api";

export async function getSpecificReservation(appointmentId: string): Promise<ReservationInfoDto | null> {
    try {
        const response = await fetch(`${API_BASE}/reservations/${appointmentId}`);
        if (!response.ok) {
            console.error("Failed to fetch reservation:", response.statusText);
            return null;
        }

        const data = await response.json();
        return data as ReservationInfoDto;
    } catch (error) {
        console.error("Error fetching reservation:", error);
        return null;
    }
}