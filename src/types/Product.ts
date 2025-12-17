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

