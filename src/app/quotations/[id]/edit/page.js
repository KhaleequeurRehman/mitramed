"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Save, ArrowLeft, Loader2 } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { updateQuotation } from "@/lib/actions/quotations"
import { quotationUpdateSchema } from "@/lib/validators"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function EditQuotationPage({ params }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [quotation, setQuotation] = useState(null)
  const [error, setError] = useState(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quotationUpdateSchema),
    defaultValues: {
      customer: {
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        whatsapp: "",
        wechat: "",
        address: {
          street: "",
          city: "",
          state: "",
          postal: "",
          country: ""
        }
      },
      status: "DRAFT",
      validUntil: "",
      paymentTerms: "",
      discount: "",
      tax: "",
      remarks: "",
      shipment: {
        address: {
          street: "",
          city: "",
          state: "",
          postal: "",
          country: ""
        },
        method: "",
        cost: "",
        tracking: "",
        status: "PROCESSING",
        eta: "",
        deliveredAt: "",
        terms: "",
        notes: ""
      },
      items: [
        {
          name: "",
          productNumber: "",
          description: "",
          category: "",
          quantity: "",
          unit: "",
          costPrice: "",
          sellingPrice: "",
          vendor: {
            name: "",
            contactPerson: "",
            email: "",
            phone: "",
            whatsapp: "",
            wechat: "",
            address: {
              street: "",
              city: "",
              state: "",
              postal: "",
              country: ""
            }
          }
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  })

  // Load quotation data
  useEffect(() => {
    const loadQuotation = async () => {
      try {
        const { id } = await params
        const response = await fetch(`/api/quotations/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch quotation')
        }
        
        const data = await response.json()
        const quotationData = data.quotation
        
        setQuotation(quotationData)
        
        // Populate form with existing data
        setValue("customer", {
          name: quotationData.customer?.name || "",
          contactPerson: quotationData.customer?.contactPerson || "",
          email: quotationData.customer?.email || "",
          phone: quotationData.customer?.phone || "",
          whatsapp: quotationData.customer?.whatsapp || "",
          wechat: quotationData.customer?.wechat || "",
          address: {
            street: quotationData.customer?.street || "",
            city: quotationData.customer?.city || "",
            state: quotationData.customer?.state || "",
            postal: quotationData.customer?.postal || "",
            country: quotationData.customer?.country || ""
          }
        })
        
        
        setValue("status", quotationData.status || "DRAFT")
        setValue("validUntil", quotationData.validUntil ? new Date(quotationData.validUntil).toISOString().split('T')[0] : "")
        setValue("paymentTerms", quotationData.paymentTerms || "")
        setValue("discount", quotationData.discount?.toString() || "")
        setValue("tax", quotationData.tax?.toString() || "")
        setValue("remarks", quotationData.remarks || "")
        
        setValue("shipment", {
          address: {
            street: quotationData.shipment?.address?.street || "",
            city: quotationData.shipment?.address?.city || "",
            state: quotationData.shipment?.address?.state || "",
            postal: quotationData.shipment?.address?.postal || "",
            country: quotationData.shipment?.address?.country || ""
          },
          method: quotationData.shipment?.method || "",
          cost: quotationData.shipment?.cost?.toString() || "",
          tracking: quotationData.shipment?.tracking || "",
          status: quotationData.shipment?.status || "PROCESSING",
          eta: quotationData.shipment?.eta ? new Date(quotationData.shipment.eta).toISOString().split('T')[0] : "",
          deliveredAt: quotationData.shipment?.deliveredAt ? new Date(quotationData.shipment.deliveredAt).toISOString().split('T')[0] : "",
          terms: quotationData.shipment?.terms || "",
          notes: quotationData.shipment?.notes || ""
        })
        
        // Set items
        if (quotationData.items && quotationData.items.length > 0) {
          setValue("items", quotationData.items.map(item => ({
            name: item.name || "",
            productNumber: item.productNumber || "",
            description: item.description || "",
            category: item.category || "",
            quantity: item.quantity?.toString() || "",
            unit: item.unit || "",
            costPrice: item.costPrice?.toString() || "",
            sellingPrice: item.sellingPrice?.toString() || "",
            vendor: {
              name: item.vendor?.name || "",
              contactPerson: item.vendor?.contactPerson || "",
              email: item.vendor?.email || "",
              phone: item.vendor?.phone || "",
              whatsapp: item.vendor?.whatsapp || "",
              wechat: item.vendor?.wechat || "",
              address: {
                street: item.vendor?.street || "",
                city: item.vendor?.city || "",
                state: item.vendor?.state || "",
                postal: item.vendor?.postal || "",
                country: item.vendor?.country || ""
              }
            }
          })))
        }
        
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load quotation")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadQuotation()
  }, [params, setValue])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      const { id } = await params
      const result = await updateQuotation(id, data)
      
      if (result.success) {
        toast.success("Quotation updated successfully!")
        router.push(`/quotations/${id}`)
      } else {
        toast.error(result.error || "Failed to update quotation")
      }
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Failed to update quotation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addItem = () => {
    append({
      name: "",
      productNumber: "",
      description: "",
      category: "",
      quantity: "",
      unit: "",
      costPrice: "",
      sellingPrice: "",
      vendor: {
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        whatsapp: "",
        wechat: "",
        address: {
          street: "",
          city: "",
          state: "",
          postal: "",
          country: ""
        }
      }
    })
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!quotation) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Quotation not found</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }


  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Quotation</h1>
              <p className="text-sm text-muted-foreground">
                Quotation #{quotation.quotationNumber}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer.name">Customer Name *</Label>
                  <Input
                    id="customer.name"
                    {...register("customer.name")}
                    placeholder="Enter customer name"
                  />
                  {errors.customer?.name && (
                    <p className="text-sm text-red-600">{errors.customer.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer.contactPerson">Contact Person</Label>
                  <Input
                    id="customer.contactPerson"
                    {...register("customer.contactPerson")}
                    placeholder="Enter contact person"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer.email">Email *</Label>
                  <Input
                    id="customer.email"
                    type="email"
                    {...register("customer.email")}
                    placeholder="Enter email"
                    autoComplete="email"
                  />
                  {errors.customer?.email && (
                    <p className="text-sm text-red-600">{errors.customer.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer.phone">Phone *</Label>
                  <Input
                    id="customer.phone"
                    type="tel"
                    {...register("customer.phone")}
                    placeholder="Enter phone number"
                    autoComplete="tel"
                  />
                  {errors.customer?.phone && (
                    <p className="text-sm text-red-600">{errors.customer.phone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer.whatsapp">WhatsApp</Label>
                  <Input
                    id="customer.whatsapp"
                    type="tel"
                    {...register("customer.whatsapp")}
                    placeholder="Enter WhatsApp number"
                    autoComplete="tel"
                  />
                  {errors.customer?.whatsapp && (
                    <p className="text-sm text-red-600">{errors.customer.whatsapp.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer.wechat">WeChat</Label>
                  <Input
                    id="customer.wechat"
                    {...register("customer.wechat")}
                    placeholder="Enter WeChat ID"
                  />
                  {errors.customer?.wechat && (
                    <p className="text-sm text-red-600">{errors.customer.wechat.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Customer Address</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Input
                      {...register("customer.address.street")}
                      placeholder="Street Address"
                    />
                    {errors.customer?.address?.street && (
                      <p className="text-sm text-red-600">{errors.customer.address.street.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      {...register("customer.address.city")}
                      placeholder="City"
                    />
                    {errors.customer?.address?.city && (
                      <p className="text-sm text-red-600">{errors.customer.address.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      {...register("customer.address.state")}
                      placeholder="State"
                    />
                    {errors.customer?.address?.state && (
                      <p className="text-sm text-red-600">{errors.customer.address.state.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      {...register("customer.address.postal")}
                      placeholder="Postal Code"
                    />
                    {errors.customer?.address?.postal && (
                      <p className="text-sm text-red-600">{errors.customer.address.postal.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      {...register("customer.address.country")}
                      placeholder="Country"
                    />
                    {errors.customer?.address?.country && (
                      <p className="text-sm text-red-600">{errors.customer.address.country.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Quotation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Quotation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="SENT">Sent</SelectItem>
                          <SelectItem value="ACCEPTED">Accepted</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    {...register("validUntil")}
                  />
                  {errors.validUntil && (
                    <p className="text-sm text-red-600">{errors.validUntil.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Input
                    id="paymentTerms"
                    {...register("paymentTerms")}
                    placeholder="e.g., Net 30"
                  />
                  {errors.paymentTerms && (
                    <p className="text-sm text-red-600">{errors.paymentTerms.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    id="discount"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("discount")}
                    placeholder="0.00"
                  />
                  {errors.discount && (
                    <p className="text-sm text-red-600">{errors.discount.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax</Label>
                  <Input
                    id="tax"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("tax")}
                    placeholder="0.00"
                  />
                  {errors.tax && (
                    <p className="text-sm text-red-600">{errors.tax.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  {...register("remarks")}
                  placeholder="Enter any additional remarks"
                  rows={3}
                />
                {errors.remarks && (
                  <p className="text-sm text-red-600">{errors.remarks.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Shipment Address</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Input
                      {...register("shipment.address.street")}
                      placeholder="Street Address"
                    />
                    {errors.shipment?.address?.street && (
                      <p className="text-sm text-red-600">{errors.shipment.address.street.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      {...register("shipment.address.city")}
                      placeholder="City"
                    />
                    {errors.shipment?.address?.city && (
                      <p className="text-sm text-red-600">{errors.shipment.address.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      {...register("shipment.address.state")}
                      placeholder="State"
                    />
                    {errors.shipment?.address?.state && (
                      <p className="text-sm text-red-600">{errors.shipment.address.state.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      {...register("shipment.address.postal")}
                      placeholder="Postal Code"
                    />
                    {errors.shipment?.address?.postal && (
                      <p className="text-sm text-red-600">{errors.shipment.address.postal.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      {...register("shipment.address.country")}
                      placeholder="Country"
                    />
                    {errors.shipment?.address?.country && (
                      <p className="text-sm text-red-600">{errors.shipment.address.country.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipment.method">Shipping Method</Label>
                  <Input
                    id="shipment.method"
                    {...register("shipment.method")}
                    placeholder="e.g., Standard Shipping"
                  />
                  {errors.shipment?.method && (
                    <p className="text-sm text-red-600">{errors.shipment.method.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipment.cost">Shipping Cost</Label>
                  <Input
                    id="shipment.cost"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("shipment.cost")}
                    placeholder="0.00"
                  />
                  {errors.shipment?.cost && (
                    <p className="text-sm text-red-600">{errors.shipment.cost.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipment.tracking">Tracking Number</Label>
                  <Input
                    id="shipment.tracking"
                    {...register("shipment.tracking")}
                    placeholder="Enter tracking number"
                  />
                  {errors.shipment?.tracking && (
                    <p className="text-sm text-red-600">{errors.shipment.tracking.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipment.status">Status</Label>
                  <Controller
                    name="shipment.status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PROCESSING">Processing</SelectItem>
                          <SelectItem value="SHIPPED">Shipped</SelectItem>
                          <SelectItem value="DELIVERED">Delivered</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.shipment?.status && (
                    <p className="text-sm text-red-600">{errors.shipment.status.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipment.eta">ETA</Label>
                  <Input
                    id="shipment.eta"
                    type="date"
                    {...register("shipment.eta")}
                  />
                  {errors.shipment?.eta && (
                    <p className="text-sm text-red-600">{errors.shipment.eta.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipment.deliveredAt">Delivered At</Label>
                  <Input
                    id="shipment.deliveredAt"
                    type="date"
                    {...register("shipment.deliveredAt")}
                  />
                  {errors.shipment?.deliveredAt && (
                    <p className="text-sm text-red-600">{errors.shipment.deliveredAt.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipment.terms">Terms</Label>
                  <Input
                    id="shipment.terms"
                    {...register("shipment.terms")}
                    placeholder="e.g., FOB Destination"
                  />
                  {errors.shipment?.terms && (
                    <p className="text-sm text-red-600">{errors.shipment.terms.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipment.notes">Notes</Label>
                  <Input
                    id="shipment.notes"
                    {...register("shipment.notes")}
                    placeholder="Additional notes"
                  />
                  {errors.shipment?.notes && (
                    <p className="text-sm text-red-600">{errors.shipment.notes.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Items</CardTitle>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`items.${index}.name`}>Item Name *</Label>
                      <Input
                        id={`items.${index}.name`}
                        {...register(`items.${index}.name`)}
                        placeholder="Enter item name"
                      />
                      {errors.items?.[index]?.name && (
                        <p className="text-sm text-red-600">{errors.items[index].name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`items.${index}.productNumber`}>Product Number</Label>
                      <Input
                        id={`items.${index}.productNumber`}
                        {...register(`items.${index}.productNumber`)}
                        placeholder="Enter product number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`items.${index}.category`}>Category</Label>
                      <Input
                        id={`items.${index}.category`}
                        {...register(`items.${index}.category`)}
                        placeholder="Enter category"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`items.${index}.quantity`}>Quantity *</Label>
                      <Input
                        id={`items.${index}.quantity`}
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...register(`items.${index}.quantity`)}
                        placeholder="0"
                      />
                      {errors.items?.[index]?.quantity && (
                        <p className="text-sm text-red-600">{errors.items[index].quantity.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`items.${index}.unit`}>Unit</Label>
                      <Input
                        id={`items.${index}.unit`}
                        {...register(`items.${index}.unit`)}
                        placeholder="e.g., pcs, kg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`items.${index}.costPrice`}>Cost Price *</Label>
                      <Input
                        id={`items.${index}.costPrice`}
                        type="number"
                        step="0.01"
                        min="0"
                        {...register(`items.${index}.costPrice`)}
                        placeholder="0.00"
                      />
                      {errors.items?.[index]?.costPrice && (
                        <p className="text-sm text-red-600">{errors.items[index].costPrice.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`items.${index}.sellingPrice`}>Selling Price *</Label>
                      <Input
                        id={`items.${index}.sellingPrice`}
                        type="number"
                        step="0.01"
                        min="0"
                        {...register(`items.${index}.sellingPrice`)}
                        placeholder="0.00"
                      />
                      {errors.items?.[index]?.sellingPrice && (
                        <p className="text-sm text-red-600">{errors.items[index].sellingPrice.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`items.${index}.description`}>Description</Label>
                    <Textarea
                      id={`items.${index}.description`}
                      {...register(`items.${index}.description`)}
                      placeholder="Enter item description"
                      rows={2}
                    />
                  </div>

                  {/* Vendor Information for this item */}
                  <div className="border-t pt-4">
                    <h5 className="font-medium mb-4">Vendor Information *</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.vendor.name`}>Vendor Name *</Label>
                        <Input
                          id={`items.${index}.vendor.name`}
                          {...register(`items.${index}.vendor.name`)}
                          placeholder="Vendor company name"
                        />
                        {errors.items?.[index]?.vendor?.name && (
                          <p className="text-sm text-red-600">{errors.items[index].vendor.name.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.vendor.contactPerson`}>Contact Person</Label>
                        <Input
                          id={`items.${index}.vendor.contactPerson`}
                          {...register(`items.${index}.vendor.contactPerson`)}
                          placeholder="Contact person name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.vendor.email`}>Email *</Label>
                        <Input
                          id={`items.${index}.vendor.email`}
                          type="email"
                          {...register(`items.${index}.vendor.email`)}
                          placeholder="vendor@company.com"
                        />
                        {errors.items?.[index]?.vendor?.email && (
                          <p className="text-sm text-red-600">{errors.items[index].vendor.email.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.vendor.phone`}>Phone *</Label>
                        <Input
                          id={`items.${index}.vendor.phone`}
                          type="tel"
                          {...register(`items.${index}.vendor.phone`)}
                          placeholder="Phone number"
                        />
                        {errors.items?.[index]?.vendor?.phone && (
                          <p className="text-sm text-red-600">{errors.items[index].vendor.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.vendor.whatsapp`}>WhatsApp</Label>
                        <Input
                          id={`items.${index}.vendor.whatsapp`}
                          type="tel"
                          {...register(`items.${index}.vendor.whatsapp`)}
                          placeholder="WhatsApp number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.vendor.wechat`}>WeChat</Label>
                        <Input
                          id={`items.${index}.vendor.wechat`}
                          {...register(`items.${index}.vendor.wechat`)}
                          placeholder="WeChat ID"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor={`items.${index}.vendor.address.street`}>Address *</Label>
                      <Input
                        id={`items.${index}.vendor.address.street`}
                        {...register(`items.${index}.vendor.address.street`)}
                        placeholder="Street address"
                      />
                      {errors.items?.[index]?.vendor?.address?.street && (
                        <p className="text-sm text-red-600">{errors.items[index].vendor.address.street.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.vendor.address.city`}>City *</Label>
                        <Input
                          id={`items.${index}.vendor.address.city`}
                          {...register(`items.${index}.vendor.address.city`)}
                          placeholder="City"
                        />
                        {errors.items?.[index]?.vendor?.address?.city && (
                          <p className="text-sm text-red-600">{errors.items[index].vendor.address.city.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.vendor.address.state`}>State *</Label>
                        <Input
                          id={`items.${index}.vendor.address.state`}
                          {...register(`items.${index}.vendor.address.state`)}
                          placeholder="State"
                        />
                        {errors.items?.[index]?.vendor?.address?.state && (
                          <p className="text-sm text-red-600">{errors.items[index].vendor.address.state.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.vendor.address.postal`}>Postal Code *</Label>
                        <Input
                          id={`items.${index}.vendor.address.postal`}
                          {...register(`items.${index}.vendor.address.postal`)}
                          placeholder="Postal code"
                        />
                        {errors.items?.[index]?.vendor?.address?.postal && (
                          <p className="text-sm text-red-600">{errors.items[index].vendor.address.postal.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.vendor.address.country`}>Country *</Label>
                        <Input
                          id={`items.${index}.vendor.address.country`}
                          {...register(`items.${index}.vendor.address.country`)}
                          placeholder="Country"
                        />
                        {errors.items?.[index]?.vendor?.address?.country && (
                          <p className="text-sm text-red-600">{errors.items[index].vendor.address.country.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {errors.items && (
                <p className="text-sm text-red-600">{errors.items.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Quotation
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
