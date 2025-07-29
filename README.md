# 🛡️ Decentralized Insurance Platform

[![CI/CD Pipeline](https://github.com/divsandhu/decentralized-insurance-platform/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/divsandhu/decentralized-insurance-platform/actions/workflows/ci-cd.yml)
[![Security Scan](https://github.com/divsandhu/decentralized-insurance-platform/actions/workflows/security.yml/badge.svg)](https://github.com/divsandhu/decentralized-insurance-platform/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Coverage Status](https://codecov.io/gh/divsandhu/decentralized-insurance-platform/branch/main/graph/badge.svg)](https://codecov.io/gh/divsandhu/decentralized-insurance-platform)

A comprehensive, production-ready decentralized insurance platform built on Ethereum blockchain, enabling users to create insurance policies, file claims, and process payouts in a transparent and trustless manner.

## 🌟 Features

### Core Functionality
- **🏛️ Smart Contract-Based Policies**: Create and manage insurance policies on Ethereum
- **📋 Automated Claims Processing**: File and process claims with blockchain verification
- **💰 Cryptocurrency Payments**: Handle premiums and payouts in ETH and ERC-20 tokens
- **🔐 MetaMask Integration**: Seamless wallet connection and transaction signing
- **📊 Real-time Analytics**: Comprehensive dashboard with policy and claim statistics

### Advanced Features
- **🤖 Fraud Detection**: AI-powered fraud detection algorithms
- **📈 Risk Assessment**: Dynamic risk scoring and premium calculation
- **🔄 Multi-signature Claims**: Enhanced security for high-value claims
- **📱 Mobile Responsive**: Optimized for all devices
- **🌐 Multi-language Support**: Internationalization ready
- **🔍 IPFS Integration**: Decentralized document storage

### Security & Compliance
- **🛡️ Smart Contract Auditing**: Comprehensive security audits
- **🔒 Role-based Access Control**: Granular permission system
- **📝 KYC/AML Compliance**: Identity verification workflows
- **🔐 Two-Factor Authentication**: Enhanced account security
- **📊 Audit Trails**: Complete transaction history

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Blockchain    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Ethereum)    │
│                 │    │                 │    │                 │
│ • User Interface│    │ • REST API      │    │ • Smart Contract│
│ • Web3 Integration    │ • Authentication│    │ • Policy Storage│
│ • State Management    │ • Database      │    │ • Claim Process │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │    Database     │
                       │   (MongoDB)     │
                       │                 │
                       │ • User Profiles │
                       │ • Off-chain Data│
                       │ • Analytics     │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** >= 6.0
- **MetaMask** browser extension
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/divsandhu/decentralized-insurance-platform.git
   cd decentralized-insurance-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

4. **Configure environment variables**
   ```bash
   # Edit .env and backend/.env with your configuration
   nano .env
   nano backend/.env
   ```

5. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:6.0
   
   # Or using local installation
   mongod
   ```

6. **Compile and deploy smart contracts**
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network localhost
   ```

7. **Start the development servers**
   ```bash
   # Terminal 1: Start blockchain
   npx hardhat node
   
   # Terminal 2: Start backend
   cd backend && npm run dev
   
   # Terminal 3: Start frontend
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

## 🐳 Docker Deployment

### Development Environment
```bash
docker-compose up -d
```

### Production Environment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Individual Services
```bash
# Backend only
docker build -f Dockerfile.backend -t insurance-backend .
docker run -p 5000:5000 insurance-backend

# Frontend only
docker build -f Dockerfile.frontend -t insurance-frontend .
docker run -p 3000:3000 insurance-frontend
```

## 📋 Available Scripts

### Root Directory
```bash
npm run dev          # Start development servers
npm run build        # Build for production
npm run test         # Run all tests
npm run test:ci      # Run tests in CI mode
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run compile      # Compile smart contracts
npm run deploy       # Deploy contracts to network
```

### Backend
```bash
cd backend
npm run dev          # Start development server
npm run start        # Start production server
npm run test         # Run backend tests
npm run test:watch   # Run tests in watch mode
npm run migrate      # Run database migrations
npm run seed         # Seed database with test data
```

## 🧪 Testing

### Smart Contract Tests
```bash
npx hardhat test
npx hardhat coverage
npx hardhat test --gas-report
```

### Backend Tests
```bash
cd backend
npm run test
npm run test:coverage
npm run test:integration
```

### Frontend Tests
```bash
npm run test
npm run test:coverage
npm run test:e2e
```

### Full Test Suite
```bash
npm run test:all
```

## 📚 API Documentation

### Interactive Documentation
Visit http://localhost:5000/api-docs for interactive Swagger documentation.

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/wallet-connect` - Connect wallet
- `POST /api/auth/2fa/setup` - Setup 2FA

#### Policies
- `GET /api/policies` - List user policies
- `POST /api/policies` - Create new policy
- `GET /api/policies/:id` - Get policy details
- `PUT /api/policies/:id` - Update policy

#### Claims
- `GET /api/claims` - List user claims
- `POST /api/claims` - File new claim
- `GET /api/claims/:id` - Get claim details
- `PUT /api/claims/:id/process` - Process claim (admin)

#### Blockchain
- `POST /api/blockchain/sync` - Sync blockchain data
- `GET /api/blockchain/stats` - Get blockchain statistics

## 🔧 Configuration

### Environment Variables

#### Root `.env`
```env
# Blockchain
PRIVATE_KEY=your_ethereum_private_key
ALCHEMY_API_KEY=your_alchemy_api_key
INFURA_PROJECT_ID=your_infura_project_id

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=deployed_contract_address
REACT_APP_NETWORK_ID=1337
```

#### Backend `.env`
```env
# Database
MONGO_URI=mongodb://localhost:27017/decentralized_insurance

# Security
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# Server
PORT=5000
NODE_ENV=development

# External Services
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Network Configuration

#### Hardhat Networks
```javascript
// hardhat.config.js
networks: {
  localhost: {
    url: "http://127.0.0.1:8545"
  },
  sepolia: {
    url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    accounts: [`0x${process.env.PRIVATE_KEY}`]
  },
  mainnet: {
    url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    accounts: [`0x${process.env.PRIVATE_KEY}`]
  }
}
```

## 🔐 Security

### Smart Contract Security
- **Audited Contracts**: All contracts undergo security audits
- **Reentrancy Protection**: Using OpenZeppelin's ReentrancyGuard
- **Access Control**: Role-based permissions with Ownable
- **Pausable Contracts**: Emergency pause functionality

### Backend Security
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input validation
- **SQL Injection Prevention**: Using parameterized queries
- **CORS Configuration**: Proper CORS setup

### Frontend Security
- **CSP Headers**: Content Security Policy implementation
- **XSS Protection**: Input sanitization and output encoding
- **Secure Communication**: HTTPS enforcement
- **Wallet Security**: Secure MetaMask integration

## 📊 Monitoring & Analytics

### Application Monitoring
- **Winston Logging**: Structured logging with multiple transports
- **Health Checks**: Comprehensive health monitoring
- **Performance Metrics**: Response time and throughput tracking
- **Error Tracking**: Centralized error reporting

### Blockchain Monitoring
- **Transaction Tracking**: Real-time transaction monitoring
- **Gas Optimization**: Gas usage analytics and optimization
- **Event Monitoring**: Smart contract event tracking
- **Network Status**: Blockchain network health monitoring

## 🚀 Deployment

### Staging Deployment
```bash
# Deploy to staging
npm run deploy:staging

# Run smoke tests
npm run test:smoke:staging
```

### Production Deployment
```bash
# Deploy to production
npm run deploy:production

# Run health checks
npm run health:check:production
```

### CI/CD Pipeline
The project uses GitHub Actions for continuous integration and deployment:
- **Code Quality**: ESLint, Prettier, and security scanning
- **Testing**: Unit, integration, and E2E tests
- **Security**: Dependency scanning and vulnerability assessment
- **Deployment**: Automated deployment to staging and production

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint configuration
- Write comprehensive tests
- Update documentation
- Follow semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenZeppelin** - Smart contract security frameworks
- **Hardhat** - Ethereum development environment
- **React** - Frontend framework
- **Node.js** - Backend runtime
- **MongoDB** - Database solution

## 📞 Support

- **Documentation**: [docs.decentralized-insurance.com](https://docs.decentralized-insurance.com)
- **Discord**: [Join our community](https://discord.gg/decentralized-insurance)
- **Email**: support@decentralized-insurance.com
- **Issues**: [GitHub Issues](https://github.com/divsandhu/decentralized-insurance-platform/issues)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core insurance functionality
- ✅ Smart contract implementation
- ✅ Basic frontend interface
- ✅ API development

### Phase 2 (Q2 2024)
- 🔄 Advanced fraud detection
- 🔄 Mobile application
- 🔄 Multi-chain support
- 🔄 DeFi integrations

### Phase 3 (Q3 2024)
- 📋 Governance token
- 📋 DAO implementation
- 📋 Cross-chain bridges
- 📋 Advanced analytics

### Phase 4 (Q4 2024)
- 📋 AI-powered underwriting
- 📋 Parametric insurance
- 📋 Global expansion
- 📋 Enterprise solutions

---

**Made with ❤️ by the Decentralized Insurance Team**
