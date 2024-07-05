// Layout of Contract:
// version
// imports
// interfaces, libraries, contracts
// errors
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/* 
@title RWA_Tokenizer
@Author: Sai Kumar
@description:
  This contract is used to tokenize real world assets.
*/
contract RWA_Tokenizer is ERC721URIStorage, Ownable {
    ////////// ERRORS ///////////
    error UnauthorizedBurn();
    error AddressCannotBeZero();
    error NewOwnerSameAsCurrentOwner();
    error NotCurrentOwner();

    ////////// STATE VARIABLES //////////
    uint256 private _tokenIdCounter;

    ////////// EVENTS //////////
    /* 
  @notice Emitted when a new token is minted
  */
    event AssetMinted(
        uint256 indexed tokenId,
        address indexed to,
        string tokenURI
    );

    /*
  @notice Emitted when a token is burned
  */
    event AssetBurned(uint256 tokenId);

    /*@notice Emitted when a token is transfered to new owner */
    event AssetTransferred(
        uint256 indexed tokenId,
        address indexed fromAddress,
        address indexed toAddress
    );

    constructor() ERC721("RWA_Tokenizer", "RWAT") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    ////////// FUNCTIONS //////////
    /* 
  @notice: Mints a new token
  @dev   : As for now only the contract owner can mint new tokens
  @param : _to is the address that will own the minted token
  @param : _uri is the token URI for the tokens's metadata
  @return: _tokenId The tokenId of the newly minted token
  */

    function safeMint(
        address _toAddress,
        string memory _TokenURI
    ) public onlyOwner returns (uint256) {
        if (_toAddress == address(0)) {
            revert AddressCannotBeZero();
        }
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(_toAddress, tokenId);
        _setTokenURI(tokenId, _TokenURI);
        emit AssetMinted(tokenId, _toAddress, _TokenURI);
        return tokenId;
    }

    /*
  @notic Burns a token in case of Asset destroyed
  @dev   : As for now only the contract owner can burn tokens
  @param : _tokenId is the tokenId of the token to be burned
 */
    function burn(uint256 tokenId) public onlyOwner {
        address owner = _ownerOf(tokenId);
        if (!_isAuthorized(owner, msg.sender, tokenId)) {
            revert UnauthorizedBurn();
        }
        _burn(tokenId);
        emit AssetBurned(tokenId);
    }

    /*
@notice : Transfer ownership of a token from current owner to a new owner
@dev    : Can only be called by the current owner of the token
@param  : tokenId The ID of the token to be transferred
@param  : newOwner The address of the new owner
*/

    function transferAsset(uint256 _tokenId, address newOwner) public {
        address currentOwner = ownerOf(_tokenId);

        if (newOwner == address(0)) {
            revert AddressCannotBeZero();
        }
        if (newOwner == currentOwner) {
            revert NewOwnerSameAsCurrentOwner();
        }

        if (msg.sender != currentOwner) {
            revert NotCurrentOwner();
        }

        _transfer(currentOwner, newOwner, _tokenId);
        emit AssetTransferred(_tokenId, currentOwner, newOwner);
    }

    function getTokenCounter() public view returns (uint256) {
        return _tokenIdCounter;
    }
}
