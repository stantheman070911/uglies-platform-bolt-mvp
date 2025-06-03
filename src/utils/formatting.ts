import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { CURRENCY_SYMBOLS } from './constants';

/**
 * Format a price with the appropriate currency symbol
 */
export function formatPrice(
  amount: number, 
  currencyCode: string = 'USD', 
  options: Intl.NumberFormatOptions = {}
): string {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    }).format(amount);
  } catch (error) {
    // Fallback formatting if currency code is invalid
    return `${symbol}${amount.toFixed(2)}`;
  }
}

/**
 * Format a date string
 */
export function formatDate(
  dateString: string, 
  formatString: string = 'MMM dd, yyyy'
): string {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Get a relative time string (e.g. "3 days ago")
 */
export function getRelativeTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format a number with thousands separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Truncate a string to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Convert camelCase to Title Case
 */
export function camelToTitleCase(camelCase: string): string {
  // Replace camelCase with spaces
  const spacedText = camelCase.replace(/([A-Z])/g, ' $1');
  
  // Capitalize first letter and return
  return spacedText.charAt(0).toUpperCase() + spacedText.slice(1);
}