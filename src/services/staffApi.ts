// src/services/staffApi.ts
import { StaffCreate, StaffDto, StaffUpdate } from "../types/staff";

const API_BASE = "http://localhost:5089/api";
const STAFF_URL = `${API_BASE}/staff`;

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

function normalizeStaff(staff: StaffDto): StaffDto {
  // hireDate be laiko dalies
  return {
    ...staff,
    hireDate: staff.hireDate ? staff.hireDate.split("T")[0] : "",
  };
}

export const staffApi = {
  async getAll(): Promise<StaffDto[]> {
    const res = await fetch(STAFF_URL);
    const data = await handleJson<StaffDto[]>(res);
    return data.map((s) => normalizeStaff(s)); // normalizuoju visą sąrašą
  },

  async getById(id: number): Promise<StaffDto> {
    const res = await fetch(`${STAFF_URL}/${id}`);
    const data = await handleJson<StaffDto>(res);
    return normalizeStaff(data);
  },

  async create(dto: StaffCreate): Promise<StaffDto> {
    const res = await fetch(STAFF_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    const data = await handleJson<StaffDto>(res);
    return normalizeStaff(data);
  },

  async update(id: number, dto: StaffUpdate): Promise<void> {
    const res = await fetch(`${STAFF_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Update failed with status ${res.status}`);
    }
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${STAFF_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Delete failed with status ${res.status}`);
    }
  },
};
