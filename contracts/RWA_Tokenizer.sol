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

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
/* 
@title RWA_Tokenizer
@Author: Sai Kumar
@description:
  This contract is used to tokenize real world assets.
*/
contract RWA_Tokenizer is ERC721URIStorage{

  ////////// ERRORS ///////////
   error UnauthorizedBurn();


  ////////// STATE VARIABLES //////////
  uint256 private _tokenIdCounter;

  ////////// EVENTS //////////
  /* 
  @notice Emitted when a new token is minted
  @param tokenId The ID of the newly minted token
  @param _toAddress The owner of the newly minted token
  @param _TokenURI The URI of the newly minted token
  */
 event AssetMinted(
    uint256 indexed tokenId,
    address indexed to,
    string tokenURI
);

 /*
  @notice Emitted when a token is burned
  @param tokenId The ID of the burned token
  */
  event AssetBurned(uint256 tokenId);


  constructor() ERC721("RWA_Tokenizer", "RWAT") {
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

 function safeMint(address _toAddress,string memory _TokenURI) public returns(uint256){
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
function burn(uint256 tokenId) public {
    address owner = _ownerOf(tokenId);
    if (!_isAuthorized(owner, msg.sender, tokenId)) {
        revert UnauthorizedBurn();
    }
    _burn(tokenId);
    emit AssetBurned(tokenId);
}