import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Package, 
  Users, 
  Settings, 
  Code, 
  Send,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface NewProduct {
  name: string;
  price: string;
  category: string;
  stock: string;
  description: string;
}

interface NewUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface ApiTestResult {
  endpoint: string;
  status: 'success' | 'error' | 'loading';
  response?: any;
  error?: string;
  responseTime?: number;
}

export default function AdminPanel() {
  const { toast } = useToast();
  
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: ''
  });

  const [newUser, setNewUser] = useState<NewUser>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: ''
  });

  const [apiTests, setApiTests] = useState<ApiTestResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Electronics', 'Sports', 'Home', 'Fashion'];
  const roles = ['admin', 'customer'];

  const apiEndpoints = [
    { name: 'Products Health', url: 'http://localhost:3001/health', method: 'GET' },
    { name: 'Users Health', url: 'http://localhost:3002/health', method: 'GET' },
    { name: 'Get Products', url: 'http://localhost:3001/products', method: 'GET' },
    { name: 'Get Users', url: 'http://localhost:3002/users', method: 'GET' }
  ];

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation:
      // const response = await fetch('http://localhost:3001/products', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...newProduct,
      //     price: parseFloat(newProduct.price),
      //     stock: parseInt(newProduct.stock)
      //   })
      // });

      toast({
        title: "Product Created",
        description: `${newProduct.name} has been added successfully.`,
      });

      setNewProduct({
        name: '',
        price: '',
        category: '',
        stock: '',
        description: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation:
      // const response = await fetch('http://localhost:3002/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newUser)
      // });

      toast({
        title: "User Created",
        description: `${newUser.firstName} ${newUser.lastName} has been added successfully.`,
      });

      setNewUser({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        role: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const testApiEndpoint = async (endpoint: typeof apiEndpoints[0]) => {
    const testId = `${endpoint.name}-${Date.now()}`;
    
    setApiTests(prev => [...prev, {
      endpoint: endpoint.name,
      status: 'loading'
    }]);

    const startTime = Date.now();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
      
      const responseTime = Date.now() - startTime;
      const mockResponse = {
        success: true,
        message: `${endpoint.name} is working correctly`,
        timestamp: new Date().toISOString(),
        endpoint: endpoint.url
      };

      setApiTests(prev => prev.map(test => 
        test.endpoint === endpoint.name && test.status === 'loading'
          ? {
              ...test,
              status: 'success' as const,
              response: mockResponse,
              responseTime
            }
          : test
      ));
    } catch (error) {
      setApiTests(prev => prev.map(test => 
        test.endpoint === endpoint.name && test.status === 'loading'
          ? {
              ...test,
              status: 'error' as const,
              error: 'Failed to connect to endpoint'
            }
          : test
      ));
    }
  };

  const clearApiTests = () => {
    setApiTests([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Admin Panel</h2>
        <p className="text-muted-foreground mt-1">
          Manage products, users, and test API endpoints
        </p>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>API Testing</span>
          </TabsTrigger>
        </TabsList>

        {/* Product Management */}
        <TabsContent value="products">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add New Product</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input
                      id="product-name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-price">Price ($)</Label>
                    <Input
                      id="product-price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-category">Category</Label>
                    <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="product-stock">Stock Quantity</Label>
                    <Input
                      id="product-stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Enter product description"
                    rows={3}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-wso2 hover:opacity-90 text-white shadow-wso2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Product
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add New User</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="user-username">Username</Label>
                    <Input
                      id="user-username"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-firstname">First Name</Label>
                    <Input
                      id="user-firstname"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-lastname">Last Name</Label>
                    <Input
                      id="user-lastname"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-wso2 hover:opacity-90 text-white shadow-wso2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Testing */}
        <TabsContent value="api">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>API Endpoint Testing</span>
                </div>
                <Button variant="outline" onClick={clearApiTests} size="sm">
                  Clear Results
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apiEndpoints.map((endpoint) => (
                  <Button
                    key={endpoint.name}
                    variant="outline"
                    onClick={() => testApiEndpoint(endpoint)}
                    className="h-auto p-4 justify-start"
                  >
                    <div className="flex items-center space-x-3">
                      <Send className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">{endpoint.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {endpoint.method} {endpoint.url}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              {apiTests.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-medium text-foreground">Test Results</h4>
                  {apiTests.map((test, index) => (
                    <Card key={index} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            {test.status === 'loading' && (
                              <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            )}
                            {test.status === 'success' && (
                              <CheckCircle className="h-5 w-5 text-success" />
                            )}
                            {test.status === 'error' && (
                              <XCircle className="h-5 w-5 text-destructive" />
                            )}
                            <div>
                              <div className="font-medium">{test.endpoint}</div>
                              {test.responseTime && (
                                <div className="text-sm text-muted-foreground">
                                  Response time: {test.responseTime}ms
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {test.response && (
                          <div className="mt-3 p-3 bg-muted rounded-md">
                            <pre className="text-sm text-foreground overflow-x-auto">
                              {JSON.stringify(test.response, null, 2)}
                            </pre>
                          </div>
                        )}
                        {test.error && (
                          <div className="mt-3 p-3 bg-destructive/10 rounded-md">
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="h-4 w-4 text-destructive" />
                              <span className="text-sm text-destructive">{test.error}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}