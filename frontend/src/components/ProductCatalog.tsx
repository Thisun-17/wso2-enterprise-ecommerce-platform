import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Tag,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    price: 99.99,
    category: 'Electronics',
    stock: 50,
    description: 'High-quality wireless headphones with noise cancellation'
  },
  {
    id: 2,
    name: 'Running Shoes',
    price: 79.99,
    category: 'Sports',
    stock: 30,
    description: 'Comfortable running shoes for all terrains'
  },
  {
    id: 3,
    name: 'Smart Watch',
    price: 299.99,
    category: 'Electronics',
    stock: 25,
    description: 'Feature-rich smartwatch with health monitoring'
  },
  {
    id: 4,
    name: 'Coffee Maker',
    price: 149.99,
    category: 'Home',
    stock: 15,
    description: 'Programmable coffee maker with thermal carafe'
  },
  {
    id: 5,
    name: 'Denim Jacket',
    price: 89.99,
    category: 'Fashion',
    stock: 40,
    description: 'Classic denim jacket with modern fit'
  },
  {
    id: 6,
    name: 'Yoga Mat',
    price: 34.99,
    category: 'Sports',
    stock: 60,
    description: 'Non-slip yoga mat for all practice levels'
  }
];

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['All', 'Electronics', 'Sports', 'Home', 'Fashion'];

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would be:
      // const response = await fetch('http://localhost:3001/products');
      // const data = await response.json();
      // setProducts(data.data);
      
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Electronics': 'bg-blue-100 text-blue-800',
      'Sports': 'bg-green-100 text-green-800',
      'Home': 'bg-purple-100 text-purple-800',
      'Fashion': 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStockStatus = (stock: number) => {
    if (stock > 50) return { color: 'text-success', label: 'In Stock' };
    if (stock > 10) return { color: 'text-warning', label: 'Low Stock' };
    return { color: 'text-destructive', label: 'Very Low' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchProducts} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Product Catalog</h2>
          <p className="text-muted-foreground mt-1">
            Browse and manage your product inventory
          </p>
        </div>
        <Button 
          onClick={fetchProducts}
          className="bg-gradient-wso2 hover:opacity-90 text-white shadow-wso2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-elegant">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-gradient-wso2 text-white' : ''}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock);
          return (
            <Card key={product.id} className="shadow-card hover:shadow-elegant transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                    <Badge className={`mt-2 ${getCategoryColor(product.category)}`}>
                      <Tag className="h-3 w-3 mr-1" />
                      {product.category}
                    </Badge>
                  </div>
                  <div className="w-16 h-16 bg-gradient-hero rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold text-foreground">
                      ${product.price}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${stockStatus.color}`}>
                      {stockStatus.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {product.stock} units
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-wso2 hover:opacity-90 text-white shadow-wso2"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}