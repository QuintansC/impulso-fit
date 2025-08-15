// Utility functions for price formatting and calculations

export const formatPrice = (price: any): number => {
  if (typeof price === 'string') {
    const parsed = parseFloat(price);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (typeof price === 'number') {
    return isNaN(price) ? 0 : price;
  }
  return 0;
};

export const formatCurrency = (amount: number): string => {
  return amount.toFixed(2);
};

export const calculateItemTotal = (item: any): number => {
  const price = formatPrice(item.preco);
  const quantity = item.quantidade || 1;
  return price * quantity;
};

export const calculateCartTotal = (items: any[]): number => {
  return items.reduce((total, item) => total + calculateItemTotal(item), 0);
};
