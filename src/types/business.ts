export type BusinessType = "CATERING" | "BEAUTY";

export interface BusinessDto {
  registrationNumber: string;
  vatCode: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  currencyCode: string;
  type: BusinessType;
};