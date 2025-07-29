// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title InsurancePolicy
 * @dev A comprehensive decentralized insurance platform smart contract
 */
contract InsurancePolicy is Ownable, ReentrancyGuard, Pausable {
    
    // Enums
    enum PolicyStatus { Active, Expired, Cancelled, Suspended }
    enum ClaimStatus { Pending, Approved, Rejected, Paid }
    enum PolicyType { Life, Health, Auto, Property, Travel }

    // Structs
    struct Policy {
        uint256 id;
        address holder;
        PolicyType policyType;
        uint256 premium;
        uint256 coverage;
        uint256 startDate;
        uint256 endDate;
        PolicyStatus status;
        string metadataHash; // IPFS hash for additional policy documents
        uint256 totalClaims;
        uint256 totalPayouts;
    }

    struct Claim {
        uint256 id;
        uint256 policyId;
        address claimant;
        uint256 amount;
        string description;
        string evidenceHash; // IPFS hash for claim evidence
        ClaimStatus status;
        uint256 filedDate;
        uint256 processedDate;
        string rejectionReason;
    }

    struct PolicyHolder {
        address wallet;
        uint256[] policyIds;
        uint256 totalPolicies;
        uint256 totalClaims;
        bool isBlacklisted;
        uint256 reputationScore;
    }

    // State variables
    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Claim) public claims;
    mapping(address => PolicyHolder) public policyHolders;
    mapping(address => bool) public authorizedAdjusters;
    
    uint256 public policyCounter;
    uint256 public claimCounter;
    uint256 public totalPremiumsCollected;
    uint256 public totalPayouts;
    uint256 public platformFeePercentage = 5; // 5%
    
    // Events
    event PolicyCreated(
        uint256 indexed policyId, 
        address indexed holder, 
        PolicyType policyType,
        uint256 premium,
        uint256 coverage
    );
    
    event ClaimFiled(
        uint256 indexed claimId, 
        uint256 indexed policyId, 
        address indexed claimant,
        uint256 amount
    );
    
    event ClaimProcessed(
        uint256 indexed claimId, 
        ClaimStatus status,
        uint256 amount
    );
    
    event PolicyStatusChanged(
        uint256 indexed policyId,
        PolicyStatus oldStatus,
        PolicyStatus newStatus
    );

    event AdjusterAuthorized(address indexed adjuster);
    event AdjusterRevoked(address indexed adjuster);

    // Modifiers
    modifier onlyPolicyHolder(uint256 _policyId) {
        require(policies[_policyId].holder == msg.sender, "Not policy holder");
        _;
    }

    modifier onlyAuthorizedAdjuster() {
        require(authorizedAdjusters[msg.sender] || msg.sender == owner(), "Not authorized adjuster");
        _;
    }

    modifier validPolicy(uint256 _policyId) {
        require(_policyId < policyCounter, "Policy does not exist");
        require(policies[_policyId].status == PolicyStatus.Active, "Policy not active");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new insurance policy
     */
    function createPolicy(
        PolicyType _policyType,
        uint256 _coverage,
        uint256 _duration,
        string memory _metadataHash
    ) external payable nonReentrant whenNotPaused {
        require(msg.value > 0, "Premium must be greater than 0");
        require(_coverage > 0, "Coverage must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        require(!policyHolders[msg.sender].isBlacklisted, "Address is blacklisted");

        uint256 platformFee = (msg.value * platformFeePercentage) / 100;
        uint256 actualPremium = msg.value - platformFee;

        policies[policyCounter] = Policy({
            id: policyCounter,
            holder: msg.sender,
            policyType: _policyType,
            premium: actualPremium,
            coverage: _coverage,
            startDate: block.timestamp,
            endDate: block.timestamp + _duration,
            status: PolicyStatus.Active,
            metadataHash: _metadataHash,
            totalClaims: 0,
            totalPayouts: 0
        });

        // Update policy holder info
        if (policyHolders[msg.sender].totalPolicies == 0) {
            policyHolders[msg.sender].wallet = msg.sender;
            policyHolders[msg.sender].reputationScore = 100; // Starting reputation
        }
        
        policyHolders[msg.sender].policyIds.push(policyCounter);
        policyHolders[msg.sender].totalPolicies++;
        
        totalPremiumsCollected += actualPremium;

        emit PolicyCreated(policyCounter, msg.sender, _policyType, actualPremium, _coverage);
        policyCounter++;
    }

    /**
     * @dev File a claim against a policy
     */
    function fileClaim(
        uint256 _policyId,
        uint256 _amount,
        string memory _description,
        string memory _evidenceHash
    ) external validPolicy(_policyId) onlyPolicyHolder(_policyId) nonReentrant {
        require(_amount > 0, "Claim amount must be greater than 0");
        require(_amount <= policies[_policyId].coverage, "Claim exceeds coverage");
        require(block.timestamp <= policies[_policyId].endDate, "Policy expired");
        require(bytes(_description).length > 0, "Description required");

        claims[claimCounter] = Claim({
            id: claimCounter,
            policyId: _policyId,
            claimant: msg.sender,
            amount: _amount,
            description: _description,
            evidenceHash: _evidenceHash,
            status: ClaimStatus.Pending,
            filedDate: block.timestamp,
            processedDate: 0,
            rejectionReason: ""
        });

        policies[_policyId].totalClaims++;
        policyHolders[msg.sender].totalClaims++;

        emit ClaimFiled(claimCounter, _policyId, msg.sender, _amount);
        claimCounter++;
    }

    /**
     * @dev Process a claim (approve or reject)
     */
    function processClaim(
        uint256 _claimId,
        bool _approved,
        string memory _rejectionReason
    ) external onlyAuthorizedAdjuster nonReentrant {
        require(_claimId < claimCounter, "Claim does not exist");
        Claim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.Pending, "Claim already processed");

        if (_approved) {
            require(address(this).balance >= claim.amount, "Insufficient contract balance");
            
            claim.status = ClaimStatus.Approved;
            policies[claim.policyId].totalPayouts += claim.amount;
            totalPayouts += claim.amount;
            
            // Transfer claim amount to claimant
            payable(claim.claimant).transfer(claim.amount);
            claim.status = ClaimStatus.Paid;
        } else {
            claim.status = ClaimStatus.Rejected;
            claim.rejectionReason = _rejectionReason;
        }

        claim.processedDate = block.timestamp;
        emit ClaimProcessed(_claimId, claim.status, claim.amount);
    }

    /**
     * @dev Update policy status
     */
    function updatePolicyStatus(uint256 _policyId, PolicyStatus _newStatus) 
        external 
        onlyOwner 
    {
        require(_policyId < policyCounter, "Policy does not exist");
        PolicyStatus oldStatus = policies[_policyId].status;
        policies[_policyId].status = _newStatus;
        
        emit PolicyStatusChanged(_policyId, oldStatus, _newStatus);
    }

    /**
     * @dev Authorize an adjuster
     */
    function authorizeAdjuster(address _adjuster) external onlyOwner {
        authorizedAdjusters[_adjuster] = true;
        emit AdjusterAuthorized(_adjuster);
    }

    /**
     * @dev Revoke adjuster authorization
     */
    function revokeAdjuster(address _adjuster) external onlyOwner {
        authorizedAdjusters[_adjuster] = false;
        emit AdjusterRevoked(_adjuster);
    }

    /**
     * @dev Blacklist a policy holder
     */
    function blacklistAddress(address _address) external onlyOwner {
        policyHolders[_address].isBlacklisted = true;
    }

    /**
     * @dev Remove from blacklist
     */
    function removeFromBlacklist(address _address) external onlyOwner {
        policyHolders[_address].isBlacklisted = false;
    }

    /**
     * @dev Update platform fee percentage
     */
    function updatePlatformFee(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= 10, "Fee cannot exceed 10%");
        platformFeePercentage = _newFeePercentage;
    }

    /**
     * @dev Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Withdraw platform fees
     */
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > totalPayouts, "No fees to withdraw");
        
        uint256 fees = balance - totalPayouts;
        payable(owner()).transfer(fees);
    }

    // View functions
    function getPolicyDetails(uint256 _policyId) external view returns (Policy memory) {
        require(_policyId < policyCounter, "Policy does not exist");
        return policies[_policyId];
    }

    function getClaimDetails(uint256 _claimId) external view returns (Claim memory) {
        require(_claimId < claimCounter, "Claim does not exist");
        return claims[_claimId];
    }

    function getPolicyHolderInfo(address _holder) external view returns (PolicyHolder memory) {
        return policyHolders[_holder];
    }

    function getContractStats() external view returns (
        uint256 totalPolicies,
        uint256 totalClaimsCount,
        uint256 totalPremiums,
        uint256 totalPayoutsAmount,
        uint256 contractBalance
    ) {
        return (
            policyCounter,
            claimCounter,
            totalPremiumsCollected,
            totalPayouts,
            address(this).balance
        );
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
