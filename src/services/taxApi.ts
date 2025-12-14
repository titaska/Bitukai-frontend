// src/services/taxApi.ts
import { TaxCreateUpdate, TaxDto } from "../types/tax";

const API_BASE = "http://localhost:5089/api";
const TAX_URL = `${API_BASE}/tax`;

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

export const taxApi = {
  async getAll(): Promise<TaxDto[]> {
    const res = await fetch(TAX_URL, { headers: { Accept: "application/json" } });
    return handleJson<TaxDto[]>(res);
  },

  async getById(id: string): Promise<TaxDto> {
    const res = await fetch(`${TAX_URL}/${id}`, { headers: { Accept: "application/json" } });
    return handleJson<TaxDto>(res);
  },

  async create(dto: TaxCreateUpdate): Promise<TaxDto> {
    const res = await fetch(TAX_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(dto),
    });
    return handleJson<TaxDto>(res);
  },

  async update(id: string, dto: TaxCreateUpdate): Promise<void> {
    const res = await fetch(`${TAX_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Update failed with status ${res.status}`);
    }
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${TAX_URL}/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Delete failed with status ${res.status}`);
    }
  },
};
