const API_BASE = "http://localhost:5089/api";

export async function createReservation(payload: any) {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create reservation");
  return res.json();
}

export async function getTakenSlots(employeeId: string, date: string) {
  const res = await fetch(
    `${API_BASE}/reservations/availability?employeeId=${employeeId}&date=${date}`
  );

  if (!res.ok) throw new Error("Failed to fetch availability");
  return res.json(); // DateTime[]
}

