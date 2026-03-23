import { apiRequest } from "./api";

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

export async function buyCoinPackage(token: string, packageId: string) {
  return apiRequest<{
    success: true;
    data: {
      id: string;
      coinBalance: number;
    };
  }>("/wallet/purchase", {
    method: "POST",
    token,
    body: { packageId },
  });
}
