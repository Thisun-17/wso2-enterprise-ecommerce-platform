import { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import ProductCatalog from '@/components/ProductCatalog';
import UserManagement from '@/components/UserManagement';
import AdminPanel from '@/components/AdminPanel';
import WSO2Dashboard from '@/components/WSO2Dashboard';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductCatalog />;
      case 'users':
        return <UserManagement />;
      case 'admin':
        return <AdminPanel />;
      case 'wso2':
        return <WSO2Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {/* Hero Section - Only shown on dashboard */}
      {currentPage === 'dashboard' && (
        <div className="bg-gradient-hero border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                WSO2 E-Commerce Platform
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                A modern, enterprise-ready e-commerce platform powered by WSO2 API Manager. 
                Demonstrating real-world API integration and microservices architecture.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">API Gateway Active</span>
                </div>
                <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">OAuth2 Configured</span>
                </div>
                <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Microservices Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {renderCurrentPage()}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">WSO2 E-Commerce</h3>
              <p className="text-sm text-muted-foreground">
                Professional e-commerce platform showcasing WSO2 API Manager integration
                and modern microservices architecture.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">API Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Product Service API (Port 3001)</li>
                <li>User Service API (Port 3002)</li>
                <li>WSO2 API Gateway (Port 8243)</li>
                <li>OAuth2 Authentication</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">WSO2 Components</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>API Manager (Port 9443)</li>
                <li>Developer Portal</li>
                <li>Management Console</li>
                <li>Key Manager</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Built with React, TypeScript, and WSO2 API Manager • 
              Demonstrating enterprise API integration skills
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
