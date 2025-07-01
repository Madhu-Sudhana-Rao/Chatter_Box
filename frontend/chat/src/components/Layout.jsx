import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ showSidebar = false, children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {showSidebar && <Sidebar />}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-screen">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
