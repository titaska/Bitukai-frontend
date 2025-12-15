import { API_BASE } from "../api/apiBase";

export async function getTakenSlots(
  employeeId: string,
  date: string
    ): Promise<string[]> {   // ✅ IMPORTANT
  const res = await fetch(
    `${API_BASE}/reservations/availability?employeeId=${employeeId}&date=${date}`
  );

  if (!res.ok) {
    throw new Error("Failed to load availability");
  }

  const data: string[] = await res.json(); // ✅ typed
  return data;
}
