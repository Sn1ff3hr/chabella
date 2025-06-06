// IMPORTANT: This API route must be deployed over HTTPS (TLS 1.3) to ensure secure transmission of data.
import type { NextApiRequest, NextApiResponse } from 'next';
import { ProductData } from '../../../lib/types';
import { appendToSheet } from '../../../lib/googleSheets'; // Import the helper

// Mock database storage for products
let DUMMY_DB_PRODUCTS: ProductData[] = [
  { id: 'mock-prod-1', assetId: 'MARXIA-0001', productName: 'Pre-existing Gadget', description: 'A gadget from the void.', price: 99.99, quantityAvailable: 10, taxName: 'VAT', taxRate: 10 },
  { id: 'mock-prod-2', assetId: 'MARXIA-0002', productName: 'Another Pre-existing Item', description: 'It also came from the void.', price: 49.50, quantityAvailable: 5, taxName: 'Sales Tax', taxRate: 5 },
];

// Counter for generating unique asset_ids
let assetIdCounter = DUMMY_DB_PRODUCTS.length; // Start counter after existing items

const generateMockId = () => `mock-prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
const generateNewAssetId = () => {
  assetIdCounter += 1;
  return `MARXIA-${String(assetIdCounter).padStart(4, '0')}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductData[] | ProductData | { message: string }>
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      console.log('API: GET /api/owner/products received');
      // In a real app, fetch from database, potentially with pagination, filtering, etc.
      // For now, return all products in DUMMY_DB_PRODUCTS
      res.status(200).json(DUMMY_DB_PRODUCTS);
      break;

    case 'POST':
      console.log('API: POST /api/owner/products received');
      try {
        const { productName, description, price, quantityAvailable, taxName, taxRate, photoUrl } = req.body;

        console.log('API: Received data:', req.body);

        // Basic validation
        if (!productName || typeof productName !== 'string' || productName.trim().length === 0 || productName.length > 255) {
          return res.status(400).json({ message: 'Product name is required and must be a string up to 255 characters.' });
        }
        if (price === undefined || typeof price !== 'number' || price <= 0) {
          return res.status(400).json({ message: 'Price is required and must be a positive number.' });
        }
        if (quantityAvailable === undefined || typeof quantityAvailable !== 'number' || quantityAvailable < 0 || !Number.isInteger(quantityAvailable)) {
            return res.status(400).json({ message: 'Quantity available is required and must be a non-negative integer.' });
        }
        if (description && typeof description !== 'string') { // TEXT can be large, so not typically length-limited here unless specific needs
            return res.status(400).json({ message: 'Description must be a string.' });
        }
        if (taxName && (typeof taxName !== 'string' || taxName.length > 100)) {
            return res.status(400).json({ message: 'Tax name must be a string up to 100 characters.' });
        }
        if (taxRate !== undefined && (typeof taxRate !== 'number' || taxRate < 0 || taxRate > 100)) { // Assuming tax rate is a percentage 0-100
            return res.status(400).json({ message: 'Tax rate must be a number between 0 and 100.' });
        }
        if (photoUrl) {
            if (typeof photoUrl !== 'string' || photoUrl.length > 2048) {
                return res.status(400).json({ message: 'Photo URL must be a string up to 2048 characters.' });
            }
            try {
                new URL(photoUrl); // Basic URL validation
            } catch (_) {
                return res.status(400).json({ message: 'Photo URL must be a valid URL.' });
            }
        }

        // Generate new ID and assetId
        const newId = generateMockId();
        const newAssetId = generateNewAssetId();

        const newProduct: ProductData = {
          id: newId,
          assetId: newAssetId,
          productName: productName.trim(),
          description: description || '',
          price: parseFloat(price.toFixed(2)), // Ensure two decimal places
          quantityAvailable: parseInt(quantityAvailable.toString(), 10), // Ensure integer
          taxName: taxName || undefined,
          taxRate: taxRate ? parseFloat(taxRate.toFixed(2)) : undefined,
          photoUrl: photoUrl || undefined,
        };

        DUMMY_DB_PRODUCTS.push(newProduct);

        console.log(`API: New product added with asset_id ${newAssetId}. DB size: ${DUMMY_DB_PRODUCTS.length}`);

        // Log to Google Sheets (fire and forget, don't let it block/fail the response)
        const sheetId = process.env.GOOGLE_SHEET_ID;
        if (sheetId) {
          const rowValues = [
            newProduct.assetId,
            newProduct.productName,
            newProduct.price,
            newProduct.quantityAvailable,
            new Date().toISOString(), // Timestamp of addition
            newProduct.description || '',
            newProduct.taxName || '',
            newProduct.taxRate || '',
            newProduct.photoUrl || '',
          ];
          // Using 'ProductLog!A1' will append after the last row in 'ProductLog' sheet.
          // Ensure 'ProductLog' sheet exists in your Google Sheet.
          appendToSheet(sheetId, 'ProductLog!A1', [rowValues])
            .then(sheetResponse => {
              if (sheetResponse) {
                console.log('Successfully logged new product to Google Sheets.');
              } else {
                console.warn('Failed to log new product to Google Sheets or logging was skipped.');
              }
            })
            .catch(sheetError => {
              console.error('Error in appendToSheet promise chain:', sheetError);
            });
        } else {
          console.log('GOOGLE_SHEET_ID not configured. Skipping Google Sheets logging.');
        }

        res.status(201).json(newProduct); // Return the newly created product

      } catch (error) {
        console.error('API: Error processing POST request for new product:', error);
        // Check if error is an instance of Error to safely access message property
        const message = error instanceof Error ? error.message : 'Internal Server Error while creating product.';
        res.status(500).json({ message });
      }
      break;

    default:
      console.log(`API: Method ${method} Not Allowed for /api/owner/products`);
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
      break;
  }
}
