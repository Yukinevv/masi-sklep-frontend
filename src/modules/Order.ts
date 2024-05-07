import { OrderProduct } from "./OrderProduct";

export interface Order {
    orderId: number;
    date: string;
    products: OrderProduct[];
}