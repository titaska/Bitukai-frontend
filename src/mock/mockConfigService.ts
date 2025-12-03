// src/mock/mockConfigService.ts
import { initialServicesMock } from "./Staff/configServicesMock";
import { ServiceConfig, ServiceCreateUpdate } from "../types/service";

let servicesData: ServiceConfig[] = [...initialServicesMock];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const mockConfigService = {
  async getAllServices(): Promise<ServiceConfig[]> {
    await delay(100);
    return [...servicesData];
  },

  async createService(dto: ServiceCreateUpdate): Promise<ServiceConfig> {
    await delay(100);
    const nextId = servicesData.length
      ? Math.max(...servicesData.map((s) => s.id)) + 1
      : 1;

    const created: ServiceConfig = { id: nextId, ...dto };
    servicesData.push(created);
    return created;
  },

  async updateService(
    id: number,
    dto: ServiceCreateUpdate
  ): Promise<ServiceConfig | undefined> {
    await delay(100);
    const index = servicesData.findIndex((s) => s.id === id);
    if (index === -1) return undefined;

    servicesData[index] = { ...servicesData[index], ...dto };
    return servicesData[index];
  },

  async deleteService(id: number): Promise<void> {
    await delay(100);
    servicesData = servicesData.filter((s) => s.id !== id);
  },
};
