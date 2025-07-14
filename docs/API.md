# API Documentation

## E-commerce API Management Platform

A comprehensive REST API documentation for the e-commerce microservices platform built with WSO2 API Manager integration.

---

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URLs](#base-urls)
- [Product Service API](#product-service-api)
- [User Service API](#user-service-api)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

---

## Overview

This API provides access to e-commerce functionality through two main microservices:

- **Product Service**: Manages product catalog, inventory, and product-related operations
- **User Service**: Handles user authentication, profiles, and user management

All APIs follow REST conventions and return JSON responses with consistent error handling.

---

## Authentication

### WSO2 API Manager Integration

The platform uses WSO2 API Manager for centralized authentication and API management.

#### OAuth2 Authentication Flow

```http
POST /oauth2/token
Host: localhost:9443
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(client_id:client_secret)

grant_type=client_credentials
```

#### Service Provider Details
- **Client ID**: `4fKMNROeFNv9cM9hl63eqIeqre8a`
- **Grant Types**: Code, Implicit, Password, Client Credential
- **Callback URL**: `https://localhost:9443/devportal/apis`

---

## Base URLs

| Service | Direct Access | Via WSO2 Gateway |
|---------|---------------|------------------|
| Product Service | `http://localhost:3001` | `https://localhost:8243/products/v1.0` |
| User Service | `http://localhost:3002` | `https://localhost:8243/users/v1.0` |
| WSO2 Management | N/A | `https://localhost:9443/carbon` |

---

## Product Service API

### Base URL: `http://localhost:3001`

### Endpoints

#### Get All Products

```http
GET /products
```

**Query Parameters:**
- `category` (string, optional): Filter by product category
- `limit` (integer, optional): Maximum number of products to return

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Wireless Bluetooth Headphones",
      "price": 99.99,
      "category": "Electronics",
      "stock": 50,
      "description": "High-quality wireless headphones with noise cancellation"
    }
  ],
  "total": 4
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:3001/products?category=Electronics&limit=2"
```

---

#### Get Product by ID

```http
GET /products/{id}
```

**Path Parameters:**
- `id` (integer, required): Product ID

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Wireless Bluetooth Headphones",
    "price": 99.99,
    "category": "Electronics",
    "stock": 50,
    "description": "High-quality wireless headphones with noise cancellation"
  }
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:3001/products/1"
```

---

#### Create New Product

```http
POST /products
```

**Request Body:**
```json
{
  "name": "Gaming Laptop",
  "price": 1299.99,
  "category": "Electronics",
  "stock": 15,
  "description": "High-performance gaming laptop with RTX graphics"
}
```

**Required Fields:**
- `name` (string): Product name
- `price` (number): Product price
- `category` (string): Product category

**Optional Fields:**
- `stock` (integer): Available quantity (default: 0)
- `description` (string): Product description

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Gaming Laptop",
    "price": 1299.99,
    "category": "Electronics",
    "stock": 15,
    "description": "High-performance gaming laptop with RTX graphics"
  },
  "message": "Product created successfully"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3001/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "price": 1299.99,
    "category": "Electronics",
    "stock": 15,
    "description": "High-performance gaming laptop with RTX graphics"
  }'
```

---

#### Update Product

```http
PUT /products/{id}
```

**Path Parameters:**
- `id` (integer, required): Product ID

**Request Body (Partial Update):**
```json
{
  "name": "Updated Gaming Laptop",
  "price": 1199.99,
  "stock": 20
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Updated Gaming Laptop",
    "price": 1199.99,
    "category": "Electronics",
    "stock": 20,
    "description": "High-performance gaming laptop with RTX graphics"
  },
  "message": "Product updated successfully"
}
```

---

#### Delete Product

```http
DELETE /products/{id}
```

**Path Parameters:**
- `id` (integer, required): Product ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Updated Gaming Laptop",
    "price": 1199.99,
    "category": "Electronics",
    "stock": 20,
    "description": "High-performance gaming laptop with RTX graphics"
  },
  "message": "Product deleted successfully"
}
```

---

#### Product Health Check

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "service": "Product Service",
  "status": "healthy",
  "timestamp": "2025-07-13T16:50:31.479Z"
}
```

---

## User Service API

### Base URL: `http://localhost:3002`

### Endpoints

#### Get All Users

```http
GET /users
```

**Query Parameters:**
- `role` (string, optional): Filter by user role (`admin`, `customer`)
- `active` (boolean, optional): Filter by user status (`true`, `false`)
- `limit` (integer, optional): Maximum number of users to return

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "isActive": true
    }
  ],
  "total": 3
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:3002/users?role=customer&active=true"
```

---

#### Get User by ID

```http
GET /users/{id}
```

**Path Parameters:**
- `id` (integer, required): User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "createdAt": "2024-01-15T10:30:00Z",
    "isActive": true
  }
}
```

---

#### Create New User

```http
POST /users
```

**Request Body:**
```json
{
  "username": "new_user",
  "email": "newuser@example.com",
  "firstName": "New",
  "lastName": "User",
  "role": "customer"
}
```

**Required Fields:**
- `username` (string): Unique username
- `email` (string): User email address
- `firstName` (string): User's first name
- `lastName` (string): User's last name

**Optional Fields:**
- `role` (string): User role (default: "customer")

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "username": "new_user",
    "email": "newuser@example.com",
    "firstName": "New",
    "lastName": "User",
    "role": "customer",
    "createdAt": "2025-07-13T16:50:31.479Z",
    "isActive": true
  },
  "message": "User created successfully"
}
```

**Response (Conflict):**
```json
{
  "success": false,
  "message": "Username or email already exists"
}
```

---

#### Update User

```http
PUT /users/{id}
```

**Path Parameters:**
- `id` (integer, required): User ID

**Request Body (Partial Update):**
```json
{
  "firstName": "Updated Name",
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "username": "new_user",
    "email": "newuser@example.com",
    "firstName": "Updated Name",
    "lastName": "User",
    "role": "customer",
    "createdAt": "2025-07-13T16:50:31.479Z",
    "isActive": false
  },
  "message": "User updated successfully"
}
```

---

#### Delete User (Soft Delete)

```http
DELETE /users/{id}
```

**Path Parameters:**
- `id` (integer, required): User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "username": "new_user",
    "isActive": false
  },
  "message": "User deactivated successfully"
}
```

---

#### User Authentication

```http
POST /users/authenticate
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "token_1_1720889431479"
  },
  "message": "Authentication successful"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Test Credentials:**
- Username: `john_doe`
- Password: `password123`

---

#### User Health Check

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "service": "User Service",
  "status": "healthy",
  "timestamp": "2025-07-13T16:50:33.734Z"
}
```

---

## Error Handling

All APIs use consistent error response format:

### Error Response Structure

```json
{
  "success": false,
  "message": "Error description",
  "error": "Optional detailed error information"
}
```

### HTTP Status Codes

| Status Code | Description | Usage |
|-------------|-------------|--------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server-side errors |

### Common Error Scenarios

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Name, price, and category are required"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

#### 409 Conflict
```json
{
  "success": false,
  "message": "Username or email already exists"
}
```

---

## Rate Limiting

### WSO2 API Manager Policies

When accessing APIs through WSO2 Gateway:

| Tier | Requests per Minute | Requests per Hour |
|------|-------------------|------------------|
| Bronze | 20 | 1,000 |
| Silver | 50 | 2,000 |
| Gold | 100 | 5,000 |
| Unlimited | No limit | No limit |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1720889431
```

---

## Examples

### Complete Workflow Example

#### 1. Get Access Token (WSO2)
```bash
curl -k -X POST https://localhost:9443/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -u "4fKMNROeFNv9cM9hl63eqIeqre8a:4r8MtTnlqlGr2AJNvELBDnGMF6ca"
```

#### 2. Create a New Product
```bash
curl -X POST "http://localhost:3001/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone",
    "price": 699.99,
    "category": "Electronics",
    "stock": 25,
    "description": "Latest smartphone with advanced features"
  }'
```

#### 3. Create a New User
```bash
curl -X POST "http://localhost:3002/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice_wonder",
    "email": "alice@example.com",
    "firstName": "Alice",
    "lastName": "Wonder",
    "role": "customer"
  }'
```

#### 4. Authenticate User
```bash
curl -X POST "http://localhost:3002/users/authenticate" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

#### 5. Get Filtered Products
```bash
curl -X GET "http://localhost:3001/products?category=Electronics&limit=3"
```

#### 6. Update Product Stock
```bash
curl -X PUT "http://localhost:3001/products/1" \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 75
  }'
```

#### 7. Check Service Health
```bash
curl -X GET "http://localhost:3001/health"
curl -X GET "http://localhost:3002/health"
```

---

### Testing with Different Tools

#### Using Postman
1. Import the endpoints from this documentation
2. Set up environment variables for base URLs
3. Create collections for Product and User APIs
4. Add authorization headers for WSO2 integration

#### Using JavaScript (Frontend)
```javascript
// Get all products
const getProducts = async () => {
  try {
    const response = await fetch('http://localhost:3001/products');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Create new user
const createUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:3002/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## Development Notes

### CORS Configuration
Both services are configured to accept cross-origin requests for development purposes.

### Data Persistence
Current implementation uses in-memory storage. For production:
- Implement database integration (MongoDB, PostgreSQL)
- Add data validation middleware
- Implement proper authentication and authorization

### Environment Variables
Recommended environment variables for production deployment:
- `NODE_ENV`: Environment (development/production)
- `PRODUCT_PORT`: Product service port (default: 3001)
- `USER_PORT`: User service port (default: 3002)
- `DB_CONNECTION_STRING`: Database connection string
- `JWT_SECRET`: Secret for JWT token generation

---

## Support

For issues or questions:
- Open an issue on GitHub: [ecommerce-api-project](https://github.com/Thisun-17/ecommerce-api-project-)
- Check the README.md for setup instructions
- Review the WSO2 Integration documentation

---

*Last updated: July 2025*
*API Version: 1.0.0*