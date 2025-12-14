// src/services/staffServicesApi.ts

export interface StaffPerformedService {
  id: number;
  serviceId: number;
  name: string;
  price: number;  
  revenue: number;
}


export interface ServiceOption {
  id: number;   
  name: string; 
}

const API_BASE = "http://localhost:5089/api";

async function handleJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) throw new Error(text || `Request failed with status ${res.status}`);
  return (text ? JSON.parse(text) : null) as T;
}

export const staffServicesApi = {
  async getByStaffId(staffId: number): Promise<StaffPerformedService[]> {
    const res = await fetch(`${API_BASE}/staff/${staffId}/services`, { method: "GET" });
    return handleJson<StaffPerformedService[]>(res);
  },

  async unassign(staffId: number, staffServiceId: number): Promise<void> {
    const res = await fetch(`${API_BASE}/staff/${staffId}/services/${staffServiceId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Delete failed with status ${res.status}`);
    }
  },

  async getAllServices(): Promise<ServiceOption[]> {
    // <-- SVARBU: /api/Services
    const res = await fetch(`${API_BASE}/Services`, { method: "GET" });
    return handleJson<ServiceOption[]>(res);
  },

  async assign(staffId: number, serviceId: number): Promise<void> {
    const res = await fetch(`${API_BASE}/staff/${staffId}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Assign failed with status ${res.status}`);
    }
  },
};
