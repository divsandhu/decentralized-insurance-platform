# Contributing to Decentralized Insurance Platform

First off, thank you for considering contributing to the Decentralized Insurance Platform! It's people like you that make this project a great tool for the decentralized finance community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Security Vulnerabilities](#security-vulnerabilities)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@decentralized-insurance.com](mailto:conduct@decentralized-insurance.com).

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, Node.js version, browser, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain the behavior you expected**
- **Explain why this enhancement would be useful**

### 🔧 Code Contributions

#### Types of Contributions We're Looking For

- **Bug fixes**
- **Feature implementations**
- **Performance improvements**
- **Documentation improvements**
- **Test coverage improvements**
- **Security enhancements**
- **UI/UX improvements**

## 🛠️ Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 6.0
- Git
- MetaMask browser extension

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/decentralized-insurance-platform.git
   cd decentralized-insurance-platform
   ```

3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/divsandhu/decentralized-insurance-platform.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   # Edit the files with your configuration
   ```

6. **Start the development environment**:
   ```bash
   # Terminal 1: Start blockchain
   npx hardhat node
   
   # Terminal 2: Start backend
   cd backend && npm run dev
   
   # Terminal 3: Start frontend
   npm run dev
   ```

### Development Workflow

1. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm run test
   npm run lint
   ```

4. **Commit your changes** with a descriptive commit message:
   ```bash
   git commit -m "feat: add new insurance policy type validation"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 🔄 Pull Request Process

### Before Submitting a Pull Request

- [ ] Ensure your code follows our coding standards
- [ ] Add tests for any new functionality
- [ ] Update documentation if necessary
- [ ] Ensure all tests pass
- [ ] Ensure the build passes
- [ ] Update the CHANGELOG.md if applicable

### Pull Request Template

When creating a pull request, please use our template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
```

### Review Process

1. **Automated Checks**: All PRs must pass our CI/CD pipeline
2. **Code Review**: At least one maintainer must review and approve
3. **Testing**: All tests must pass
4. **Documentation**: Documentation must be updated if applicable

## 📝 Coding Standards

### JavaScript/Node.js

- Use **ESLint** configuration provided in the project
- Use **Prettier** for code formatting
- Follow **Airbnb JavaScript Style Guide**
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and constructors
- Use **UPPER_SNAKE_CASE** for constants

#### Example:
```javascript
// Good
const userAccount = {
  firstName: 'John',
  lastName: 'Doe',
  calculatePremium() {
    return this.basePremium * this.riskMultiplier;
  }
};

// Bad
const user_account = {
  first_name: 'John',
  last_name: 'Doe',
  calculate_premium: function() {
    return this.base_premium * this.risk_multiplier;
  }
};
```

### Solidity

- Follow **Solidity Style Guide**
- Use **OpenZeppelin** contracts when possible
- Include comprehensive **NatSpec** documentation
- Use **explicit visibility** for all functions
- Implement proper **error handling**

#### Example:
```solidity
/**
 * @title InsurancePolicy
 * @dev Handles insurance policy creation and management
 */
contract InsurancePolicy is Ownable, ReentrancyGuard {
    /**
     * @notice Creates a new insurance policy
     * @param _policyType Type of insurance policy
     * @param _coverage Coverage amount in wei
     * @param _duration Policy duration in seconds
     * @return policyId The ID of the created policy
     */
    function createPolicy(
        PolicyType _policyType,
        uint256 _coverage,
        uint256 _duration
    ) external payable nonReentrant returns (uint256 policyId) {
        require(_coverage > 0, "Coverage must be greater than 0");
        // Implementation
    }
}
```

### React/Frontend

- Use **functional components** with hooks
- Use **TypeScript** for type safety (when applicable)
- Follow **React best practices**
- Use **semantic HTML**
- Implement **accessibility standards**

#### Example:
```jsx
// Good
const PolicyCard = ({ policy, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await onUpdate(policy.id);
    } catch (error) {
      console.error('Failed to update policy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="policy-card" role="article" aria-label={`Policy ${policy.id}`}>
      <h3>{policy.type}</h3>
      <button onClick={handleUpdate} disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Policy'}
      </button>
    </div>
  );
};
```

## 🧪 Testing Guidelines

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database interactions
- **Smart Contract Tests**: Test contract functionality and edge cases
- **E2E Tests**: Test complete user workflows

### Writing Tests

#### Backend Tests (Jest)
```javascript
describe('Policy Service', () => {
  describe('createPolicy', () => {
    it('should create a policy with valid data', async () => {
      const policyData = {
        type: 'Auto',
        coverage: '10000',
        premium: '100'
      };
      
      const result = await policyService.createPolicy(policyData);
      
      expect(result).toHaveProperty('id');
      expect(result.type).toBe('Auto');
    });
    
    it('should throw error with invalid data', async () => {
      const invalidData = { type: '' };
      
      await expect(policyService.createPolicy(invalidData))
        .rejects.toThrow('Policy type is required');
    });
  });
});
```

#### Smart Contract Tests (Hardhat)
```javascript
describe('InsurancePolicy', () => {
  let insurancePolicy;
  let owner, user1, user2;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    const InsurancePolicy = await ethers.getContractFactory('InsurancePolicy');
    insurancePolicy = await InsurancePolicy.deploy();
  });

  it('should create a policy', async () => {
    const premium = ethers.utils.parseEther('1');
    const coverage = ethers.utils.parseEther('10');
    
    await expect(
      insurancePolicy.connect(user1).createPolicy(0, coverage, 86400, 'test', { value: premium })
    ).to.emit(insurancePolicy, 'PolicyCreated');
  });
});
```

### Test Coverage

- Maintain **minimum 80% test coverage**
- Critical paths should have **100% coverage**
- Include **edge cases** and **error scenarios**

## 📚 Documentation

### Code Documentation

- Use **JSDoc** for JavaScript functions
- Use **NatSpec** for Solidity contracts
- Include **inline comments** for complex logic
- Update **README.md** for significant changes

### API Documentation

- Update **Swagger/OpenAPI** specifications
- Include **request/response examples**
- Document **error codes** and messages
- Provide **authentication** details

## 🐛 Issue Reporting

### Bug Reports

Use the bug report template and include:

- **Environment details**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots or logs**
- **Possible solutions** (if any)

### Feature Requests

Use the feature request template and include:

- **Problem description**
- **Proposed solution**
- **Alternative solutions**
- **Additional context**

## 🔒 Security Vulnerabilities

**DO NOT** create public issues for security vulnerabilities. Instead:

1. Email us at [security@decentralized-insurance.com](mailto:security@decentralized-insurance.com)
2. Include detailed information about the vulnerability
3. Allow reasonable time for us to address the issue
4. We will credit you in our security acknowledgments

## 🏷️ Commit Message Guidelines

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples:
```
feat(api): add policy renewal endpoint
fix(contract): resolve reentrancy vulnerability
docs(readme): update installation instructions
test(policy): add unit tests for policy validation
```

## 🎯 Issue Labels

We use labels to categorize issues:

- **bug**: Something isn't working
- **enhancement**: New feature or improvement
- **documentation**: Documentation improvements
- **good first issue**: Good for newcomers
- **help wanted**: Extra attention is needed
- **security**: Security-related issues
- **performance**: Performance improvements
- **ui/ux**: User interface/experience improvements

## 🚀 Release Process

1. **Version Bump**: Update version in package.json
2. **Changelog**: Update CHANGELOG.md
3. **Tag Release**: Create git tag
4. **GitHub Release**: Create release on GitHub
5. **Deploy**: Automated deployment via CI/CD

## 📞 Getting Help

- **Discord**: [Join our community](https://discord.gg/decentralized-insurance)
- **Discussions**: Use GitHub Discussions for questions
- **Email**: [dev@decentralized-insurance.com](mailto:dev@decentralized-insurance.com)

## 🙏 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes**
- **Annual contributor report**
- **Special mentions** in community channels

Thank you for contributing to the Decentralized Insurance Platform! 🎉