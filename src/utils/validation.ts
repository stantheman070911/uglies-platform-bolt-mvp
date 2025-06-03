import { MIN_PASSWORD_LENGTH } from './constants';

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

/**
 * Password validation
 * At least one uppercase, one lowercase, one number, and minimum length
 */
export const isStrongPassword = (password: string): boolean => {
  if (password.length < MIN_PASSWORD_LENGTH) return false;
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber;
};

/**
 * Password error message
 */
export const getPasswordErrorMessage = (password: string): string => {
  if (!password) return 'Password is required';
  
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return '';
};

/**
 * URL validation
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Price validation
 */
export const isValidPrice = (price: number): boolean => {
  return price > 0 && isFinite(price);
};

/**
 * Date validation (must be in the future)
 */
export const isFutureDate = (date: string): boolean => {
  const inputDate = new Date(date);
  const now = new Date();
  return inputDate > now;
};

/**
 * Date range validation
 */
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};