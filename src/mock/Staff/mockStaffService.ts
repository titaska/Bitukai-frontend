import { initialStaffMock } from "./staffMock";
import {
  initialStaffServicesMock,
  StaffPerformedService,
} from "./staffServiceMock";
import { StaffCreate, StaffDto, StaffUpdate, StaffRole, StaffStatus } from "../../types/staff";

let staffData: StaffDto[] = [...initialStaffMock];
let staffServicesData: StaffPerformedService[] = [...initialStaffServicesMock];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const mockStaffService = {
  async getAll(): Promise<StaffDto[]> {
    await delay(150);
    return [...staffData];
  },

  async getById(id: number): Promise<StaffDto | undefined> {
    await delay(150);
    return staffData.find((s) => s.staffId === id);
  },

  async create(dto: StaffCreate): Promise<StaffDto> {
    await delay(150);
    const nextId = staffData.length
      ? Math.max(...staffData.map((s) => s.staffId)) + 1
      : 1;
    const created: StaffDto = { ...dto, staffId: nextId };
    staffData.push(created);
    return created;
  },

  async update(id: number, dto: StaffUpdate): Promise<StaffDto | undefined> {
    await delay(150);
    const index = staffData.findIndex((s) => s.staffId === id);
    if (index === -1) return undefined;

    // registrationNumber, status ir role naudosime iš dto (arba paliekame senus, jei nori)
    staffData[index] = {
      ...staffData[index],
      status: dto.status,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      role: dto.role,
      hireDate: dto.hireDate,
    };

    return staffData[index];
  },

  async delete(id: number): Promise<void> {
    await delay(150);
    staffData = staffData.filter((s) => s.staffId !== id);
    staffServicesData = staffServicesData.filter((s) => s.staffId !== id);
  },

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
