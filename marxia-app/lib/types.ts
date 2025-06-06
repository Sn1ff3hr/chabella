// Marxia Application - Shared TypeScript Types

export interface SocialMediaLinks {
  facebook?: string;
  twitter?: string; // X
  instagram?: string;
  linkedin?: string;
  pinterest?: string;
  // Add other platforms as needed
}

export interface BusinessProfileData {
  id?: string; // UUID, usually from DB
  ownerUserId?: string; // UUID, from auth
  businessName: string;
  taxId?: string;
  registrationNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  zipCode?: string;
  phoneNumber?: string;
  socialMediaLinks?: SocialMediaLinks;
  // createdAt and updatedAt are usually handled by DB
}

// Add other shared types as the application grows

export interface ProductData {
  id?: string; // Optional: client-side UUID or DB ID if fetched
  assetId: string; // Marxia-generated unique ID
  productName: string;
  description?: string;
  price: number;
  quantityAvailable: number;
  taxName?: string;
  taxRate?: number; // e.g., 20 for 20%
  photoUrl?: string; // URL for the product image
  // business_profile_id will be implicitly linked via API context or similar
  // createdAt and updatedAt are usually handled by DB
}
