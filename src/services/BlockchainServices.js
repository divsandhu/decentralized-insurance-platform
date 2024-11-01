import Web3 from 'web3';
import contractABI from '../abis/abi.json';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with the testnet/mainnet address if applicable

class BlockchainService {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.account = null;
    }

    async initialize() {
        if (window.ethereum) {
            try {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.web3 = new Web3(window.ethereum);
                
                // Initialize the contract
                this.contract = new this.web3.eth.Contract(contractABI, contractAddress);

                // Get the current account
                const accounts = await this.web3.eth.getAccounts();
                this.account = accounts[0];

                // Listen for account changes
                window.ethereum.on('accountsChanged', (accounts) => {
                    this.account = accounts[0];
                });

                return true;
            } catch (error) {
                console.error("User denied account access or error occurred:", error);
                return false;
            }
        } else {
            console.error("Please install MetaMask!");
            return false;
        }
    }

    async createPolicy(premium, coverage, duration, policyType) {
        try {
            const result = await this.contract.methods
                .createPolicy(
                    this.web3.utils.toWei(premium, 'ether'), // Convert to wei
                    coverage,
                    duration,
                    policyType
                )
                .send({ 
                    from: this.account,
                    value: this.web3.utils.toWei(premium, 'ether') // Send premium as value
                });
            return result;
        } catch (error) {
            console.error("Error creating policy:", error);
            throw error;
        }
    }

    async fileClaim(policyId, amount, description) {
        try {
            const result = await this.contract.methods
                .fileClaim(policyId, amount, description)
                .send({ from: this.account });
            return result;
        } catch (error) {
            console.error("Error filing claim:", error);
            throw error;
        }
    }

    async getPolicyDetails(policyId) {
        try {
            const policy = await this.contract.methods
                .getPolicyDetails(policyId)
                .call();
            return policy;
        } catch (error) {
            console.error("Error getting policy details:", error);
            throw error;
        }
    }

    async getClaimDetails(claimId) {
        try {
            const claim = await this.contract.methods
                .getClaimDetails(claimId)
                .call();
            return claim;
        } catch (error) {
            console.error("Error getting claim details:", error);
            throw error;
        }
    }
}

export default new BlockchainService();
