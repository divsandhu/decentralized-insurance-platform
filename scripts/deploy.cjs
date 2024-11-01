const hre = require("hardhat");

async function main() {
  console.log("Deploying Insurance Policy contract...");
  const InsurancePolicy = await hre.ethers.getContractFactory("InsurancePolicy");
  const insurancePolicy = await InsurancePolicy.deploy();
  // Wait for deployment
  await insurancePolicy.waitForDeployment();
  // Log the address
  console.log("InsurancePolicy deployed to:", insurancePolicy.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });