import { API_BASE } from "../constants/api";
import { Reservation } from "../types/reservation";

export async function getTakenSlots(
  employeeId: string,
  date: string
): Promise<Reservation[]> {
  const res = await fetch(
    `${API_BASE}/reservations/availability?employeeId=${employeeId}&date=${date}`
  );

  if (!res.ok) throw new Error("Failed to load availability");
  return res.json();
}

