"use server"

export async function createQuotation(formData) {
  try {
    // Call API directly - validation already done client-side
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const apiUrl = `${baseUrl}/api/quotations`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create quotation')
    }
      
    const result = await response.json()
    return { success: true, data: result }
      
  } catch (error) {
    // API or other errors
    return { success: false, error: error.message || "Failed to create quotation" }
  }
}

export async function updateQuotation(id, formData) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const apiUrl = `${baseUrl}/api/quotations/${id}`
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update quotation')
    }
      
    const result = await response.json()
    return { success: true, data: result }
      
  } catch (error) {
    return { success: false, error: error.message || "Failed to update quotation" }
  }
}


export async function getQuotations(searchParams = {}) {
  try {
    // Handle searchParams properly for static generation
    const resolvedParams = searchParams || {}
    
    // Build query parameters
    const params = new URLSearchParams()
    
    if (resolvedParams.page) params.set("page", resolvedParams.page.toString())
    if (resolvedParams.limit) params.set("limit", resolvedParams.limit.toString())
    if (resolvedParams.search) params.set("search", resolvedParams.search)
    if (resolvedParams.status && resolvedParams.status !== "ALL") params.set("status", resolvedParams.status)
    if (resolvedParams.dateFrom) params.set("dateFrom", resolvedParams.dateFrom)
    if (resolvedParams.dateTo) params.set("dateTo", resolvedParams.dateTo)
    
    // Call API endpoint - fallback to relative URL if env var not set
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const apiUrl = `${baseUrl}/api/quotations?${params.toString()}`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch quotations')
    }
    
    const result = await response.json()
    return result
    
  } catch (error) {
    console.error('Error fetching quotations:', error)
    throw new Error('Failed to fetch quotations')
  }
}
