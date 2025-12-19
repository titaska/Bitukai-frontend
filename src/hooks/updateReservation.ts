import { API_BASE } from "../constants/api";

interface UpdateReservationPayload {
  registrationNumber: string;
  employeeId: string;
  serviceProductId: string;
  startTime: string;
  durationMinutes: number;
  clientName: string;
  clientSurname: string;
  clientPhone: string;
  notes?: string | null;
}

export async function updateReservation(appointmentId: string, payload: UpdateReservationPayload) {
  const res = await fetch(`${API_BASE}/reservations/${appointmentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to update reservation");
  }

  return null;
}
