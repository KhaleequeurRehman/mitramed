import { z } from "zod";
import { validateDecimalPlaces } from "./utils";

/**
 * Basic enums (string lists)
 */
export const QUOTATION_STATUSES = ["DRAFT", "SENT", "ACCEPTED", "REJECTED"];
export const SHIPMENT_STATUSES = ["PROCESSING", "IN_TRANSIT", "DELIVERED", "CANCELLED"];

/**
 * Embedded types
 */
export const addressSchema = z.object({
  street: z.string()
    .min(1, "Street is required")
    .min(5, "Street address must be at least 5 characters long")
    .max(200, "Street address must be less than 200 characters"),
  city: z.string()
    .min(1, "City is required")
    .min(2, "City name must be at least 2 characters long")
    .max(50, "City name must be less than 50 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "City name can only contain letters, spaces, periods, apostrophes, and hyphens"),
  state: z.string()
    .min(1, "State is required")
    .min(2, "State name must be at least 2 characters long")
    .max(50, "State name must be less than 50 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "State name can only contain letters, spaces, periods, apostrophes, and hyphens"),
  postal: z.string()
    .min(1, "Postal code is required")
    .regex(/^[A-Za-z0-9\s-]{3,10}$/, "Please enter a valid postal code (e.g., 110001, 10001, SW1A 1AA)")
    .refine((val) => {
      // Check if it's a valid format
      const cleanVal = val.replace(/\s/g, '');
      return cleanVal.length >= 3 && cleanVal.length <= 10;
    }, "Postal code must be 3-10 characters long"),
  country: z.string()
    .min(1, "Country is required")
    .min(2, "Country name must be at least 2 characters long")
    .max(50, "Country name must be less than 50 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Country name can only contain letters, spaces, periods, apostrophes, and hyphens"),
});

export const contactSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters, spaces, periods, apostrophes, and hyphens"),
  contactPerson: z.string()
    .optional()
    .refine((val) => !val || val.length >= 2, "Contact person name must be at least 2 characters long")
    .refine((val) => !val || val.length <= 100, "Contact person name must be less than 100 characters")
    .refine((val) => !val || /^[a-zA-Z\s.'-]+$/.test(val), "Contact person name can only contain letters, spaces, periods, apostrophes, and hyphens"),
  email: z.string()
  .email("Please enter a valid email address (e.g., john@example.com)")
    .min(1, "Email is required").trim(),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+[1-9]\d{6,14}$/, "Please enter a valid phone number with country code (e.g., +919876543210)")
    .refine((val) => {
      // Must start with + and have valid length
      if (val.startsWith('+')) {
        const digits = val.replace(/[^\d]/g, '');
        return digits.length >= 7 && digits.length <= 15;
      }
      return false;
    }, "Phone number must start with + and be 7-15 digits long"),
  whatsapp: z.string()
    .optional()
    .refine((val) => !val || /^\+[1-9]\d{6,14}$/.test(val), "Please enter a valid WhatsApp number with country code (e.g., +919876543210)")
    .refine((val) => {
      if (!val) return true;
      // Must start with + and have valid length
      if (val.startsWith('+')) {
        const digits = val.replace(/[^\d]/g, '');
        return digits.length >= 7 && digits.length <= 15;
      }
      return false;
    }, "WhatsApp number must start with + and be 7-15 digits long"),
  wechat: z.string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9_-]{3,20}$/.test(val), "WeChat ID must be 3-20 characters (e.g., john_doe, user123)")
    .refine((val) => !val || val.length >= 3, "WeChat ID must be at least 3 characters long"),
  address: addressSchema,
});

export const itemSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  uom: z.string().min(1, "Unit of measure is required"),
  quantity: z.union([z.string().min(1, "Quantity is required"), z.number().min(1, "Quantity is required")])
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Please enter a valid positive number (e.g., 5, 10.5)")
    .refine((val) => validateDecimalPlaces(val), "Maximum 2 decimal places allowed (e.g., 10.50)")
    .transform((val) => parseFloat(val)),
  unit: z.string().optional(),
  costPrice: z.union([z.string().min(1, "Cost price is required"), z.number().min(1, "Cost price is required")])
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Please enter a valid non-negative number (e.g., 25.99)")
    .refine((val) => validateDecimalPlaces(val), "Maximum 2 decimal places allowed (e.g., 25.99)")
    .transform((val) => parseFloat(val)),
  sellingPrice: z.union([z.string().min(1, "Selling price is required"), z.number().min(1, "Selling price is required")])
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Please enter a valid non-negative number (e.g., 49.99)")
    .refine((val) => validateDecimalPlaces(val), "Maximum 2 decimal places allowed (e.g., 49.99)")
    .transform((val) => parseFloat(val)),
  total: z.number().positive("Total must be positive").optional(),
});

export const shipmentInfoSchema = z.object({
  address: addressSchema,
  method: z.string().min(1, "Shipment method is required"),
  cost: z.union([z.string().optional(), z.number().optional()])
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), "Please enter a valid non-negative number (e.g., 25.99)")
    .refine((val) => !val || validateDecimalPlaces(val), "Maximum 2 decimal places allowed (e.g., 25.99)")
    .transform((val) => val ? parseFloat(val) : 0),
  tracking: z.string().optional(),
  status: z.enum(["PROCESSING", "IN_TRANSIT", "DELIVERED", "CANCELLED"]).default("PROCESSING"),
  eta: z.string().min(1, "ETA is required").refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Please enter a valid date"),
  deliveredAt: z.string().min(1, "Delivery date is required").refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Please enter a valid date"),
  terms: z.string().optional(),
  notes: z.string().optional(),
});


/**
 * Quotation create schema
 * Customer and vendor are required as objects (they will be created)
 * Calculated fields (subtotal, total, advance, remaining) are not in payload
 */
export const quotationCreateSchema = z.object({
  customer: contactSchema,
  vendor: contactSchema,
  shipment: shipmentInfoSchema,
  items: z.array(itemSchema).min(1, "At least one item is required"),
  validUntil: z.string().optional().refine((val) => {
    if (!val) return true; // Optional field, so empty is valid
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Please enter a valid date"),
  paymentTerms: z.string().optional(), // e.g., "30" for 30% advance
  discount: z.union([z.string().optional(), z.number().optional()])
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), "Please enter a valid non-negative number (e.g., 10.50)")
    .refine((val) => !val || validateDecimalPlaces(val), "Maximum 2 decimal places allowed (e.g., 10.50)")
    .transform((val) => val ? parseFloat(val) : 0),
  tax: z.union([z.string().optional(), z.number().optional()])
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), "Please enter a valid non-negative number (e.g., 5.25)")
    .refine((val) => !val || validateDecimalPlaces(val), "Maximum 2 decimal places allowed (e.g., 5.25)")
    .transform((val) => val ? parseFloat(val) : 0),
  remarks: z.string().optional(),
  status: z.enum(QUOTATION_STATUSES).default("DRAFT"),
});

/**
 * Quotation update schema - all fields optional for partial updates
 */
export const quotationUpdateSchema = z.object({
  customer: contactSchema.partial().optional(),
  vendor: contactSchema.partial().optional(),
  shipment: shipmentInfoSchema.partial().optional(),
  items: z.array(itemSchema).min(1, "At least one item is required").optional(),
  validUntil: z.string().optional().refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Please enter a valid date"),
  paymentTerms: z.string().optional(),
  discount: z.union([z.string().optional(), z.number().optional()])
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), "Please enter a valid non-negative number (e.g., 10.50)")
    .refine((val) => !val || validateDecimalPlaces(val), "Maximum 2 decimal places allowed (e.g., 10.50)")
    .transform((val) => val ? parseFloat(val) : 0),
  tax: z.union([z.string().optional(), z.number().optional()])
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), "Please enter a valid non-negative number (e.g., 5.25)")
    .refine((val) => !val || validateDecimalPlaces(val), "Maximum 2 decimal places allowed (e.g., 5.25)")
    .transform((val) => val ? parseFloat(val) : 0),
  remarks: z.string().optional(),
  status: z.enum(QUOTATION_STATUSES).optional(),
});



