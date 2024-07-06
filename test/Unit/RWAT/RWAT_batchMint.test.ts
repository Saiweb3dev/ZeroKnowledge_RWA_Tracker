import { expect } from "chai";
import { ethers } from "hardhat";
import { RWA_Tokenizer } from "../../../typechain"
import { ethers as eth } from "ethers";

type SignerWithAddress = eth.Signer & { address: string };

describe("RWA_Tokenizer - batchMint Function", function () {;
  let rwaTokenizer: RWA_Tokenizer;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const RWA_Tokenizer = await ethers.getContractFactory("RWA_Tokenizer");
    rwaTokenizer = await RWA_Tokenizer.deploy();
    await rwaTokenizer.waitForDeployment();
  });

  describe("Successful Batch Minting", function () {
    it("Should allow owner to batch mint tokens", async function () {
      const addresses = [addr1.address, addr2.address];
      const uris = ["uri1", "uri2"];

      await expect(rwaTokenizer.batchMint(addresses, uris))
        .to.emit(rwaTokenizer, "AssetMinted")
        .withArgs(0, addr1.address, "uri1")
        .and.to.emit(rwaTokenizer, "AssetMinted")
        .withArgs(1, addr2.address, "uri2");

      expect(await rwaTokenizer.ownerOf(0)).to.equal(addr1.address);
      expect(await rwaTokenizer.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should increment token counter correctly after batch minting", async function () {
      const addresses = [addr1.address, addr2.address, addr1.address];
      const uris = ["uri1", "uri2", "uri3"];

      await rwaTokenizer.batchMint(addresses, uris);
      expect(await rwaTokenizer.getTokenCounter()).to.equal(3);
    });
  });

  describe("Access Control", function () {
    it("Should not allow non-owner to batch mint tokens", async function () {
      const addresses = [addr1.address, addr2.address];
      const uris = ["uri1", "uri2"];

      await expect(rwaTokenizer.connect(addr1).batchMint(addresses, uris))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Input Validation", function () {
    it("Should not allow batch minting with mismatched array lengths", async function () {
      const addresses = [addr1.address, addr2.address];
      const uris = ["uri1"];

      await expect(rwaTokenizer.batchMint(addresses, uris))
        .to.be.revertedWith("LengthMismatch");
    });

    it("Should not allow batch minting with empty arrays", async function () {
      await expect(rwaTokenizer.batchMint([], []))
        .to.be.revertedWith("EmptyArray");
    });

    it("Should not allow batch minting to zero address", async function () {
      const addresses = [addr1.address, ethers.ZeroAddress];
      const uris = ["uri1", "uri2"];

      await expect(rwaTokenizer.batchMint(addresses, uris))
        .to.be.revertedWith("AddressCannotBeZero");
    });
  });

  describe("Event Emission", function () {
    it("Should emit AssetMinted events for each minted token", async function () {
      const addresses = [addr1.address, addr2.address];
      const uris = ["uri1", "uri2"];

      await expect(rwaTokenizer.batchMint(addresses, uris))
        .to.emit(rwaTokenizer, "AssetMinted")
        .withArgs(0, addr1.address, "uri1")
        .and.to.emit(rwaTokenizer, "AssetMinted")
        .withArgs(1, addr2.address, "uri2");
    });
  });

  describe("Gas Usage", function () {
    it("Should not exceed a reasonable gas limit for batch minting", async function () {
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