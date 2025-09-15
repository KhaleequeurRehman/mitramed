import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "N/A"
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date) {
  if (!date) return "N/A"
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date) {
  if (!date) return "N/A"
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// Helper function to format decimal values to max 2 decimal places
export function formatDecimal(value) {
  if (typeof value === 'number') {
    return Math.round(value * 100) / 100
  }
  if (typeof value === 'string') {
    const num = parseFloat(value)
    return isNaN(num) ? 0 : Math.round(num * 100) / 100
  }
  return 0
}

// Helper function to validate decimal places (max 2)
export function validateDecimalPlaces(value) {
  if (typeof value === 'number') {
    return value.toString().split('.')[1]?.length <= 2 || !value.toString().includes('.')
  }
  if (typeof value === 'string') {
    const num = parseFloat(value)
    if (isNaN(num)) return false
    return num.toString().split('.')[1]?.length <= 2 || !num.toString().includes('.')
  }
  return false
}
