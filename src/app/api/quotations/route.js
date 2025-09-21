import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { quotationCreateSchema as CreateQuotationSchema } from '@/lib/validators'
import { formatDecimal } from '@/lib/utils'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate the input data using the schema
    const validatedData = CreateQuotationSchema.parse(body)
    
    // Prepare customer and vendor data as embedded objects
    const customerData = {
          name: validatedData.customer.name,
          contactPerson: validatedData.customer.contactPerson || null,
          email: validatedData.customer.email,
          phone: validatedData.customer.phone,
          whatsapp: validatedData.customer.whatsapp || null,
          wechat: validatedData.customer.wechat || null,
          street: validatedData.customer.address.street,
          city: validatedData.customer.address.city,
          state: validatedData.customer.address.state,
          postal: validatedData.customer.address.postal,
          country: validatedData.customer.address.country
        }
    
      
    // Prepare quotation items
    const quotationItems = validatedData.items.map(item => {
      const quantity = formatDecimal(item.quantity)
      const costPrice = formatDecimal(item.costPrice)
      const sellingPrice = formatDecimal(item.sellingPrice)
      const total = formatDecimal(quantity * sellingPrice)
      
      return {
        name: item.name,
        productNumber: item.productNumber,
        description: item.description,
        category: item.category,
        quantity: quantity,
        unit: item.unit,
        costPrice: costPrice,
        sellingPrice: sellingPrice,
        total: total,
        vendor: {
          name: item.vendor.name,
          contactPerson: item.vendor.contactPerson,
          email: item.vendor.email,
          phone: item.vendor.phone,
          whatsapp: item.vendor.whatsapp,
          wechat: item.vendor.wechat,
          street: item.vendor.address.street,
          city: item.vendor.address.city,
          state: item.vendor.address.state,
          postal: item.vendor.address.postal,
          country: item.vendor.address.country
        }
      }
    })
      
      // Calculate totals from items
      const subtotal = formatDecimal(quotationItems.reduce((sum, item) => sum + item.total, 0))
      const discount = formatDecimal(validatedData.discount || 0)
      const tax = formatDecimal(validatedData.tax || 0)
      const total = formatDecimal(subtotal - discount + tax)
      
      // Get the count of existing quotations for sequential numbering
      const quotationCount = await prisma.quotation.count()
      
      const quotationData = {
        number: `QT-${String(quotationCount + 1).padStart(4, '0')}`,
      customer: customerData,
        shipment: {
            address: {
              street: validatedData.shipment.address.street,
              city: validatedData.shipment.address.city,
              state: validatedData.shipment.address.state,
              postal: validatedData.shipment.address.postal,
              country: validatedData.shipment.address.country
            },
            method: validatedData.shipment.method,
            cost: formatDecimal(validatedData.shipment.cost),
            tracking: validatedData.shipment.tracking,
            status: validatedData.shipment.status,
            eta: new Date(validatedData.shipment.eta),
            deliveredAt: new Date(validatedData.shipment.deliveredAt),
            terms: validatedData.shipment.terms,
            notes: validatedData.shipment.notes
        },
        items: quotationItems,
        validUntil: validatedData.validUntil ? new Date(validatedData.validUntil) : null,
        paymentTerms: validatedData.paymentTerms,
        advance: 0,
        remaining: total,
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        total: total,
        remarks: validatedData.remarks,
        status: 'DRAFT'
      }

      // Create the quotation
    const quotation = await prisma.quotation.create({
        data: quotationData
    })

    return NextResponse.json({
      success: true,
      message: 'Quotation created successfully',
      data: { quotation }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating quotation:', error)
    
    // Handle validation errors specifically
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Validation failed', errors: error.errors },
        { status: 400 }
      )
    }
    
    // Handle transaction errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Duplicate entry found (e.g., duplicate SKU or email)' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { message: 'Failed to create quotation', error: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get("page")) || 1
    const limit = parseInt(searchParams.get("limit")) || 10
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const dateFrom = searchParams.get("dateFrom") || ""
    const dateTo = searchParams.get("dateTo") || ""
    const sortBy = searchParams.get("sortBy") || "created_desc"
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where = {}
    
    if (search) {
      where.OR = [
        { number: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { email: { contains: search, mode: 'insensitive' } } },
        { vendor: { name: { contains: search, mode: 'insensitive' } } },
        { vendor: { email: { contains: search, mode: 'insensitive' } } }
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (dateFrom || dateTo) {
      where.created = {}
      if (dateFrom) {
        where.created.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.created.lte = new Date(dateTo + 'T23:59:59.999Z')
      }
    }
    
    // Get total count for pagination
    const total = await prisma.quotation.count({ where })
    const totalPages = Math.ceil(total / limit)
    
    // Build orderBy clause based on sortBy parameter
    let orderBy = {}
    switch (sortBy) {
      case 'created_desc':
        orderBy = { created: 'desc' }
        break
      case 'created_asc':
        orderBy = { created: 'asc' }
        break
      case 'total_desc':
        orderBy = { total: 'desc' }
        break
      case 'total_asc':
        orderBy = { total: 'asc' }
        break
      default:
        orderBy = { created: 'desc' } // Default sorting
    }

    // Get quotations with pagination
    const quotations = await prisma.quotation.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        items: true
      }
    })
    
    return NextResponse.json({
      quotations,
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error fetching quotations:', error)
    return NextResponse.json(
      { message: 'Failed to fetch quotations', error: error.message },
      { status: 500 }
    )
  }
}
