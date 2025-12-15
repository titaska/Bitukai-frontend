export enum StaffStatus {
    ACTIVE = 1,
    INACTIVE = 2,
  }
  
  export type StaffRole = "STAFF" | "OWNER" | "SUPERADMIN";
  
  export interface StaffDto {
    staffId: number;
    registrationNumber: string;
    status: StaffStatus;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: StaffRole;
    hireDate: string; 
  }
  
  export interface StaffCreate {
    status: StaffStatus;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    passwordHash: string;
    role: StaffRole;
    hireDate: string;
  }

  export interface StaffUpdate {
    status: StaffStatus;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    passwordHash?: string | null;
    role: StaffRole;
    hireDate: string;
  }
  
  