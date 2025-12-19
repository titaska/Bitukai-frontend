export interface Product {
  productId: string;              // Guid from backend
  registrationNumber: string;
  productType: number | string;   // enum: could arrive as 0/1 or "Service"/"Goods"
  name: string;
  description: string;
  basePrice: number;
  durationMinutes: number | null; // int? in C#
  taxCode: string;
  status: boolean;
}

export interface ReservationProduct {
  productId: string;
  name: string;
  durationMinutes: number;
}
export type ProductType = "ITEM" | "SERVICE";

export type ProductDto = {
  productId: string;
  registrationNumber: string;

  productType: ProductType;

  name: string;
  description: string;
  basePrice: number;
  durationMinutes?: number | null;
  taxCode: string;
  status: boolean;
};

export type ProductCreateDto = {
  registrationNumber: string;
  productType: string;
  name: string;
  description: string;
  basePrice: number;
  durationMinutes?: number | null;
  taxCode: string;
  status: boolean;
};

export type ProductUpdateDto = {
  name: string;
  description: string;
  basePrice: number;
  durationMinutes?: number | null;
  taxCode: string;
  status: boolean;
};

export type ListParams = {
  registrationNumber: string; 
  type?: ProductType;
  search?: string;
  page?: number;
  limit?: number;
};

export type ProductDtoDetails = {
    productId: string;
    registrationNumber: string;
    type: "ITEM" | "SERVICE"; 
    name: string;
    description: string;
    basePrice: number;
    durationMinutes?: number | null;
    taxCode: string;
    status: boolean;
  };
