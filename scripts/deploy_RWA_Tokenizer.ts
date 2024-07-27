import hre from "hardhat"

async function main(){
  const RWATFactory = await hre.ethers.getContractFactory("RWA_Tokenizer");
  const RWAT = await RWATFactory.deploy();

  const contractAddress:string = typeof RWAT.target === 'string' ? RWAT.target : RWAT.target.toString();

  console.log(`The verifierETH Contract deployed at ${contractAddress}`)

  const abi = RWATFactory.interface.formatJson();
  const abiFormated = JSON.parse(abi);
  // console.log(abiFormated)
  // work in here of sending the abi properly
  await hre.deployments.save("RWA_Tokenizer",{
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