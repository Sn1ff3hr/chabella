import type { NextPage } from 'next';
import { useState, useEffect, FormEvent } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { BusinessProfileData, SocialMediaLinks } from '../../../lib/types';

const ProfilePage: NextPage = () => {
  const [profileData, setProfileData] = useState<BusinessProfileData>({
    businessName: '',
    taxId: '',
    registrationNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    zipCode: '',
    phoneNumber: '',
    socialMediaLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      pinterest: '',
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setNotification(null);
    try {
      const response = await fetch('/api/owner/profile');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      const data: BusinessProfileData = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setNotification({ type: 'error', message: error instanceof Error ? error.message : 'Failed to load profile data.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      socialMediaLinks: {
        ...prev.socialMediaLinks,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    try {
      const response = await fetch('/api/owner/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `API Error: ${response.status}`);
      }

      setProfileData(responseData); // Update state with response from API (e.g., if ID or updatedAt changed)
      setNotification({ type: 'success', message: 'Profile saved successfully!' });
      console.log('Profile saved:', responseData);

    } catch (error) {
      console.error('Failed to save profile:', error);
      setNotification({ type: 'error', message: error instanceof Error ? error.message : 'Failed to save profile data.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Business Profile">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Business Profile</h1>
          <p className="text-gray-700 text-lg">Loading profile data...</p>
          {notification && notification.type === 'error' && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{notification.message}</div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Business Profile">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Business Profile</h1>

        {notification && (
          <div className={`p-4 mb-6 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl space-y-8">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <p className="text-lg font-semibold text-gray-700">Owner ID: <span className="text-indigo-600">{profileData.ownerUserId || "N/A"}</span></p>
            <p className="text-sm text-gray-500">Your unique business identifier, usually linked to your authentication.</p>
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Business Name <span className="text-red-500">*</span></label>
                <input type="text" name="businessName" id="businessName" value={profileData.businessName} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"/>
              </div>
              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">Tax ID / VAT Number</label>
                <input type="text" name="taxId" id="taxId" value={profileData.taxId || ''} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"/>
              </div>
              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">Business Registration Number</label>
                <input type="text" name="registrationNumber" id="registrationNumber" value={profileData.registrationNumber || ''} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"/>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" name="phoneNumber" id="phoneNumber" value={profileData.phoneNumber || ''} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"/>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Business Address</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input type="text" name="addressLine1" id="addressLine1" value={profileData.addressLine1 || ''} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"/>
              </div>
              <div>
                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                <input type="text" name="addressLine2" id="addressLine2" value={profileData.addressLine2 || ''} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City / Town</label>
                  <input type="text" name="city" id="city" value={profileData.city || ''} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"/>
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip / Postal Code</label>
                  <input type="text" name="zipCode" id="zipCode" value={profileData.zipCode || ''} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"/>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {(Object.keys(profileData.socialMediaLinks || {}) as Array<keyof SocialMediaLinks>).map((key) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                  <input
                    type="url"
                    name={key}
                    id={key}
                    value={profileData.socialMediaLinks?.[key] || ''}
                    onChange={handleSocialMediaChange}
                    placeholder={`https://www.${key}.com/yourprofile`}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Security</h2>
             <div className="flex items-center">
                <input id="enable-2fa" name="enable-2fa" type="checkbox" disabled className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                <label htmlFor="enable-2fa" className="ml-2 block text-sm text-gray-500">Enable Two-Factor Authentication (Coming Soon)</label>
            </div>
          </section>

          <div className="pt-8 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving || isLoading}
              className="w-full md:w-auto flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
