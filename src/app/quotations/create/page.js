"use client"

import { useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Save, ArrowLeft, Loader2, Wand2 } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { createQuotation } from "@/lib/actions/quotations"
import { quotationCreateSchema as CreateQuotationSchema } from "@/lib/validators"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CreateQuotationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate dummy data function
  const generateDummyData = () => {
    const dummyData = {
      customer: {
        name: "ABC Medical Center",
        contactPerson: "Dr. John Smith",
        email: "john.smith@abcmedical.com",
        phone: "+915550123",
        whatsapp: "+915550123",
        wechat: "",
        address: {
          street: "123 Medical Street",
          city: "New York",
          state: "NY",
          postal: "10001",
          country: "USA"
        }
      },
      shipment: {
        address: {
          street: "123 Medical Street",
          city: "New York",
          state: "NY",
          postal: "10001",
          country: "USA"
        },
        method: "Standard Shipping",
        cost: "25.00",
        tracking: "TRK123456789",
        status: "PROCESSING",
        eta: "2024-02-15",
        deliveredAt: "2024-02-20",
        terms: "FOB Destination",
        notes: "Handle with care - Medical equipment"
      },
      items: [
        {
          name: "Digital Blood Pressure Monitor",
          productNumber: "BP-MON-001",
          description: "Professional grade digital blood pressure monitor with large display",
          category: "Diagnostic Equipment",
          quantity: "2",
          unit: "pcs",
          costPrice: "89.99",
          sellingPrice: "129.99",
          vendor: {
            name: "MedSupply Solutions",
            contactPerson: "Sarah Johnson",
            email: "sarah@medsupply.com",
            phone: "+915550123",
            whatsapp: "+915550123",
            wechat: "",
            address: {
              street: "456 Supply Avenue",
              city: "Los Angeles",
              state: "CA",
              postal: "90210",
              country: "USA"
            }
          }
        },
        {
          name: "Digital Thermometer",
          productNumber: "TEMP-001",
          description: "Infrared digital thermometer for accurate temperature readings",
          category: "Diagnostic Equipment",
          quantity: "5",
          unit: "pcs",
          costPrice: "24.99",
          sellingPrice: "39.99",
          vendor: {
            name: "ThermoTech Inc",
            contactPerson: "Mike Wilson",
            email: "mike@thermotech.com",
            phone: "+915550123",
            whatsapp: "+915550123",
            wechat: "",
            address: {
              street: "789 Tech Street",
              city: "San Francisco",
              state: "CA",
              postal: "94102",
              country: "USA"
            }
          }
        }
      ],
      validUntil: "2024-03-15",
      paymentTerms: "Net 30",
      discount: "50.00",
      tax: "25.00",
      remarks: "Please review and confirm the quotation. Contact us for any modifications."
    }
    
    // Set form values
    Object.keys(dummyData).forEach(key => {
      if (key === 'items') {
        // Clear existing items and add new ones
        dummyData.items.forEach((item, index) => {
          if (index === 0) {
            // Replace first item
            Object.keys(item).forEach(itemKey => {
              setValue(`items.${index}.${itemKey}`, item[itemKey])
            })
          } else {
            // Append additional items
            append(item)
          }
        })
      } else if (key === 'customer' || key === 'vendor' || key === 'shipment') {
        // Handle nested objects
        Object.keys(dummyData[key]).forEach(nestedKey => {
          if (nestedKey === 'address') {
            Object.keys(dummyData[key][nestedKey]).forEach(addressKey => {
              setValue(`${key}.${nestedKey}.${addressKey}`, dummyData[key][nestedKey][addressKey])
            })
          } else {
            setValue(`${key}.${nestedKey}`, dummyData[key][nestedKey])
          }
        })
      } else {
        setValue(key, dummyData[key])
      }
    })
    
    toast.success("Dummy data generated successfully!")
  }

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateQuotationSchema),
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
      },
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

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      const result = await createQuotation(data)
      
      if (result.success) {
        toast.success("Quotation created successfully!")
        router.push("/quotations")
      } else {
        toast.error(result.error || "Failed to create quotation")
      }
    } catch (error) {
        
      toast.error("An unexpected error occurred")
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

  const removeItem = (index) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const getFieldError = (fieldName) => {
    const fieldNames = fieldName.split('.')
    let current = errors
    for (const name of fieldNames) {
      if (current && current[name]) {
        current = current[name]
      } else {
        return ""
      }
    }
    return current?.message || ""
  }

  const hasFieldError = (fieldName) => {
    return !!getFieldError(fieldName)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Mobile Responsive Header */}
        <div className="space-y-4">
          {/* Back Button and Generate Button - Full Width on Mobile */}
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={generateDummyData}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Sample Data
            </Button>
          </div>
          
          {/* Title & Subtitle - Centered on Mobile */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create New Quotation</h1>
            <p className="text-muted-foreground mt-1">
              Create a new quotation for your customer
            </p>
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
                    {...register("customer.name")}
                    placeholder="Customer company name"
                    className={hasFieldError("customer.name") ? "border-destructive" : ""}
                  />
                  {hasFieldError("customer.name") && (
                    <p className="text-sm text-destructive">{getFieldError("customer.name")}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer.contactPerson">Contact Person</Label>
                  <Input
                    {...register("customer.contactPerson")}
                    placeholder="Contact person name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer.email">Email *</Label>
                  <Input
                    {...register("customer.email")}
                    type="email"
                    placeholder="customer@company.com"
                    className={hasFieldError("customer.email") ? "border-destructive" : ""}
                  />
                  {hasFieldError("customer.email") && (
                    <p className="text-sm text-destructive">{getFieldError("customer.email")}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer.phone">Phone *</Label>
                  <Input
                    {...register("customer.phone")}
                    type="tel"
                    placeholder="Phone number"
                    className={hasFieldError("customer.phone") ? "border-destructive" : ""}
                  />
                  {hasFieldError("customer.phone") && (
                    <p className="text-sm text-destructive">{getFieldError("customer.phone")}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer.whatsapp">WhatsApp</Label>
                  <Input
                    {...register("customer.whatsapp")}
                    type="tel"
                    placeholder="WhatsApp number"
                  />
                  {errors.customer?.whatsapp && (
                    <p className="text-sm text-red-600">{errors.customer.whatsapp.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer.wechat">WeChat</Label>
                  <Input
                    {...register("customer.wechat")}
                    placeholder="WeChat ID"
                  />
                  {errors.customer?.wechat && (
                    <p className="text-sm text-red-600">{errors.customer.wechat.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer.address.street">Address *</Label>
                <Input
                  {...register("customer.address.street")}
                  placeholder="Street address"
                  className={hasFieldError("customer.address.street") ? "border-destructive" : ""}
                />
                {hasFieldError("customer.address.street") && (
                  <p className="text-sm text-destructive">{getFieldError("customer.address.street")}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer.address.city">City *</Label>
                  <Input
                    {...register("customer.address.city")}
                    placeholder="City"
                    className={hasFieldError("customer.address.city") ? "border-destructive" : ""}
                  />
                  {hasFieldError("customer.address.city") && (
                    <p className="text-sm text-destructive">{getFieldError("customer.address.city")}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer.address.state">State *</Label>
                  <Input
                    {...register("customer.address.state")}
                    placeholder="State"
                    className={hasFieldError("customer.address.state") ? "border-destructive" : ""}
                  />
                  {hasFieldError("customer.address.state") && (
                    <p className="text-sm text-destructive">{getFieldError("customer.address.state")}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer.address.postal">Postal Code *</Label>
                  <Input
                    {...register("customer.address.postal")}
                    placeholder="Postal code"
                    className={hasFieldError("customer.address.postal") ? "border-destructive" : ""}
                  />
                  {hasFieldError("customer.address.postal") && (
                    <p className="text-sm text-destructive">{getFieldError("customer.address.postal")}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer.address.country">Country *</Label>
                  <Input
                    {...register("customer.address.country")}
                    placeholder="Country"
                    className={hasFieldError("customer.address.country") ? "border-destructive" : ""}
                  />
                  {hasFieldError("customer.address.country") && (
                    <p className="text-sm text-destructive">{getFieldError("customer.address.country")}</p>
                  )}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    {...register("validUntil")}
                    type="date"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms (%)</Label>
                  <Input
                    {...register("paymentTerms")}
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g., 30 for 30%"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    {...register("discount")}
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax (%)</Label>
                  <Input
                    {...register("tax")}
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    {...register("remarks")}
                    placeholder="Additional notes, terms, or conditions"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Shipment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipment.method">Shipment Method *</Label>
                  <Input
                    {...register("shipment.method")}
                    placeholder="e.g., Express, Standard"
                    className={hasFieldError("shipment.method") ? "border-destructive" : ""}
                  />
                  {hasFieldError("shipment.method") && (
                    <p className="text-sm text-destructive">{getFieldError("shipment.method")}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shipment.cost">Shipment Cost</Label>
                  <Input
                    {...register("shipment.cost")}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shipment.eta">Expected Delivery *</Label>
                  <Input
                    {...register("shipment.eta")}
                    type="date"
                    className={hasFieldError("shipment.eta") ? "border-destructive" : ""}
                  />
                  {hasFieldError("shipment.eta") && (
                    <p className="text-sm text-destructive">{getFieldError("shipment.eta")}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipment.status">Shipment Status</Label>
                  <Controller
                    name="shipment.status"
                    control={control}
                    defaultValue="PROCESSING"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PROCESSING">Processing</SelectItem>
                          <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                          <SelectItem value="DELIVERED">Delivered</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shipment.tracking">Tracking Number</Label>
                  <Input
                    {...register("shipment.tracking")}
                    placeholder="Tracking number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shipment.deliveredAt">Delivered At *</Label>
                  <Input
                    {...register("shipment.deliveredAt")}
                    type="date"
                    className={hasFieldError("shipment.deliveredAt") ? "border-destructive" : ""}
                  />
                  {hasFieldError("shipment.deliveredAt") && (
                    <p className="text-sm text-destructive">{getFieldError("shipment.deliveredAt")}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipment.terms">Shipment Terms</Label>
                  <Input
                    {...register("shipment.terms")}
                    placeholder="Shipment terms"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shipment.notes">Shipment Notes</Label>
                  <Textarea
                    {...register("shipment.notes")}
                    placeholder="Additional shipment notes"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipment.address.street">Shipment Address *</Label>
                <Input
                  {...register("shipment.address.street")}
                  placeholder="Street address"
                  className={hasFieldError("shipment.address.street") ? "border-destructive" : ""}
                />
                {hasFieldError("shipment.address.street") && (
                  <p className="text-sm text-destructive">{getFieldError("shipment.address.street")}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipment.address.city">City *</Label>
                  <Input
                    {...register("shipment.address.city")}
                    placeholder="City"
                    className={hasFieldError("shipment.address.city") ? "border-destructive" : ""}
                  />
                  {hasFieldError("shipment.address.city") && (
                    <p className="text-sm text-destructive">{getFieldError("shipment.address.city")}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shipment.address.state">State *</Label>
                  <Input
                    {...register("shipment.address.state")}
                    placeholder="State"
                    className={hasFieldError("shipment.address.state") ? "border-destructive" : ""}
                  />
                  {hasFieldError("shipment.address.state") && (
                    <p className="text-sm text-destructive">{getFieldError("shipment.address.state")}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shipment.address.postal">Postal Code *</Label>
                  <Input
                    {...register("shipment.address.postal")}
                    placeholder="Postal code"
                    className={hasFieldError("shipment.address.postal") ? "border-destructive" : ""}
                  />
                  {hasFieldError("shipment.address.postal") && (
                    <p className="text-sm text-destructive">{getFieldError("shipment.address.postal")}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shipment.address.country">Country *</Label>
                  <Input
                    {...register("shipment.address.country")}
                    placeholder="Country"
                    className={hasFieldError("shipment.address.country") ? "border-destructive" : ""}
                  />
                  {hasFieldError("shipment.address.country") && (
                    <p className="text-sm text-destructive">{getFieldError("shipment.address.country")}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Product Name *</Label>
                      <Input
                        {...register(`items.${index}.name`)}
                        placeholder="Product name"
                        className={hasFieldError(`items.${index}.name`) ? "border-destructive" : ""}
                      />
                      {hasFieldError(`items.${index}.name`) && (
                        <p className="text-sm text-destructive">{getFieldError(`items.${index}.name`)}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Product Number</Label>
                      <Input
                        {...register(`items.${index}.productNumber`)}
                        placeholder="Product number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input
                        {...register(`items.${index}.category`)}
                        placeholder="Product category"
                      />
                    </div>
                    
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Quantity *</Label>
                      <Input
                        {...register(`items.${index}.quantity`)}
                        type="number"
                        min="1"
                        step="1"
                        placeholder="1"
                        className={hasFieldError(`items.${index}.quantity`) ? "border-destructive" : ""}
                      />
                      {hasFieldError(`items.${index}.quantity`) && (
                        <p className="text-sm text-destructive">{getFieldError(`items.${index}.quantity`)}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Input
                        {...register(`items.${index}.unit`)}
                        placeholder="e.g., pcs, kg"
                      />
                    </div>
                    
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cost Price *</Label>
                      <Input
                        {...register(`items.${index}.costPrice`)}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className={hasFieldError(`items.${index}.costPrice`) ? "border-destructive" : ""}
                      />
                      {hasFieldError(`items.${index}.costPrice`) && (
                        <p className="text-sm text-destructive">{getFieldError(`items.${index}.costPrice`)}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Selling Price *</Label>
                      <Input
                        {...register(`items.${index}.sellingPrice`)}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className={hasFieldError(`items.${index}.sellingPrice`) ? "border-destructive" : ""}
                      />
                      {hasFieldError(`items.${index}.sellingPrice`) && (
                        <p className="text-sm text-destructive">{getFieldError(`items.${index}.sellingPrice`)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      {...register(`items.${index}.description`)}
                      placeholder="Product description"
                      rows={2}
                    />
                  </div>

                  {/* Vendor Information for this item */}
                  <div className="border-t pt-4">
                    <h5 className="font-medium mb-4">Vendor Information *</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Vendor Name *</Label>
                        <Input
                          {...register(`items.${index}.vendor.name`)}
                          placeholder="Vendor company name"
                          className={hasFieldError(`items.${index}.vendor.name`) ? "border-destructive" : ""}
                        />
                        {hasFieldError(`items.${index}.vendor.name`) && (
                          <p className="text-sm text-destructive">{getFieldError(`items.${index}.vendor.name`)}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Contact Person</Label>
                        <Input
                          {...register(`items.${index}.vendor.contactPerson`)}
                          placeholder="Contact person name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          {...register(`items.${index}.vendor.email`)}
                          type="email"
                          placeholder="vendor@company.com"
                          className={hasFieldError(`items.${index}.vendor.email`) ? "border-destructive" : ""}
                        />
                        {hasFieldError(`items.${index}.vendor.email`) && (
                          <p className="text-sm text-destructive">{getFieldError(`items.${index}.vendor.email`)}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Phone *</Label>
                        <Input
                          {...register(`items.${index}.vendor.phone`)}
                          type="tel"
                          placeholder="Phone number"
                          className={hasFieldError(`items.${index}.vendor.phone`) ? "border-destructive" : ""}
                        />
                        {hasFieldError(`items.${index}.vendor.phone`) && (
                          <p className="text-sm text-destructive">{getFieldError(`items.${index}.vendor.phone`)}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>WhatsApp</Label>
                        <Input
                          {...register(`items.${index}.vendor.whatsapp`)}
                          type="tel"
                          placeholder="WhatsApp number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>WeChat</Label>
                        <Input
                          {...register(`items.${index}.vendor.wechat`)}
                          placeholder="WeChat ID"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label>Address *</Label>
                      <Input
                        {...register(`items.${index}.vendor.address.street`)}
                        placeholder="Street address"
                        className={hasFieldError(`items.${index}.vendor.address.street`) ? "border-destructive" : ""}
                      />
                      {hasFieldError(`items.${index}.vendor.address.street`) && (
                        <p className="text-sm text-destructive">{getFieldError(`items.${index}.vendor.address.street`)}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Input
                          {...register(`items.${index}.vendor.address.city`)}
                          placeholder="City"
                          className={hasFieldError(`items.${index}.vendor.address.city`) ? "border-destructive" : ""}
                        />
                        {hasFieldError(`items.${index}.vendor.address.city`) && (
                          <p className="text-sm text-destructive">{getFieldError(`items.${index}.vendor.address.city`)}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>State *</Label>
                        <Input
                          {...register(`items.${index}.vendor.address.state`)}
                          placeholder="State"
                          className={hasFieldError(`items.${index}.vendor.address.state`) ? "border-destructive" : ""}
                        />
                        {hasFieldError(`items.${index}.vendor.address.state`) && (
                          <p className="text-sm text-destructive">{getFieldError(`items.${index}.vendor.address.state`)}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Postal Code *</Label>
                        <Input
                          {...register(`items.${index}.vendor.address.postal`)}
                          placeholder="Postal code"
                          className={hasFieldError(`items.${index}.vendor.address.postal`) ? "border-destructive" : ""}
                        />
                        {hasFieldError(`items.${index}.vendor.address.postal`) && (
                          <p className="text-sm text-destructive">{getFieldError(`items.${index}.vendor.address.postal`)}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Country *</Label>
                        <Input
                          {...register(`items.${index}.vendor.address.country`)}
                          placeholder="Country"
                          className={hasFieldError(`items.${index}.vendor.address.country`) ? "border-destructive" : ""}
                        />
                        {hasFieldError(`items.${index}.vendor.address.country`) && (
                          <p className="text-sm text-destructive">{getFieldError(`items.${index}.vendor.address.country`)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          {/* Submit - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                </>
              )}
              Create Quotation
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}

