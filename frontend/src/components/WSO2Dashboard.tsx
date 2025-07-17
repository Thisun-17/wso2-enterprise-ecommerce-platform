import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Shield, 
  Server, 
  Settings, 
  Activity, 
  CheckCircle, 
  AlertCircle,
  Key,
  Database,
  Globe,
  RefreshCw,
  Code,
  Lock
} from 'lucide-react';

interface WSO2Service {
  name: string;
  url: string;
  port: number;
  status: 'online' | 'offline' | 'unknown';
  description: string;
}

export default function WSO2Dashboard() {
  const [services, setServices] = useState<WSO2Service[]>([
    {
      name: 'API Manager',
      url: 'https://localhost:9443/carbon',
      port: 9443,
      status: 'online',
      description: 'Management console for API lifecycle management'
    },
    {
      name: 'Developer Portal',
      url: 'https://localhost:9443/devportal',
      port: 9443,
      status: 'online',
      description: 'Developer portal for API discovery and testing'
    },
    {
      name: 'API Gateway',
      url: 'https://localhost:8243',
      port: 8243,
      status: 'online',
      description: 'Runtime gateway for API traffic routing'
    },
    {
      name: 'Key Manager',
      url: 'https://localhost:9443/keymanager',
      port: 9443,
      status: 'online',
      description: 'OAuth2 key and token management'
    }
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const oauth2Config = {
    serviceProvider: 'ProductAPIProvider',
    clientId: '4fKMNROeFNv9cM9hl63eqIeqre8a',
    grantTypes: ['authorization_code', 'client_credentials', 'refresh_token'],
    tokenEndpoint: 'https://localhost:8243/token',
    authorizeEndpoint: 'https://localhost:8243/authorize',
    scope: 'default'
  };

  const apiEndpoints = [
    {
      name: 'Product API',
      version: 'v1.0',
      context: '/products/v1',
      gateway: 'https://localhost:8243/products/v1',
      backend: 'http://localhost:3001',
      status: 'Published'
    },
    {
      name: 'User API',
      version: 'v1.0',
      context: '/users/v1',
      gateway: 'https://localhost:8243/users/v1',
      backend: 'http://localhost:3002',
      status: 'Published'
    }
  ];

  const refreshServices = async () => {
    setRefreshing(true);
    
    // Simulate service health check
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setServices(prev => prev.map(service => ({
      ...service,
      status: Math.random() > 0.1 ? 'online' : 'offline'
    })));
    
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'offline':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-success text-success-foreground';
      case 'offline':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">WSO2 Integration Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your WSO2 API Manager integration
          </p>
        </div>
        <Button 
          onClick={refreshServices}
          disabled={refreshing}
          className="bg-gradient-wso2 hover:opacity-90 text-white shadow-wso2"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* WSO2 Services Status */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>WSO2 Services Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service.name} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(service.status)}
                    <h4 className="font-medium text-foreground">{service.name}</h4>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Port: {service.port}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openExternalLink(service.url)}
                    className="flex items-center space-x-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Open</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* OAuth2 Configuration */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>OAuth2 Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Service Provider</h4>
                <div className="p-3 bg-muted rounded-md">
                  <code className="text-sm">{oauth2Config.serviceProvider}</code>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Client ID</h4>
                <div className="p-3 bg-muted rounded-md">
                  <code className="text-sm">{oauth2Config.clientId}</code>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Grant Types</h4>
                <div className="flex flex-wrap gap-2">
                  {oauth2Config.grantTypes.map(type => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Token Endpoint</h4>
                <div className="p-3 bg-muted rounded-md">
                  <code className="text-sm">{oauth2Config.tokenEndpoint}</code>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Authorize Endpoint</h4>
                <div className="p-3 bg-muted rounded-md">
                  <code className="text-sm">{oauth2Config.authorizeEndpoint}</code>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Scope</h4>
                <Badge className="bg-gradient-wso2 text-white">
                  {oauth2Config.scope}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Gateway Configuration */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>API Gateway Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiEndpoints.map((api) => (
              <div key={api.name} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{api.name}</h4>
                    <p className="text-sm text-muted-foreground">Version {api.version}</p>
                  </div>
                  <Badge className="bg-success text-success-foreground">
                    {api.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Context:</span>
                    <div className="mt-1 p-2 bg-muted rounded">
                      <code>{api.context}</code>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Gateway:</span>
                    <div className="mt-1 p-2 bg-muted rounded">
                      <code>{api.gateway}</code>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Backend:</span>
                    <div className="mt-1 p-2 bg-muted rounded">
                      <code>{api.backend}</code>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => openExternalLink('https://localhost:9443/carbon')}
            >
              <Shield className="h-6 w-6" />
              <span>Management Console</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => openExternalLink('https://localhost:9443/devportal')}
            >
              <Code className="h-6 w-6" />
              <span>Developer Portal</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => openExternalLink('https://localhost:8243')}
            >
              <Globe className="h-6 w-6" />
              <span>API Gateway</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Integration Health</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="font-medium text-foreground">API Gateway</div>
              <div className="text-sm text-success">Operational</div>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="font-medium text-foreground">OAuth2</div>
              <div className="text-sm text-success">Configured</div>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="font-medium text-foreground">APIs</div>
              <div className="text-sm text-success">Published</div>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="font-medium text-foreground">Security</div>
              <div className="text-sm text-success">Enabled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}