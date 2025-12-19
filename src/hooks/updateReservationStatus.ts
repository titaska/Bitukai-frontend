import { API_BASE } from "../constants/api";

interface UpdateReservationStatusProps {
  appointmentId: string;
  status: string;
}

export async function updateReservationStatus({ appointmentId, status }: UpdateReservationStatusProps) {
  const response = await fetch(`${API_BASE}/reservations/${appointmentId}/status?status=${encodeURIComponent(status)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return null;
};