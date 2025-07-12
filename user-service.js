// user-service.js - Mock E-commerce User Service
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Mock user data
const users = [
    {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "customer",
        createdAt: "2024-01-15T10:30:00Z",
        isActive: true
    },
    {
        id: 2,
        username: "jane_smith",
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Smith",
        role: "admin",
        createdAt: "2024-01-10T08:15:00Z",
        isActive: true
    },
    {
        id: 3,
        username: "bob_wilson",
        email: "bob@example.com",
        firstName: "Bob",
        lastName: "Wilson",
        role: "customer",
        createdAt: "2024-02-01T14:20:00Z",
        isActive: false
    }
];

// GET /users - Get all users
app.get('/users', (req, res) => {
    const role = req.query.role;
    const active = req.query.active;
    const limit = parseInt(req.query.limit) || users.length;
    
    let filteredUsers = users;
    
    if (role) {
        filteredUsers = filteredUsers.filter(u => 
            u.role.toLowerCase() === role.toLowerCase()
        );
    }
    
    if (active !== undefined) {
        const isActive = active.toLowerCase() === 'true';
        filteredUsers = filteredUsers.filter(u => u.isActive === isActive);
    }
    
    // Remove sensitive data for list view
    const safeUsers = filteredUsers.slice(0, limit).map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive
    }));
    
    res.json({
        success: true,
        data: safeUsers,
        total: filteredUsers.length
    });
});

// GET /users/:id - Get specific user
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    
    // Remove sensitive data
    const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
        isActive: user.isActive
    };
    
    res.json({
        success: true,
        data: safeUser
    });
});

// POST /users - Create new user
app.post('/users', (req, res) => {
    const { username, email, firstName, lastName, role } = req.body;
    
    if (!username || !email || !firstName || !lastName) {
        return res.status(400).json({
            success: false,
            message: "Username, email, firstName, and lastName are required"
        });
    }
    
    // Check if username or email already exists
    const existingUser = users.find(u => 
        u.username === username || u.email === email
    );
    
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "Username or email already exists"
        });
    }
    
    const newUser = {
        id: users.length + 1,
        username,
        email,
        firstName,
        lastName,
        role: role || "customer",
        createdAt: new Date().toISOString(),
        isActive: true
    };
    
    users.push(newUser);
    
    // Return user without sensitive data
    const safeUser = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        createdAt: newUser.createdAt,
        isActive: newUser.isActive
    };
    
    res.status(201).json({
        success: true,
        data: safeUser,
        message: "User created successfully"
    });
});

// POST /users/authenticate - Simple authentication endpoint
app.post('/users/authenticate', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }
    
    // Simple authentication logic (in real apps, use proper password hashing)
    const user = users.find(u => 
        u.username === username && u.isActive
    );
    
    if (!user || password !== "password123") {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }
    
    // Return authentication token (simplified)
    const token = `token_${user.id}_${Date.now()}`;
    
    res.json({
        success: true,
        data: {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            token: token
        },
        message: "Authentication successful"
    });
});

// GET /health - Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        service: "User Service",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`User Service running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET    /users              - Get all users');
    console.log('  GET    /users/:id          - Get specific user');
    console.log('  POST   /users              - Create new user');
    console.log('  POST   /users/authenticate - Authenticate user');
    console.log('  GET    /health             - Health check');
    console.log('');
    console.log('Test authentication with:');
    console.log('  Username: john_doe, Password: password123');
});

module.exports = app; 