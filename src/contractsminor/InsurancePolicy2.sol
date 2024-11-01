// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";



contract InsurancePolicy is Ownable, ReentrancyGuard {
    struct Policy {
        uint256 id;
        address holder;
        uint256 premium;
        uint256 coverage;
        uint256 startDate;
        uint256 endDate;
        bool active;
        string policyType;
    }

    struct Claim {
        uint256 id;
        uint256 policyId;
        address claimant;
        uint256 amount;
        string description;
        bool approved;
        bool processed;
    }

    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Claim) public claims;
    uint256 public policyCounter;
    uint256 public claimCounter;

    event PolicyCreated(uint256 indexed policyId, address indexed holder, uint256 premium);
    event ClaimFiled(uint256 indexed claimId, uint256 indexed policyId, address indexed claimant);
    event ClaimProcessed(uint256 indexed claimId, bool approved, uint256 amount);

    constructor() Ownable(msg.sender) ReentrancyGuard() {
    policyCounter = 0;
    claimCounter = 0;
}


    function createPolicy(
        uint256 _premium,
        uint256 _coverage,
        uint256 _duration,
        string memory _policyType
    ) external payable nonReentrant {
        require(msg.value == _premium, "Premium amount must match sent value");
        
        policies[policyCounter] = Policy({
            id: policyCounter,
            holder: msg.sender,
            premium: _premium,
            coverage: _coverage,
            startDate: block.timestamp,
            endDate: block.timestamp + _duration,
            active: true,
            policyType: _policyType
        });

        emit PolicyCreated(policyCounter, msg.sender, _premium);
        policyCounter++;
    }

    function fileClaim(
        uint256 _policyId,
        uint256 _amount,
        string memory _description
    ) external {
        require(policies[_policyId].holder == msg.sender, "Not policy holder");
        require(policies[_policyId].active, "Policy not active");
        require(block.timestamp <= policies[_policyId].endDate, "Policy expired");

        claims[claimCounter] = Claim({
            id: claimCounter,
            policyId: _policyId,
            claimant: msg.sender,
            amount: _amount,
            description: _description,
            approved: false,
            processed: false
        });

        emit ClaimFiled(claimCounter, _policyId, msg.sender);
        claimCounter++;
    }

    function processClaim(uint256 _claimId, bool _approved) external onlyOwner {
        Claim storage claim = claims[_claimId];
        require(!claim.processed, "Claim already processed");
        
        claim.approved = _approved;
        claim.processed = true;

        if (_approved) {
            payable(claim.claimant).transfer(claim.amount);
        }

        emit ClaimProcessed(_claimId, _approved, claim.amount);
    }

    function getPolicyDetails(uint256 _policyId) external view returns (Policy memory) {
        return policies[_policyId];
    }

    function getClaimDetails(uint256 _claimId) external view returns (Claim memory) {
        return claims[_claimId];
    }
}