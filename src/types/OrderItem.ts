export interface OrderItem {
    productId: string;
    quantity: number;
    orderLineId?: string;
    basePrice?: number;
}

export interface OrderItemWithNotes extends OrderItem {
    notes: string;
}