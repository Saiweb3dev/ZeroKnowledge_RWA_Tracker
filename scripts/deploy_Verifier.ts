import hre from "hardhat"

async function main(){
  const VerifierFactory = await hre.ethers.getContractFactory("Verifier");
  const verifier = await VerifierFactory.deploy();

  const contractAddress:string = typeof verifier.target === 'string' ? verifier.target : verifier.target.toString();

  console.log(`The verifierETH Contract deployed at ${contractAddress}`)

  const abi = VerifierFactory.interface.formatJson();
  const abiFormated = JSON.parse(abi);
  // console.log(abiFormated)
  // work in here of sending the abi properly
  await hre.deployments.save("verifierETH",{
    abi:abiFormated,
    address:contractAddress,
  })
}

main()
 .then(() => process.exit(0)) // Exit with success status code if deployment is successful
 .catch((error) => {
    console.error(error); // Log any errors that occur during deployment
    process.exit(1); // Exit with error status code if deployment fails
 });