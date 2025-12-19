export interface OrderItem {
    productId: string;
    quantity: number;
    orderLineId?: string;
    basePrice?: number;
}