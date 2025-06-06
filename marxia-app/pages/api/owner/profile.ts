// IMPORTANT: This API route must be deployed over HTTPS (TLS 1.3) to ensure secure transmission of data.
import type { NextApiRequest, NextApiResponse } from 'next';
import { BusinessProfileData, SocialMediaLinks } from '../../../lib/types';

// Mock database storage
let DUMMY_DB_PROFILE: BusinessProfileData = {
  id: 'db-uuid-987',
  ownerUserId: 'auth-user-id-007',
  businessName: 'DB Stored Business Name',
  taxId: 'DBTAXID123',
  registrationNumber: 'DBREG456',
  addressLine1: '456 Database Drive',
  addressLine2: 'Unit B',
  city: 'DataCity',
  zipCode: 'D4T 4B4',
  phoneNumber: '555-987-6543',
  socialMediaLinks: {
    facebook: 'https://facebook.com/dbprofile',
    twitter: 'https://twitter.com/dbprofile',
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BusinessProfileData | { message: string }>
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      console.log('API: GET /api/owner/profile received');
      // In a real app, fetch from database based on authenticated user
      // For now, return the DUMMY_DB_PROFILE
      res.status(200).json(DUMMY_DB_PROFILE);
      break;

    case 'POST': // Using POST for simplicity to create/update
      console.log('API: POST /api/owner/profile received');
      try {
        const profileData = req.body as BusinessProfileData;
        console.log('API: Received data:', profileData);

        // Basic validation
        const {
          businessName, taxId, registrationNumber, addressLine1, addressLine2, city, zipCode, phoneNumber, socialMediaLinks
        } = profileData;

        if (!businessName || typeof businessName !== 'string' || businessName.trim().length === 0 || businessName.length > 255) {
          return res.status(400).json({ message: 'Business name is required and must be a string up to 255 characters.' });
        }
        if (taxId && (typeof taxId !== 'string' || taxId.length > 100)) {
          return res.status(400).json({ message: 'Tax ID must be a string up to 100 characters.' });
        }
        if (registrationNumber && (typeof registrationNumber !== 'string' || registrationNumber.length > 100)) {
          return res.status(400).json({ message: 'Registration number must be a string up to 100 characters.' });
        }
        if (addressLine1 && (typeof addressLine1 !== 'string' || addressLine1.length > 255)) {
          return res.status(400).json({ message: 'Address Line 1 must be a string up to 255 characters.' });
        }
        if (addressLine2 && (typeof addressLine2 !== 'string' || addressLine2.length > 255)) {
          return res.status(400).json({ message: 'Address Line 2 must be a string up to 255 characters.' });
        }
        if (city && (typeof city !== 'string' || city.length > 100)) {
          return res.status(400).json({ message: 'City must be a string up to 100 characters.' });
        }
        if (zipCode && (typeof zipCode !== 'string' || zipCode.length > 20)) {
          return res.status(400).json({ message: 'Zip code must be a string up to 20 characters.' });
        }
        if (phoneNumber && (typeof phoneNumber !== 'string' || phoneNumber.length > 50)) {
          return res.status(400).json({ message: 'Phone number must be a string up to 50 characters.' });
        }
        if (socialMediaLinks) {
          if (typeof socialMediaLinks !== 'object' || socialMediaLinks === null) {
            return res.status(400).json({ message: 'Social media links must be an object.' });
          }
          for (const key in socialMediaLinks) {
            if (socialMediaLinks.hasOwnProperty(key)) {
              const link = (socialMediaLinks as any)[key]; // Type assertion
              if (link && (typeof link !== 'string' || link.length > 2048)) { // Basic URL length check
                return res.status(400).json({ message: `Social media link for ${key} must be a string up to 2048 characters.` });
              }
            }
          }
        }

        // Simulate saving to database
        // In a real app, you would:
        // 1. Authenticate the user and get their ID.
        // 2. Check if a profile for this user ID already exists.
        // 3. If yes, UPDATE it. If no, INSERT a new one.
        // 4. Handle potential database errors.

        DUMMY_DB_PROFILE = {
          ...DUMMY_DB_PROFILE, // Keep existing ID and owner ID from "DB"
          ...profileData, // Apply incoming changes
          id: DUMMY_DB_PROFILE.id || 'new-db-uuid-for-post', // Ensure ID if it was a new record
          ownerUserId: DUMMY_DB_PROFILE.ownerUserId || 'auth-user-id-for-post' // Ensure owner ID
        };

        console.log('API: Profile data would be saved/updated in the database here.');
        console.log('API: Current DUMMY_DB_PROFILE state:', DUMMY_DB_PROFILE);

        res.status(200).json(DUMMY_DB_PROFILE); // Return the updated/saved profile
      } catch (error) {
        console.error('API: Error processing POST request:', error);
        res.status(500).json({ message: 'Internal Server Error while processing profile data.' });
      }
      break;

    default:
      console.log(`API: Method ${method} Not Allowed for /api/owner/profile`);
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
      break;
  }
}
