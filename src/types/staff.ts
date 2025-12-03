export enum StaffStatus {
    ACTIVE = 1,
    INACTIVE = 2,
  }
  
  export enum StaffRole {
    STAFF = 1,
    OWNER = 2,
    SUPERADMIN = 3,
  }
  
  export interface StaffDto {
    staffId: number;
    registrationNumber: string;
    status: StaffStatus;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: StaffRole;
    hireDate: string; // "YYYY-MM-DD"
  }
  
  export interface StaffCreate {
    registrationNumber: string;
    status: StaffStatus;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: StaffRole;
    hireDate: string;
  }

  export interface StaffUpdate {
    status: StaffStatus;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: StaffRole;
    hireDate: string;
  }
  
  