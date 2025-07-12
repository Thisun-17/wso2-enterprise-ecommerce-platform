// product-service.js - Mock E-commerce Product Service
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock product data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 99.99,
        category: "Electronics",
        stock: 50,
        description: "High-quality wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 299.99,
        category: "Electronics", 
        stock: 25,
        description: "Feature-rich smartwatch with health monitoring"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 129.99,
        category: "Sports",
        stock: 100,
        description: "Comfortable running shoes for all terrains"
    },
    {
        id: 4,
        name: "Coffee Maker",
        price: 79.99,
        category: "Home",
        stock: 30,
        description: "Automatic drip coffee maker with programmable timer"
    }
];

// GET /products - Get all products
app.get('/products', (req, res) => {
    const category = req.query.category;
    const limit = parseInt(req.query.limit) || products.length;
    
    let filteredProducts = products;
    
    if (category) {
        filteredProducts = products.filter(p => 
            p.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    res.json({
        success: true,
        data: filteredProducts.slice(0, limit),
        total: filteredProducts.length
    });
});

// GET /products/:id - Get specific product
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
    
    res.json({
        success: true,
        data: product
    });
});

// POST /products - Create new product
app.post('/products', (req, res) => {
    const { name, price, category, stock, description } = req.body;
    
    if (!name || !price || !category) {
        return res.status(400).json({
            success: false,
            message: "Name, price, and category are required"
        });
    }
    
    const newProduct = {
        id: products.length + 1,
        name,
        price: parseFloat(price),
        category,
        stock: parseInt(stock) || 0,
        description: description || ""
    };
    
    products.push(newProduct);
    
    res.status(201).json({
        success: true,
        data: newProduct,
        message: "Product created successfully"
    });
});

// PUT /products/:id - Update product
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
    
    const { name, price, category, stock, description } = req.body;
    
    if (name) products[productIndex].name = name;
    if (price) products[productIndex].price = parseFloat(price);
    if (category) products[productIndex].category = category;
    if (stock !== undefined) products[productIndex].stock = parseInt(stock);
    if (description) products[productIndex].description = description;
    
    res.json({
        success: true,
        data: products[productIndex],
        message: "Product updated successfully"
    });
});

// DELETE /products/:id - Delete product
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
    
    const deletedProduct = products.splice(productIndex, 1)[0];
    
    res.json({
        success: true,
        data: deletedProduct,
        message: "Product deleted successfully"
    });
});

// GET /health - Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        service: "Product Service",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Product Service running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET    /products        - Get all products');
    console.log('  GET    /products/:id    - Get specific product');
    console.log('  POST   /products        - Create new product');
    console.log('  PUT    /products/:id    - Update product');
    console.log('  DELETE /products/:id    - Delete product');
    console.log('  GET    /health          - Health check');
});

module.exports = app; 