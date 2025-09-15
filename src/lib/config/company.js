// Company configuration and utility functions
export const companyConfig = {
  name: "Sino-K Medical Equipment Co., Ltd.",
  tagline: "Professional Medical Equipment Solutions",
  address: {
    street: "4/F, Bldg2, Veteran Ind.City",
    city: "Gongle Community, Xixiang Street",
    state: "Baoan District, Shenzhen",
    zipCode: "518000",
    country: "China"
  },
  contact: {
    phone: "755-23341807, 755-23341084",
    fax: "755-23204076",
    email: "sales04@sino-k.com",
    website: "www.sino-k.com"
  },
  taxInfo: {
    businessLicense: "91440300MA5XXXXXXX",
    taxNumber: "91440300MA5XXXXXXX"
  },
  bankDetails: {
    bankName: "Industrial and Commercial Bank of China",
    accountNumber: "4000029209201234567",
    swiftCode: "ICBKCNBJ",
    branch: "Shenzhen Branch"
  }
}

// Format address for display
export function formatAddress(address) {
  if (!address) return ""
  
  const parts = []
  if (address.street) parts.push(address.street)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.zipCode) parts.push(address.zipCode)
  if (address.country) parts.push(address.country)
  
  return parts.join(", ")
}

// Format date for display
export function formatDate(date, options = {}) {
  if (!date) return ""
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
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

// Format currency for display
export function formatCurrency(amount, currency = 'CNY') {
  if (amount === null || amount === undefined) return ""
  
  try {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  } catch (error) {
    console.error('Error formatting currency:', error)
    return `¥${amount.toFixed(2)}`
  }
}

// Format phone number for display
export function formatPhone(phone) {
  if (!phone) return ""
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  // Format Indian phone numbers
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`
  } else if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
  }
  
  return phone
}
