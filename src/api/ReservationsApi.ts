const API_BASE = "http://localhost:5089/api";

export interface CreateReservationRequest {
  registrationNumber: string;
  serviceProductId: string;
  employeeId: string;
  startTime: string; // ISO string
  durationMinutes: number;
  clientName: string;
  clientSurname: string;
  clientPhone: string;
  notes?: string;
}

export async function createReservation(
  data: CreateReservationRequest
) {
  const response = await fetch(`${API_BASE}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}
