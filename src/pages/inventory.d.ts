export interface InventoryModel {
  totalSale: number;
  totalCost: number;
  totalProfit: number;
  items: InventoryItemModel[];
}ø

export interface InventoryItemModel {
  id: string;
  purchaseOrder: string;
  product: string;
  size: string;
  purchaseQuantities: number;
  purchaseCost: number;
  purchaseTotalCost: number;
  price: number;
  saleQuantities: number;
  remainQuantities: number;
  profit: number;
}