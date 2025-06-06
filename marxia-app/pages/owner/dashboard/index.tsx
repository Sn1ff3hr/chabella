import type { NextPage } from 'next';
import Link from 'next/link';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const OwnerDashboardPage: NextPage = () => {
  return (
    <DashboardLayout pageTitle="Owner Dashboard Home">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Welcome to your Dashboard!</h2>
            <p className="text-gray-700 mb-6">
              This is your central hub for managing your Marxia presence.
              You can manage your business profile, products, and view analytics from here.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">Manage Profile</h3>
                <p className="text-gray-600 mb-3">Keep your business details up-to-date.</p>
                <Link href="/owner/dashboard/profile">
                  <a className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Go to Profile
                  </a>
                </Link>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-green-700 mb-2">Manage Products</h3>
                <p className="text-gray-600 mb-3">Add, edit, and organize your product listings.</p>
                <Link href="/owner/dashboard/products">
                  <a className="inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                    Go to Products
                  </a>
                </Link>
              </div>
            </div>
            {/* Example of a section that might be added later */}
            {/*
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Quick Stats</h3>
              <div className="p-4 bg-blue-50 rounded-lg shadow">
                <p className="text-blue-700">Placeholder for quick statistics or notifications.</p>
              </div>
            </div>
            */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboardPage;
