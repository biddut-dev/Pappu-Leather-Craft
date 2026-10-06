/**
 * Pappu Leather Craft - Formatters and Helpers
 */

export function formatPrice(amount: number, symbol = "৳"): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${symbol}0`;
  }
  // Format with standard commas for thousands
  const formatted = Math.round(amount).toLocaleString("en-BD");
  return `${symbol}${formatted}`;
}

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `PLC-${year}${month}${day}-${randomSuffix}`;
}

export function calculateDiscountPercentage(original: number, discounted?: number): number {
  if (!discounted || discounted >= original || original <= 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}
