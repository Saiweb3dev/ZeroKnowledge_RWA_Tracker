import { expect } from "chai";
import { ethers } from "hardhat";
import { RWA_Tokenizer } from "../../../typechain"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("RWA_Tokenizer - transferAsset Function", function () {
  let rwaTokenizer: RWA_Tokenizer;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const RWA_Tokenizer = await ethers.getContractFactory("RWA_Tokenizer");
    rwaTokenizer = await RWA_Tokenizer.deploy();
    await rwaTokenizer.deployed();

    // Mint a token for testing
    await rwaTokenizer.safeMint(addr1.address, "tokenURI");
  });

  describe("Successful Transfer", function () {
    it("Should allow token owner to transfer the token", async function () {
      await expect(rwaTokenizer.connect(addr1).transferAsset(0, addr2.address))
        .to.emit(rwaTokenizer, "AssetTransferred")
        .withArgs(0, addr1.address, addr2.address);

      expect(await rwaTokenizer.ownerOf(0)).to.equal(addr2.address);
    });

    it("Should update balances after transfer", async function () {
      await rwaTokenizer.connect(addr1).transferAsset(0, addr2.address);
      expect(await rwaTokenizer.balanceOf(addr1.address)).to.equal(0);
      expect(await rwaTokenizer.balanceOf(addr2.address)).to.equal(1);
    });
  });

  describe("Access Control", function () {
    it("Should not allow non-owner to transfer the token", async function () {
      await expect(rwaTokenizer.connect(addr2).transferAsset(0, addr2.address))
        .to.be.revertedWith("NotCurrentOwner");
    });

    it("Should allow approved address to transfer the token", async function () {
      await rwaTokenizer.connect(addr1).approve(owner.address, 0);
      await expect(rwaTokenizer.transferAsset(0, addr2.address))
        .to.emit(rwaTokenizer, "AssetTransferred")
        .withArgs(0, addr1.address, addr2.address);
    });
  });

  describe("Input Validation", function () {
    it("Should not allow transfer to zero address", async function () {
      await expect(rwaTokenizer.connect(addr1).transferAsset(0, ethers.constants.AddressZero))
        .to.be.revertedWith("AddressCannotBeZero");
    });

    it("Should not allow transfer to current owner", async function () {
      await expect(rwaTokenizer.connect(addr1).transferAsset(0, addr1.address))
        .to.be.revertedWith("NewOwnerSameAsCurrentOwner");
    });

    it("Should not allow transfer of non-existent token", async function () {
      await expect(rwaTokenizer.connect(addr1).transferAsset(999, addr2.address))
        .to.be.revertedWith("ERC721: invalid token ID");
    });
  });

  describe("Event Emission", function () {
    it("Should emit AssetTransferred event with correct parameters", async function () {
      await expect(rwaTokenizer.connect(addr1).transferAsset(0, addr2.address))
        .to.emit(rwaTokenizer, "AssetTransferred")
        .withArgs(0, addr1.address, addr2.address);
    });
  });

  describe("State Changes", function () {
    it("Should clear previous approvals after transfer", async function () {
      await rwaTokenizer.connect(addr1).approve(owner.address, 0);
      await rwaTokenizer.connect(addr1).transferAsset(0, addr2.address);
      expect(await rwaTokenizer.getApproved(0)).to.equal(ethers.constants.AddressZero);
    });
  });

  describe("Gas Usage", function () {
    it("Should not exceed a reasonable gas limit for transfer", async function () {
      const tx = await rwaTokenizer.connect(addr1).transferAsset(0, addr2.address);
      const receipt = await tx.wait();
      expect(receipt.gasUsed).to.be.below(100000); // Adjust this value based on your requirements
    });
  });
});