import { API_BASE } from "../constants/api";

export async function createReservation(payload: any) {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create reservation");
  }

  return res.json();
}
