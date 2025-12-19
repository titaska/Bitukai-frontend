import { ProductDto } from "../types/ProductDto";
export interface ProductItem extends ProductDto {
    quantity: number;
    notes?: string;
    orderLineId?: string;
}