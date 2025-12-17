import { API_BASE } from "../constants/api";

export async function getTakenSlots(
  employeeId: string,
  date: string
    ): Promise<string[]> {  
  const res = await fetch(
    `${API_BASE}/reservations/availability?employeeId=${employeeId}&date=${date}`
  );

  if (!res.ok) {
    throw new Error("Failed to load availability");
  }

  const data: string[] = await res.json(); 
  return data;
}
