// src/hooks/staffApi.ts
import { API_BASE } from "../constants/api";
import { StaffDto, StaffStatus } from "../types/staff";

export type StaffRole = "STAFF" | "OWNER" | "SUPERADMIN";

export type StaffUpdateDto = {
  Status: StaffStatus;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Role: string;      
  Password: string;  
};

async function readErr(res: Response) {
  const t = await res.text().catch(() => "");
  return t || `HTTP ${res.status}`;
}

export async function updateStaff(staffId: string, dto: StaffUpdateDto): Promise<StaffDto> {
  const res = await fetch(`${API_BASE}/staff/${encodeURIComponent(staffId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!res.ok) throw new Error(await readErr(res));
  return res.json();
}
