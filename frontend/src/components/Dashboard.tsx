import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Server, 
  Users, 
  ShoppingCart, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  Database
} from 'lucide-react';

interface ServiceStatus {
  name: string;
  url: string;
  status: 'healthy' | 'warning' | 'error';
  responseTime: number;
  lastChecked: Date;
}

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  apiCalls: number;
  uptime: string;
}

export default function Dashboard() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Product Service',
      url: 'http://localhost:3001',
      status: 'healthy',
      responseTime: 45,
      lastChecked: new Date()
    },
    {
      name: 'User Service',
      url: 'http://localhost:3002',
      status: 'healthy',
      responseTime: 32,
      lastChecked: new Date()
    },
    {
      name: 'WSO2 API Gateway',
      url: 'https://localhost:8243',
      status: 'healthy',
      responseTime: 28,
      lastChecked: new Date()
    }
  ]);

  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    apiCalls: 1247,
    uptime: '99.9%'
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkServiceHealth = async (service: ServiceStatus) => {
    const startTime = Date.now();
    try {
      const response = await fetch(`${service.url}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const responseTime = Date.now() - startTime;
      const status = response.ok ? 'healthy' : 'error';
      
      return {
        ...service,
        status: status as ServiceStatus['status'],
        responseTime,
        lastChecked: new Date()
      };
    } catch (error) {
      return {
        ...service,
        status: 'error' as ServiceStatus['status'],
        responseTime: Date.now() - startTime,
        lastChecked: new Date()
      };
    }
  };

  const refreshServices = async () => {
    setIsRefreshing(true);
    try {
      const updatedServices = await Promise.all(
        services.map(service => checkServiceHealth(service))
      );
      setServices(updatedServices);
      
      // Mock fetching stats
      const mockStats = {
        totalProducts: Math.floor(Math.random() * 100) + 50,
        totalUsers: Math.floor(Math.random() * 200) + 100,
        apiCalls: Math.floor(Math.random() * 1000) + 1000,
        uptime: '99.9%'
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to refresh services:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshServices();
    const interval = setInterval(refreshServices, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-success text-success-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      case 'error':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Monitor your WSO2 API Manager integration and services
          </p>
        </div>
        <Button 
          onClick={refreshServices}
          disabled={isRefreshing}
          className="bg-gradient-wso2 hover:opacity-90 text-white shadow-wso2"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalProducts}</div>
            <div className="flex items-center text-sm text-success mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last week
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
            <div className="flex items-center text-sm text-success mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last week
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                API Calls
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.apiCalls.toLocaleString()}</div>
            <div className="flex items-center text-sm text-success mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +24% from last week
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Uptime
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.uptime}</div>
            <div className="flex items-center text-sm text-success mt-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              All systems operational
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>Service Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(service.status)}
                <div>
                  <h4 className="font-medium text-foreground">{service.name}</h4>
                  <p className="text-sm text-muted-foreground">{service.url}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getStatusColor(service.status)}>
                  {service.status.toUpperCase()}
                </Badge>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {service.responseTime}ms
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {service.lastChecked.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* WSO2 Quick Links */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>WSO2 API Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col space-y-2">
              <ExternalLink className="h-5 w-5" />
              <span className="text-sm">Management Console</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-2">
              <ExternalLink className="h-5 w-5" />
              <span className="text-sm">Developer Portal</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-2">
              <ExternalLink className="h-5 w-5" />
              <span className="text-sm">API Gateway</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}