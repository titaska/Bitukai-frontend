export type StaffRole = "STAFF" | "OWNER" | "SUPERADMIN";

export interface StaffDto {
  id: string;
  registrationNumber: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: StaffRole;
  hireDate: string;
}