# Decentralized Insurance Platform

This **Decentralized Insurance Platform** allows users to create and manage insurance policies, file claims, and process claims on the blockchain. The platform leverages **Solidity** for smart contract development, **Hardhat** for testing and deployment, and **React** for the front-end interface, enabling users to interact with the insurance system securely and transparently.

## Features

- **Policy Purchase**: Create, view, and manage policies.
- **Blockchain Integration**: All interactions are secured and recorded on the blockchain, ensuring transparency.
- **MetaMask Authentication**: Connect with MetaMask for blockchain transactions.
- **User-Friendly Interface**: An interactive dashboard for users to manage policies and claims easily.

## Technology Stack

- **Smart Contracts**: Solidity, OpenZeppelin (Ownable, ReentrancyGuard)
- **Blockchain**: Ethereum (Deployed on Sepolia Test Network)
- **Backend**: Hardhat (for local deployment and testing)
- **Frontend**: React, Vite
- **Web3 Integration**: web3.js for interacting with Ethereum blockchain
- **API**: Alchemy (for access to Ethereum nodes)

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MetaMask](https://metamask.io/)
- [Hardhat](https://hardhat.org/)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/divsandhu/decentralized-insurance-platform.git
cd decentralized-insurance-platform
```
### 2.Install Dependencies
```bash
npm install
```

### 3. Compile and Deploy Smart Contracts
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```
following environment variables:

### 4. In the Root `.env` File:

```plaintext
# Blockchain network details
PRIVATE_KEY=<Your Infura Project API Key>
ALCHEMY_API_KEY=<Your Alchemy API Key>
```

### 5. Start the front end
```bash
npm run dev
```

### Author
```plain text
Divyansh Sandhu
```
