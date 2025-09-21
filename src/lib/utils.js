import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "N/A"
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

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


export function formatAddress(address) {
  if (!address) return ""
  
  const parts = []
  if (address.street) parts.push(address.street)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.zipCode || address.postal) parts.push(address.zipCode || address.postal)
  if (address.country) parts.push(address.country)
  
  return parts.join(", ")
}

export function formatDate(date, options = {}) {
  if (!date) return ""
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  
  const formatOptions = { ...defaultOptions, ...options }
  
  try {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('en-IN', formatOptions)
  } catch (error) {
    console.error('Error formatting date:', error)
    return date.toString()
  }
}

export const getStatusColor = (status) => {
  switch (status) {
    case 'DRAFT': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
    case 'ACCEPTED': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
    case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
    case 'EXPIRED': return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}