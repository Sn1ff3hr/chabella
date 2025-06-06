import React, { ReactNode } from 'next';
import Link from 'next/link';
import Head from 'next/head';

type DashboardLayoutProps = {
  children: ReactNode;
  pageTitle?: string;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, pageTitle = "Owner Dashboard" }) => {
  return (
    <>
      <Head>
        <title>{pageTitle} - Marxia</title>
      </Head>
      <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-gray-800 text-white p-5">
          <div className="text-xl font-semibold mb-6">Marxia Owner</div>
          <nav>
            <ul>
              <li className="mb-3">
                <Link href="/owner/dashboard">
                  <a className="hover:text-indigo-300">Dashboard Home</a>
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/owner/dashboard/profile">
                  <a className="hover:text-indigo-300">Profile</a>
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/owner/dashboard/products">
                  <a className="hover:text-indigo-300">Products</a>
                </Link>
              </li>
              <li className="mt-auto"> {/* Pushes logout to the bottom if sidebar had fixed height */}
                <Link href="/owner/logout"> {/* Placeholder logout link */}
                  <a className="hover:text-indigo-300">Logout</a>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-md p-4 lg:hidden">
            {/* Mobile Header: Could have a burger menu icon and current page title */}
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
          <footer className="bg-gray-200 text-center p-4 text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Marxia. All rights reserved.
          </footer>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
