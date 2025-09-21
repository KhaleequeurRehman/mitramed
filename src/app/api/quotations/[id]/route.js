import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { quotationUpdateSchema } from "@/lib/validators";
import { formatDecimal } from "@/lib/utils";

export async function GET(req, { params }) {
  try {
    // Await params in Next.js 15
    const { id } = await params;
    
    // Validate params.id
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ 
        error: "Invalid quotation ID" 
      }, { status: 400 });
    }

    const quotation = await prisma.quotation.findUnique({ 
      where: { id }
    });
    
    if (!quotation) {
      return NextResponse.json({ 
        error: "Quotation not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      quotation
    });
  } catch (err) {
    console.error("Quotation fetch error:", err);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}


export async function PUT(req, { params }) {
  try {
    // Await params in Next.js 15
    const { id } = await params;
    
    // Validate params.id
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ 
        error: "Invalid quotation ID" 
      }, { status: 400 });
    }

    // Check if quotation exists
    const existing = await prisma.quotation.findUnique({ 
      where: { id } 
    });
    
    if (!existing) {
      return NextResponse.json({ 
        error: "Quotation not found" 
      }, { status: 404 });
    }

    // Parse and validate request body
    const body = await req.json();
    
    // Validate the quotation data using update schema (all fields optional)
    const validationResult = quotationUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        error: "Validation failed",
        details: validationResult.error.errors
      }, { status: 400 });
    }

    const validatedData = validationResult.data;

    // Prepare update data - only include fields that are provided
    const updateData = {};

    // Update customer if provided
    if (validatedData.customer) {
      updateData.customer = {
        name: validatedData.customer.name || existing.customer.name,
        contactPerson: validatedData.customer.contactPerson || existing.customer.contactPerson,
        email: validatedData.customer.email || existing.customer.email,
        phone: validatedData.customer.phone || existing.customer.phone,
        whatsapp: validatedData.customer.whatsapp || existing.customer.whatsapp,
        wechat: validatedData.customer.wechat || existing.customer.wechat,
        street: validatedData.customer.address?.street || existing.customer.street,
        city: validatedData.customer.address?.city || existing.customer.city,
        state: validatedData.customer.address?.state || existing.customer.state,
        postal: validatedData.customer.address?.postal || existing.customer.postal,
        country: validatedData.customer.address?.country || existing.customer.country
      };
    }


    // Update shipment if provided
    if (validatedData.shipment) {
      updateData.shipment = {
        address: {
          street: validatedData.shipment.address?.street || existing.shipment.address.street,
          city: validatedData.shipment.address?.city || existing.shipment.address.city,
          state: validatedData.shipment.address?.state || existing.shipment.address.state,
          postal: validatedData.shipment.address?.postal || existing.shipment.address.postal,
          country: validatedData.shipment.address?.country || existing.shipment.address.country
        },
        method: validatedData.shipment.method || existing.shipment.method,
        cost: formatDecimal(validatedData.shipment.cost !== undefined ? validatedData.shipment.cost : existing.shipment.cost),
        tracking: validatedData.shipment.tracking || existing.shipment.tracking,
        status: validatedData.shipment.status || existing.shipment.status,
        eta: validatedData.shipment.eta ? new Date(validatedData.shipment.eta) : existing.shipment.eta,
        deliveredAt: validatedData.shipment.deliveredAt ? new Date(validatedData.shipment.deliveredAt) : existing.shipment.deliveredAt,
        terms: validatedData.shipment.terms || existing.shipment.terms,
        notes: validatedData.shipment.notes || existing.shipment.notes
      };
    }

    // Update items if provided
    if (validatedData.items) {
      const quotationItems = validatedData.items.map(item => {
        const quantity = formatDecimal(item.quantity);
        const costPrice = formatDecimal(item.costPrice);
        const sellingPrice = formatDecimal(item.sellingPrice);
        const total = formatDecimal(quantity * sellingPrice);
        
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
        };
      });
      updateData.items = quotationItems;
    }

    // Update other fields if provided
    if (validatedData.validUntil !== undefined) {
      updateData.validUntil = validatedData.validUntil ? new Date(validatedData.validUntil) : null;
    }
    if (validatedData.paymentTerms !== undefined) {
      updateData.paymentTerms = validatedData.paymentTerms;
    }
    if (validatedData.discount !== undefined) {
      updateData.discount = formatDecimal(validatedData.discount);
    }
    if (validatedData.tax !== undefined) {
      updateData.tax = formatDecimal(validatedData.tax);
    }
    if (validatedData.remarks !== undefined) {
      updateData.remarks = validatedData.remarks;
    }
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;
    }

    // Recalculate totals if items, discount, or tax changed
    if (validatedData.items || validatedData.discount !== undefined || validatedData.tax !== undefined) {
      const items = updateData.items || existing.items;
      const subtotal = formatDecimal(items.reduce((sum, item) => sum + item.total, 0));
      const discount = updateData.discount !== undefined ? updateData.discount : existing.discount || 0;
      const tax = updateData.tax !== undefined ? updateData.tax : existing.tax || 0;
      const total = formatDecimal(subtotal - discount + tax);
      const advance = updateData.paymentTerms ? (total * parseFloat(updateData.paymentTerms)) / 100 : existing.advance || 0;
      const remaining = formatDecimal(total - advance);

      updateData.subtotal = subtotal;
      updateData.total = total;
      updateData.advance = advance;
      updateData.remaining = remaining;
    }

    // Update the quotation
    const updatedQuotation = await prisma.quotation.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      quotation: updatedQuotation,
      message: "Quotation updated successfully"
    });

  } catch (err) {
    console.error("Quotation update error:", err);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    // Await params in Next.js 15
    const { id } = await params;
    
    // Validate params.id
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ 
        error: "Invalid quotation ID" 
      }, { status: 400 });
    }

    const existing = await prisma.quotation.findUnique({ 
      where: { id } 
    });
    
    if (!existing) {
      return NextResponse.json({ 
        error: "Quotation not found" 
      }, { status: 404 });
    }

    await prisma.quotation.delete({ where: { id } });
    
    return NextResponse.json({ 
      success: true,
      message: "Quotation deleted successfully" 
    });
  } catch (err) {
    console.error("Quotation deletion error:", err);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
