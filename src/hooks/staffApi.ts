import { API_BASE } from "../constants/api";
import type { StaffDto, StaffUpdate } from "../types/staff";

async function readErr(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/problem+json")) {
    const p = await res.json().catch(() => null);
    if (p?.errors) return JSON.stringify(p.errors, null, 2);
    return p?.title || JSON.stringify(p, null, 2);
  }
  const t = await res.text().catch(() => "");
  return t || `HTTP ${res.status} ${res.statusText}`;
}

export const staffApi = {
  async update(staffId: string, dto: StaffUpdate): Promise<StaffDto> {
    const res = await fetch(`${API_BASE}/staff/${encodeURIComponent(staffId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (!res.ok) throw new Error(await readErr(res));
    return await res.json();
  },
};
