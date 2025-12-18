export interface ProductDto {
    productId: string;
    registrationNumber: string;
    productType: string;
    name: string;
    description: string;
    basePrice: number;
    durationMinutes?: number | null;
    taxCode: string;
    status: boolean;
}