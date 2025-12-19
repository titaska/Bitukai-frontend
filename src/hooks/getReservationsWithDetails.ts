import { ReservationInfoDto } from "../types/reservation";
import { API_BASE } from "../constants/api";

export async function getReservationsWithDetails(): Promise<ReservationInfoDto[]> {
  const response = await fetch(`${API_BASE}/reservations/details`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
};