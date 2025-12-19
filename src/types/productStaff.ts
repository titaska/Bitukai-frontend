export type ProductStaffDto = {
    productStaffId: string;
    productId: string;
    staffId: string;
    status: boolean;
    validFrom?: string | null;
    validTo?: string | null;
  };