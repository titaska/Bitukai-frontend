export enum StaffStatus {
    ACTIVE = 1,
    INACTIVE = 2,
}
  
  export type StaffRole = "STAFF" | "OWNER" | "SUPERADMIN";

  export type BusinessType = "CATERING" | "BEAUTY";
  
  export interface StaffDto {
    staffId: string;
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
    role: StaffRole;
    hireDate: string;
    password: string;
  }

  export interface StaffUpdate {
    status: StaffStatus;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;   
    role: StaffRole;
    hireDate: string;
    password: string;
  }

  export type StaffUpdateDto = {
    status: "ACTIVE" | "INACTIVE";
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;        
    hireDate: string;    
    password: string;    
  };

  export type StaffDtoDetails = {
    staffId: string;
    registrationNumber: string;
    status: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    hireDate: string;
    password: string | null;
  };





  
  