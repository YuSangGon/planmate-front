import { apiRequest } from "./api";

export type Price = {
  price: string;
  countryCode: string;
  isSale: boolean;
  salePrice: string;
};

export type ShopItem = {
  itemCode: string;
  itemName: string;
  coins: number;
  mainDescription: string;
  subDescription: string;
  priceInfo: Price;
};

export async function getWalletBalance(token: string) {
  return apiRequest<{
    success: true;
    data: {
      id: string;
      coinBalance: number;
      role: string;
    };
  }>("/wallet/balance", {
    method: "GET",
    token,
  });
}

export async function buyCoinPackage(token: string, itemCode: string) {
  return apiRequest<{
    success: true;
    data: {
      id: string;
      coinBalance: number;
    };
  }>("/wallet/purchase", {
    method: "POST",
    token,
    body: { itemCode },
  });
}

export async function getShopItems(token: string) {
  return apiRequest<{
    success: boolean;
    data: ShopItem[];
  }>(`/wallet/itemList`, {
    method: "GET",
    token,
  });
}
