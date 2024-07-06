import { expect } from "chai";
import { ethers } from "hardhat";
import { RWA_Tokenizer } from "../../../typechain"
import { ethers as eth } from "ethers";

type SignerWithAddress = eth.Signer & { address: string };

describe("RWA_Tokenizer - burn Function", function () {
  let rwaTokenizer: RWA_Tokenizer;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const RWA_Tokenizer = await ethers.getContractFactory("RWA_Tokenizer");
    rwaTokenizer = await RWA_Tokenizer.deploy();
    await rwaTokenizer.waitForDeployment(); // Use deployed() instead of waitForDeployment()

    // Mint a token for testing
    await rwaTokenizer.safeMint(addr1.address, "tokenURI");
  });

  describe("Successful Burning", function () {
    it("Should allow owner to burn a token", async function () {
      await expect(rwaTokenizer.connect(owner).burn(0))
        .to.emit(rwaTokenizer, "AssetBurned")
        .withArgs(0);

      await expect(rwaTokenizer.ownerOf(0)).to.be.revertedWith("ERC721: invalid token ID");
    });
  });

  describe("Access Control", function () {
    it("Should not allow unauthorized burner to burn a token", async function () {
      await expect(rwaTokenizer.connect(addr1).burn(0))
        .to.be.revertedWithCustomError({ interface: rwaTokenizer.interface }, "UnauthorizedBurn");
    });
  });

  describe("Input Validation", function () {
    beforeEach(async function () {
      // Mint a new token before each test to ensure a valid token ID exists
      await rwaTokenizer.safeMint(addr1.address, "tokenURI");
    });

    it("Should not allow burning non-existent token", async function () {
      await expect(rwaTokenizer.connect(owner).burn(999))
        .to.be.revertedWith("ERC721: invalid token ID");
    });

    it("Should not allow burning the same token twice", async function () {
      await rwaTokenizer.connect(owner).burn(0); // Ensure owner burns the token
      await expect(rwaTokenizer.connect(owner).burn(0)) // Attempt to burn the same token again
        .to.be.revertedWith("ERC721: invalid token ID");
    });
  });

  describe("Event Emission", function () {
    it("Should emit AssetBurned event with correct parameters", async function () {
      await expect(rwaTokenizer.connect(owner).burn(0))
        .to.emit(rwaTokenizer, "AssetBurned")
        .withArgs(0);
    });
  });

  describe("State Changes", function () {
    beforeEach(async function () {
      // Mint a new token before each test to ensure a valid token ID exists
      await rwaTokenizer.safeMint(addr1.address, "tokenURI");
    });

    it("Should clear token approvals when burned", async function () {
      await rwaTokenizer.connect(addr1).approve(addr2.address, 0);
      await rwaTokenizer.connect(owner).burn(0); // Ensure owner burns the token
      await expect(rwaTokenizer.getApproved(0))
        .to.be.revertedWith("ERC721: invalid token ID");
    });
  });

  describe("Gas Usage", function () {
    it("Should not exceed a reasonable gas limit for burning", async function () {
      const tx = await rwaTokenizer.connect(owner).burn(0);
      const receipt = await tx.wait();
      if (receipt !== null) {
        expect(receipt.gasUsed).to.be.below(1000000); // Adjust this value based on your requirements
      } else {
        throw new Error('Transaction did not complete successfully');
      }
    });
  });
});
