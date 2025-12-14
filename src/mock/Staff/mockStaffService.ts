// src/mock/Staff/mockStaffService.ts
import {
  initialStaffServicesMock,
  StaffPerformedService,
} from "./staffServiceMock";

// Čia laikom tik "performed services" mock duomenis
let staffServicesData: StaffPerformedService[] = [...initialStaffServicesMock];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const mockStaffService = {
  async getServicesByStaffId(
    staffId: number
  ): Promise<StaffPerformedService[]> {
    await delay(150);
    return staffServicesData.filter((s) => s.staffId === staffId);
  },

  async unassignService(serviceId: number): Promise<void> {
    await delay(150);
    staffServicesData = staffServicesData.filter((s) => s.id !== serviceId);
  },
};
