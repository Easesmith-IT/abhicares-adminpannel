import { z } from "zod";

export const sellerSchema = z.object({
  /* ✅ REQUIRED */
  name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit phone"),
  state: z.string().min(1, "State is required"),
  cityId: z.string().min(1, "City is required"),

  /* 🟡 OPTIONAL BASIC */
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  Gender: z.string().optional(),

  /* 🟡 ADDRESS */
  addressLine: z.string().optional(),
  landmark: z.string().optional(),
  pincode: z.string().optional(),

  /* 🟡 BUSINESS */
  categoryId: z.string().optional(),
  services: z.array(z.string()).optional(),

  legalName: z.string().optional(),
  gstNumber: z.string().optional(),

  /* 🟡 CONTACT PERSON */
  contactPerson: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email("Invalid email").optional().or(z.literal("")),
    })
    .optional(),

  /* 🟡 BANK DETAILS */
  bankDetails: z
    .object({
      accountNumber: z.string().optional(),
      ifscCode: z
        .string()
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC")
        .optional(),
      accountHolderName: z.string().optional(),
      bankName: z.string().optional(),
    })
    .optional(),

  /* 🟡 FILES */
  profilePhoto: z.any().optional(),
  panCard: z.any().optional(),
  addressProof: z.any().optional(),
  gstCertificate: z.any().optional(),
  shopLicense: z.any().optional(),
  otherDocuments: z.array(z.any()).optional(),

  /* 🟡 EXTRA */
  addressProofType: z.string().optional(),
});
