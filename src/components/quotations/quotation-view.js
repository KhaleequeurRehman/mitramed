"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer } from "lucide-react"
import { useRouter } from "next/navigation"
import { companyConfig, formatAddress, formatDate } from "@/lib/config/company"
import Image from "next/image"

export function QuotationView({ quotationId }) {
  const [quotation, setQuotation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const response = await fetch(`/api/quotations/${quotationId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch quotation')
        }
        const data = await response.json()
        setQuotation(data.quotation)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuotation()
  }, [quotationId])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!quotation) {
    return <div>Quotation not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center no-print">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            Quotation #{quotation?.number}
          </h1>
        </div>
        <div className="flex mr-4">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Proforma Invoice Template */}
      <div className="proforma-invoice print-card">
        <div className="header">
          <div className="company-info">
            {/* <h2>{companyConfig?.name}</h2>
            <p>Innovative Healthcare Solutions</p> */}
            <Image src={"/mitramed.webp"} alt={companyConfig?.name} width={150} height={150} style={{marginTop: "-40px"}} />
          </div>
          <div className="contact-info">
            Add: {formatAddress(companyConfig?.address || "")}<br />
            Tel: {companyConfig?.contact?.phone}<br />
            Fax: {companyConfig?.contact?.fax}<br />
            Email: {companyConfig?.contact?.email}<br />
            Website: {companyConfig?.contact?.website}
          </div>
        </div>

        <div className="proforma-container">
          <div className="proforma-title">Proforma Invoice</div>
          <table className="invoice-details">
            <tbody>
              <tr style={{ border: '1px solid #000',borderTop:'none' }}>
                <td width="50%" style={{ borderRight: '1px solid #000' }}>
                  Bill To: {quotation?.customer?.name}<br />
                  Add: {formatAddress(quotation?.customer)}<br />
                  Contacts: {quotation?.customer?.phone}
                </td>
                <td width="50%">
                  Invoice No: {quotation?.number}<br />
                  Issue Date: {formatDate(quotation?.created)}<br />
                  Valid Date: {quotation?.validUntil ? formatDate(quotation?.validUntil) : "30 Days"}<br />
                  Payment Term: {quotation?.paymentTerms || "Net 30"}<br />
                  Delivery By: {quotation?.shipment?.method}<br />
                  Delivery Date: {formatDate(quotation?.shipment?.eta)}<br />
                  Issued: {companyConfig?.issuedBy}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="ship">
          Ship To: {quotation?.shipment?.address ? 
            formatAddress(quotation?.shipment?.address) : 
            "The same as above"
          }
        </div>

        <div className="remarks">
          Remarks: {quotation?.remarks || "The price is EXW, please pay the both bank charges. Please send us the remittance slip"}
        </div>

        <table className="items">
          <thead>
            <tr>
              <th>Item</th>
              <th>P/N</th>
              <th>Description</th>
              <th>QTY</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {quotation?.items && Array.isArray(quotation?.items) && quotation?.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.sku || "-"}</td>
                <td>{item?.name || 'N/A'}</td>
                <td>{item?.quantity || 'N/A'}</td>
                <td>{item?.sellingPrice?.toFixed(2) || 'N/A'}</td>
                <td>{item?.total?.toFixed(2) || 'N/A'}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td> </td>
              <td> </td>
              <td><strong>TOTAL IN RMB</strong></td>
              <td> </td>
              <td> </td>
              <td>{quotation?.total?.toFixed(2) || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .proforma-invoice {
          font-family: Arial, sans-serif;
          font-size: 13px;
          margin: 20px;
          color: #000;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header {
          display: flex;
          justify-content: space-between;
          padding-bottom: 4px;
          margin-bottom: 6px;
        }

        .company-info h2 {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
        }

        .company-info p {
          margin: 2px 0 0 0;
        }

        .contact-info {
          text-align: left;
          font-size: 12px;
          line-height: 1.4;
          max-width: 350px;
          word-wrap: break-word;
        }

        .proforma-container {
          // border: 1px solid #000;
          margin-bottom: 6px;
        }

        .proforma-title {
          text-align: center;
          font-size: 15px;
          font-weight: bold;
          border: 1px solid #000;
          padding: 4px;
          background-color: #fff;
        }

        .invoice-details {
          width: 100%;
          border-collapse: collapse;
        }

        .invoice-details td {
          padding: 4px 6px;
          vertical-align: top;
          font-weight: normal;
        }

        .ship, .remarks {
          border: 1px solid #000;
          padding: 4px 6px;
          margin-bottom: 6px;
          font-weight: bold;
        }

        .items {
          width: 100%;
          border-collapse: collapse;
          margin-top: 6px;
        }

        .items th, .items td {
          border: 1px solid #000;
          padding: 4px 6px;
          font-size: 13px;
        }

        .items th {
          text-align: center;
          font-weight: bold;
        //   background: #f9f9f9;
        }

        .items td {
          text-align: center;
          font-weight: normal;
        }

        .items td:nth-child(3) {
          text-align: center;
        }

        .total-row td {
          font-weight: bold;
          text-align: center;
        //   background-color: #f9f9f9;
        }

        @media print {
          .proforma-invoice {
            margin: 0 !important;
            font-size: 12px;
            background-color: #fff !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: none !important;
          }
          
          .header {
            margin-bottom: 4px;
          }
          
          .proforma-container {
            margin-bottom: 4px;
          }
          
          .ship, .remarks {
            margin-bottom: 4px;
          }
        }

        @media print {
          :global(.max-w-4xl) {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }

        /* Dark mode overrides */
        :global(.dark) .proforma-invoice {
          background-color: #fff !important;
          color: #000 !important;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }

        :global(.dark) .proforma-invoice * {
          color: #000 !important;
        }

        :global(.dark) .proforma-invoice .proforma-title {
          background-color: #fff !important;
          color: #000 !important;
        }

        :global(.dark) .proforma-invoice .items th {
          background-color: #f9f9f9 !important;
          color: #000 !important;
        }

        :global(.dark) .proforma-invoice .total-row td {
          background-color: #f9f9f9 !important;
          color: #000 !important;
        }
      `}</style>
    </div>
  )
}
