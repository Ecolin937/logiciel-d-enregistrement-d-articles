/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PresetProduct {
  id: string;
  name: string;
  price: number;
  category: "Bakery" | "Drink" | "Snack" | "Other";
  iconName: string;
  color: string;
}

export interface Transaction {
  id: string;
  receiptNumber: string;
  timestamp: string;
  items: CartItem[];
  total: number;
  cashReceived: number;
  changeReturned: number;
  tip?: number;
}
