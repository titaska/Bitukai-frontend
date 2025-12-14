// src/services/serviceApi.ts
import { ServiceConfig, ServiceCreateUpdate } from "../types/service";

const API_BASE = "http://localhost:5089/api";
const SERVICES_URL = `${API_BASE}/Services`; // <-- SVARBU: Services (didžioji)

async function handleJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) throw new Error(text || `Request failed with status ${res.status}`);
  return (text ? JSON.parse(text) : null) as T;
}

export const serviceApi = {
  async getAll(): Promise<ServiceConfig[]> {
    const res = await fetch(SERVICES_URL, { method: "GET" });
    return handleJson<ServiceConfig[]>(res);
  },

  async getById(id: number): Promise<ServiceConfig> {
    const res = await fetch(`${SERVICES_URL}/${id}`, { method: "GET" });
    return handleJson<ServiceConfig>(res);
  },

  async create(dto: ServiceCreateUpdate): Promise<ServiceConfig> {
    const res = await fetch(SERVICES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return handleJson<ServiceConfig>(res);
  },

  async update(id: number, dto: ServiceCreateUpdate): Promise<ServiceConfig> {
    const res = await fetch(`${SERVICES_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return handleJson<ServiceConfig>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${SERVICES_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Delete failed with status ${res.status}`);
    }
  },
};
