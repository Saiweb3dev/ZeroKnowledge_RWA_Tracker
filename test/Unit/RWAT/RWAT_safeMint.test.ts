import { expect } from "chai";
import { ethers } from "hardhat";
import { RWA_Tokenizer } from "../../../typechain"
import { ethers as eth } from "ethers";

// Define a type that combines a signer with an address for convenience
type SignerWithAddress = eth.Signer & { address: string };

describe("RWA_Tokenizer - safeMint Function", function () {
  let rwaTokenizer: RWA_Tokenizer;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  // Setup function runs before each test case
  beforeEach(async function () {
    // Retrieve signers (accounts) from Hardhat environment
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a fresh instance of RWA_Tokenizer contract before each test
    const RWA_Tokenizer = await ethers.getContractFactory("RWA_Tokenizer");
    rwaTokenizer = await RWA_Tokenizer.deploy();
    await rwaTokenizer.waitForDeployment();
  });

  describe("Successful Minting", function () {
    it("Should allow owner to mint a token", async function () {
      // Expect the safeMint function to emit an AssetMinted event with correct parameters
      await expect(rwaTokenizer.safeMint(addr1.address, "tokenURI"))
        .to.emit(rwaTokenizer, "AssetMinted")
        .withArgs(0, addr1.address, "tokenURI");

      // Verify the ownership and URI of the newly minted token
      expect(await rwaTokenizer.ownerOf(0)).to.equal(addr1.address);
      expect(await rwaTokenizer.tokenURI(0)).to.equal("tokenURI");
    });

    it("Should increment token counter after minting", async function () {
      // Mint tokens and check if the token counter increments correctly
      await rwaTokenizer.safeMint(addr1.address, "tokenURI1");
      expect(await rwaTokenizer.getTokenCounter()).to.equal(1);

      await rwaTokenizer.safeMint(addr2.address, "tokenURI2");
      expect(await rwaTokenizer.getTokenCounter()).to.equal(2);
    });

    it("Should allow minting multiple tokens to the same address", async function () {
      // Mint multiple tokens to the same address and verify ownership
      await rwaTokenizer.safeMint(addr1.address, "tokenURI1");
      await rwaTokenizer.safeMint(addr1.address, "tokenURI2");

      expect(await rwaTokenizer.ownerOf(0)).to.equal(addr1.address);
      expect(await rwaTokenizer.ownerOf(1)).to.equal(addr1.address);
    });
  });

  describe("Access Control", function () {
    it("Should not allow non-owner to mint a token", async function () {
      // Expect the transaction to revert because addr1 is not the contract owner
      await expect(rwaTokenizer.connect(addr1).safeMint(addr2.address, "tokenURI")).to.be.reverted;
    });
    
  });

  describe("Input Validation", function () {
    it("Should not allow minting to zero address", async function () {
      // Expect the transaction to revert with a custom error because the address is zero
      await expect(rwaTokenizer.safeMint(ethers.ZeroAddress, "tokenURI"))
        .to.be.revertedWithCustomError({ interface: rwaTokenizer.interface },"AddressCannotBeZero");
    });

    it("Should allow minting with an empty tokenURI", async function () {
      // Expect no revert when minting with an empty tokenURI
      await expect(rwaTokenizer.safeMint(addr1.address, ""))
        .to.not.be.reverted;
    });
  });

  describe("Event Emission", function () {
    it("Should emit AssetMinted event with correct parameters", async function () {
      // Expect the safeMint function to emit an AssetMinted event with correct parameters
      await expect(rwaTokenizer.safeMint(addr1.address, "tokenURI"))
        .to.emit(rwaTokenizer, "AssetMinted")
        .withArgs(0, addr1.address, "tokenURI");
    });
  });

  describe("Token URI", function () {
    it("Should set the correct tokenURI", async function () {
      // Mint a token and verify its URI is set correctly
      await rwaTokenizer.safeMint(addr1.address, "tokenURI");
      expect(await rwaTokenizer.tokenURI(0)).to.equal("tokenURI");
    });
  });

  describe("Gas Usage", function () {
    it("Should not exceed a reasonable gas limit for batch minting", async function () {
      // Perform batch minting and check if the gas used is below a certain threshold
      const addresses = [addr1.address, addr2.address, addr1.address];
      const uris = ["uri1", "uri2", "uri3"];
    
      const tx = await rwaTokenizer.batchMint(addresses, uris);
      const receipt = await tx.wait();
      if (receipt !== null) {
          expect(receipt.gasUsed).to.be.below(1000000); // Adjust this value based on your requirements
      } else {
          throw new Error('Transaction did not complete successfully');
      }
    });
  });
});
