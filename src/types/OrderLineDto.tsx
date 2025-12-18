export interface OrderLineDto {
    orderLineId: string;
    orderId: string;
    productId: string;
    quantity: number;
    assignedStaffId?: string | null;
    appointmentId?: string | null;
    notes?: string | null;
    unitPrice: number;
    subTotal: number;
}