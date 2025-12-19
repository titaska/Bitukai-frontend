import { OrderLineDto } from "./OrderLineDto";
export interface OrderDto {
    orderId: string;
    registrationNumber: string;
    customerId?: string;
    status: string;
    createdAt: string;
    closeddAt?: string;
    subtotalAmount?: number;
    taxAmount?: number;
    serviceChargeAmount?: number;
    totalDue?: number;
    notes?: string;
    lines: OrderLineDto[];
}