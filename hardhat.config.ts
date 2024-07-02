import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import "hardhat-deploy";
import type { NetworkUserConfig } from "hardhat/types";
dotenvConfig();
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter:{
    currency:"USD",
    enabled:true,
    src: "./contracts",
  },
  typechain:{
    outDir:"typechain",
    target:"ethers-v5"
  }
};

export default config;
