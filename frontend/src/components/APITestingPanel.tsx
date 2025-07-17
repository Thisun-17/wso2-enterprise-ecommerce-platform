import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  CheckCircle,
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Product, CreateProductData, UpdateProductData } from '@/types';

export default function APITestingPanel() {
  const { 
    products, 
    loading, 
    error, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    clearError,
    refreshProducts 
  } = useProducts();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    price: 0,
    category: '',
    stock: 0,
    description: ''
  });
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationMessage, setOperationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      category: '',
      stock: 0,
      description: ''
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.category) {
      setOperationMessage({ type: 'error', text: 'Name and category are required' });
      return;
    }

    setOperationLoading(true);
    setOperationMessage(null);

    try {
      const result = await createProduct(formData);
      if (result) {
        setOperationMessage({ type: 'success', text: `Product "${result.name}" created successfully!` });
        resetForm();
      } else {
        setOperationMessage({ type: 'error', text: 'Failed to create product' });
      }
    } catch (err) {
      setOperationMessage({ type: 'error', text: 'Error creating product' });
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (editingId === null) return;

    setOperationLoading(true);
    setOperationMessage(null);

    try {
      const updateData: UpdateProductData = {};
      if (formData.name) updateData.name = formData.name;
      if (formData.price) updateData.price = formData.price;
      if (formData.category) updateData.category = formData.category;
      if (formData.stock) updateData.stock = formData.stock;
      if (formData.description) updateData.description = formData.description;

      const result = await updateProduct(editingId, updateData);
      if (result) {
        setOperationMessage({ type: 'success', text: `Product "${result.name}" updated successfully!` });
        resetForm();
      } else {
        setOperationMessage({ type: 'error', text: 'Failed to update product' });
      }
    } catch (err) {
      setOperationMessage({ type: 'error', text: 'Error updating product' });
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setOperationLoading(true);
    setOperationMessage(null);

    try {
      const success = await deleteProduct(id);
      if (success) {
        setOperationMessage({ type: 'success', text: `Product "${name}" deleted successfully!` });
      } else {
        setOperationMessage({ type: 'error', text: 'Failed to delete product' });
      }
    } catch (err) {
      setOperationMessage({ type: 'error', text: 'Error deleting product' });
    } finally {
      setOperationLoading(false);
    }
  };

  const startEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description
    });
    setEditingId(product.id);
    setIsCreating(false);
  };

  const startCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">API Testing Panel</h2>
          <p className="text-muted-foreground mt-1">
            Test CRUD operations with real backend APIs
          </p>
        </div>
        <div className="space-x-2">
          <Button 
            onClick={refreshProducts}
            variant="outline"
            disabled={loading}
          >
            <CheckCircle className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={startCreate}
            className="bg-gradient-wso2 hover:opacity-90 text-white shadow-wso2"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Product
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="ghost" size="sm" onClick={clearError}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {operationMessage && (
        <Alert variant={operationMessage.type === 'success' ? 'default' : 'destructive'}>
          {operationMessage.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription className="flex items-center justify-between">
            {operationMessage.text}
            <Button variant="ghost" size="sm" onClick={() => setOperationMessage(null)}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Create/Edit Form */}
      {(isCreating || editingId !== null) && (
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{isCreating ? 'Create New Product' : 'Edit Product'}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter category"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={isCreating ? handleCreate : handleUpdate}
                disabled={operationLoading}
                className="bg-gradient-wso2 hover:opacity-90 text-white shadow-wso2"
              >
                {operationLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isCreating ? 'Create Product' : 'Update Product'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Live Product Data ({products.length} products)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && products.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading products from API...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-foreground">{product.name}</h3>
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-foreground font-medium">${product.price}</span>
                        <span className="text-muted-foreground">Stock: {product.stock}</span>
                        <span className="text-muted-foreground">ID: {product.id}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(product)}
                        disabled={operationLoading}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={operationLoading}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
