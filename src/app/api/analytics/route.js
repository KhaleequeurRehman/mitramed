import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    // Check if database is connected
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: "Database not configured",
        message: "Please set DATABASE_URL environment variable"
      }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'month';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Calculate date range based on period
    let dateFilter = {};
    const now = new Date();
    
    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    } else {
      switch (period) {
        case 'month':
          dateFilter = {
            gte: new Date(now.getFullYear(), now.getMonth(), 1),
            lte: now
          };
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          dateFilter = {
            gte: new Date(now.getFullYear(), quarter * 3, 1),
            lte: now
          };
          break;
        case 'year':
          dateFilter = {
            gte: new Date(now.getFullYear(), 0, 1),
            lte: now
          };
          break;
      }
    }

    // Get minimal analytics data in parallel
    const [
      quotationStats,
      recentQuotations,
      statusBreakdown,
      allQuotationsStats
    ] = await Promise.all([
      // 1. Quotation Statistics (Only ACCEPTED status)
      prisma.quotation.aggregate({
        where: {
          created: dateFilter,
          status: 'ACCEPTED'
        },
        _count: true,
        _sum: {
          total: true,
          subtotal: true,
          advance: true,
          remaining: true
        },
      }),

      // 2. Recent Quotations (All statuses for recent activity)
      prisma.quotation.findMany({
        where: {
          created: dateFilter
        },
        orderBy: {
          created: 'desc'
        },
        take: 5,
        include: {
          items: true
        }
      }),

      // 3. Status Breakdown (All statuses for overview)
      prisma.quotation.groupBy({
        by: ['status'],
        where: {
          created: dateFilter
        },
        _count: true,
        _sum: {
          total: true
        }
      }),

      // 4. All Quotations Stats (For total count)
      prisma.quotation.aggregate({
        where: {
          created: dateFilter
        },
        _count: true
      })
    ]);

    // Process status breakdown
    const statusBreakdownData = statusBreakdown.map(status => ({
      status: status.status,
      count: status._count,
      totalValue: status._sum.total || 0
    }));

    // Calculate totals (Only from ACCEPTED quotations)
    const totalSalesValue = quotationStats._sum.total || 0;
    const totalAdvanceReceived = quotationStats._sum.advance || 0;
    const totalRemaining = quotationStats._sum.remaining || 0;
    const acceptedQuotationsCount = quotationStats._count || 0;
    const totalQuotationsCount = allQuotationsStats._count || 0;
    
    // Calculate average manually to avoid Prisma _avg issues
    const avgOrderValue = acceptedQuotationsCount > 0 ? totalSalesValue / acceptedQuotationsCount : 0;

    const analytics = {
      // Quotation Statistics
      quotations: {
        total: totalQuotationsCount,
        accepted: acceptedQuotationsCount,
        acceptedValue: totalSalesValue,
        acceptedAdvance: totalAdvanceReceived,
        acceptedRemaining: totalRemaining,
        avgAcceptedValue: avgOrderValue
      },

      // Recent Activity
      recentQuotations: recentQuotations.map(q => ({
        id: q.id,
        number: q.number,
        customerName: q.customer?.name || 'Unknown',
        total: q.total,
        status: q.status,
        created: q.created
      })),

      // Status Breakdown
      statusBreakdown: statusBreakdownData,

      // Financial Summary (Only ACCEPTED quotations)
      financial: {
        totalValue: totalSalesValue,
        advanceReceived: totalAdvanceReceived,
        pendingAmount: totalRemaining,
        avgQuotationValue: avgOrderValue.toFixed(2),
        acceptedQuotations: acceptedQuotationsCount,
        totalQuotations: totalQuotationsCount
      },

      // Period Info
      period: {
        type: period,
        startDate: dateFilter.gte,
        endDate: dateFilter.lte
      }
    };

    return NextResponse.json({
      success: true,
      analytics
    });

  } catch (err) {
    console.error("Analytics fetch error:", err);
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch analytics data",
      message: err.message
    }, { status: 500 });
  }
}