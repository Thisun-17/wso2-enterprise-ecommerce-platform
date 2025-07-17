import { useState } from 'react';
import { Menu, X, Activity, Shield, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'products', label: 'Products', icon: Server },
    { id: 'users', label: 'Users', icon: Shield },
    { id: 'admin', label: 'Admin', icon: Menu },
    { id: 'wso2', label: 'WSO2 Integration', icon: Server }
  ];

  return (
    <header className="bg-background border-b border-border shadow-elegant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-wso2 p-2 rounded-lg shadow-wso2">
              <Server className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">WSO2 E-Commerce</h1>
              <p className="text-sm text-muted-foreground">API Manager Integration</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-gradient-wso2 text-white shadow-wso2'
                      : 'text-foreground hover:bg-muted'
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? 'default' : 'ghost'}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 justify-start ${
                      currentPage === item.id
                        ? 'bg-gradient-wso2 text-white shadow-wso2'
                        : 'text-foreground hover:bg-muted'
                    }`}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}