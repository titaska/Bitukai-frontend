export interface StaffPerformedService {
    id: number;
    staffId: number;
    name: string;
    revenue: number;
  }
  
  export const initialStaffServicesMock: StaffPerformedService[] = [
    { id: 1, staffId: 1, name: "Service 1", revenue: 1236.23 },
    { id: 2, staffId: 1, name: "Service 2", revenue: 1236.23 },
    { id: 3, staffId: 1, name: "Service 3", revenue: 1236.23 },
  ];
  