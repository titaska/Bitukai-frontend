import { BusinessType } from "./business";
import { StaffRole } from "./staff";

export interface NavbarProps {
  businessType: BusinessType;
  userRole: StaffRole;
};