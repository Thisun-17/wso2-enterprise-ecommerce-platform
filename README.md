# E-commerce API Management Platform

A comprehensive microservices-based e-commerce API platform built with **WSO2 API Manager**, Node.js, and Express, demonstrating enterprise-grade API management and security.

## 🏗️ Architecture Overview

```
🌐 Client Applications
       ↓
🔒 WSO2 API Manager (API Gateway)
   ├── OAuth2 Authentication
   ├── Rate Limiting & Throttling  
   ├── API Analytics & Monitoring
   ├── Developer Portal
   └── Management Console
       ↓
🏗️ Backend Microservices
   ├── Product Service (Port 3001) 
   └── User Service (Port 3002)
```

## 🚀 Key Features

### 🔐 Enterprise API Management (WSO2)
- ✅ **OAuth2 Authentication** with client credentials
- ✅ **API Gateway** for centralized request routing
- ✅ **Rate Limiting** and throttling policies
- ✅ **Developer Portal** for API discovery
- ✅ **Management Console** for administrative control
- ✅ **Service Provider** configuration for secure access

### 📦 Product Service (Port 3001)
- ✅ Complete CRUD operations for product management
- ✅ Category-based filtering and search
- ✅ Inventory tracking with stock management
- ✅ Pagination and data limiting
- ✅ Health check endpoints for monitoring
- ✅ Comprehensive error handling

### 👥 User Service (Port 3002)
- ✅ User management with role-based access
- ✅ Authentication simulation with token generation
- ✅ Profile management and user status tracking
- ✅ Admin and customer role differentiation
- ✅ Secure data handling (sensitive data filtering)
- ✅ Duplicate user prevention

## 🛠️ Tech Stack

### API Management
- **WSO2 API Manager 4.5.0** - Enterprise API gateway
- **OAuth2** - Authentication and authorization
- **HTTPS/TLS** - Secure communication

### Backend Services
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing
- **JSON** - Data exchange format

### Development Environment
- **Java 17** - Required for WSO2 API Manager
- **Windows 11** - Development platform

## 📦 Installation & Setup

### Prerequisites
```bash
# Java 17 (required for WSO2)
java -version  # Should show version 17.x.x

# Node.js and npm
node --version  # v16.0.0 or higher
npm --version   # 8.0.0 or higher
```

### 1. WSO2 API Manager Setup

1. **Download WSO2 API Manager 4.5.0**
   ```bash
   # Extract to C:\WSO2\wso2am-4.5.0
   cd C:\WSO2\wso2am-4.5.0\bin
   ```

2. **Start WSO2 API Manager**
   ```bash
   # Windows
   api-manager.bat
   
   # Linux/Mac
   ./api-manager.sh
   ```

3. **Access WSO2 Portals**
   - **Management Console**: https://localhost:9443/carbon
   - **Publisher Portal**: https://localhost:9443/publisher
   - **Developer Portal**: https://localhost:9443/devportal
   - **Login**: admin/admin

### 2. Backend Services Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Thisun-17/ecommerce-api-project-.git
   cd ecommerce-api-project-
   ```

2. **Install dependencies**
   ```bash
   npm install express cors
   ```

3. **Start the services**
   ```bash
   # Terminal 1 - Product Service
   node product-service.js
   
   # Terminal 2 - User Service  
   node user-service.js
   ```

## 🔧 WSO2 Configuration

### Service Provider Setup
1. **Navigate to Management Console**: https://localhost:9443/carbon
2. **Go to**: Identity → Service Providers → Add
3. **Configure OAuth2**:
   - Grant Types: Code, Implicit, Password, Client Credential
   - Callback URL: `https://localhost:9443/devportal/apis`

### API Creation via WSO2
```bash
# Get OAuth2 token for API management
curl -k -X POST https://localhost:9443/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -u "CLIENT_ID:CLIENT_SECRET"
```

## 📖 API Documentation

### Product Service Endpoints

#### Get All Products
```http
GET /products
```
**Query Parameters:**
- `category` (optional): Filter by product category
- `limit` (optional): Limit number of results

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

#### Health Check
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

### User Service Endpoints

#### Get All Users
```http
GET /users
```
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

#### User Authentication
```http
POST /users/authenticate
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

## 🧪 Testing the Complete System

### 1. Test Backend Services
```bash
# Product Service
curl http://localhost:3001/products
curl http://localhost:3001/health

# User Service
curl http://localhost:3002/users
curl http://localhost:3002/health
```

### 2. Test WSO2 Gateway
```bash
# Health check
curl -k https://localhost:9443/api/am/gateway/v2/server-startup-healthcheck

# Management Console
curl -k https://localhost:9443/carbon
```

### 3. End-to-End API Testing
```bash
# Through WSO2 Gateway (once APIs are published)
curl -k -H "Authorization: Bearer TOKEN" \
  https://localhost:8243/products/v1.0/products
```

## 🏆 Enterprise Features Demonstrated

### API Management
- **Centralized Gateway**: Single entry point for all APIs
- **Security**: OAuth2 authentication and authorization
- **Monitoring**: Health checks and service discovery
- **Documentation**: Auto-generated API documentation
- **Rate Limiting**: Configurable throttling policies

### Microservices Architecture
- **Service Separation**: Independent, loosely coupled services
- **Scalability**: Each service can be scaled independently
- **Fault Isolation**: Service failures don't cascade
- **Technology Diversity**: Different services can use different tech stacks

### Production Readiness
- **Error Handling**: Comprehensive error responses
- **Logging**: Service activity monitoring
- **Health Checks**: Service availability monitoring
- **CORS**: Cross-origin request handling
- **Data Validation**: Input sanitization and validation

## 📊 Sample Data

### Pre-loaded Products
- Wireless Bluetooth Headphones (Electronics, $99.99)
- Smart Watch (Electronics, $299.99)
- Running Shoes (Sports, $129.99)
- Coffee Maker (Home, $79.99)

### Sample Users
- **john_doe** (Customer, Active)
- **jane_smith** (Admin, Active)
- **bob_wilson** (Customer, Inactive)

## 🔮 Future Enhancements

### Short-term
- [ ] Complete OAuth2 token flow integration
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Comprehensive API rate limiting
- [ ] Enhanced error logging and monitoring

### Long-term
- [ ] Order management service
- [ ] Payment processing integration
- [ ] Container deployment with Docker
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Performance testing and optimization
- [ ] API versioning strategy

## 💼 Skills Demonstrated

### Technical Skills
- **Enterprise API Management** using WSO2
- **Microservices Architecture** design and implementation
- **RESTful API Development** with Express.js
- **OAuth2 Authentication** setup and configuration
- **System Integration** and testing
- **Enterprise Software** installation and configuration

### Professional Skills
- **Problem-solving** through complex technical challenges
- **Documentation** of enterprise-level implementations
- **Project Management** from conception to deployment
- **Troubleshooting** and debugging in enterprise environments

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: [https://github.com/Thisun-17/ecommerce-api-project-](https://github.com/Thisun-17/ecommerce-api-project-)
- **WSO2 API Manager**: [https://wso2.com/api-manager/](https://wso2.com/api-manager/)
- **Issues**: [https://github.com/Thisun-17/ecommerce-api-project-/issues](https://github.com/Thisun-17/ecommerce-api-project-/issues)

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

⭐ **Star this repository if you find it helpful!**

> **Note**: This project demonstrates enterprise-level API management skills using WSO2 API Manager, making it suitable for production environments and enterprise integration scenarios.