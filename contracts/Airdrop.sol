// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
/**
 * @title MyERC20Token
 * @dev This is a basic ERC20 token using the OpenZeppelin's ERC20PresetFixedSupply preset.
 * You can edit the default values as needed.
 */
contract Airdrop is Ownable {
    bytes32 public merkleRoot; 
    
    IERC20 public airDropToken;
    mapping(address => bool) public claimRecord;

  
    function setClaimTokenAddress(address tokenAddress) public onlyOwner{
        airDropToken = IERC20(tokenAddress);
    }

    // Additional functions or overrides can be added here if needed.
    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        merkleRoot = _merkleRoot;
    }
    function vertifyMerkelProof(bytes32[] memory proof, bytes32 root ,uint amount) public view returns (bool) {
        bytes32 leaf = keccak256(abi.encode(msg.sender, amount));
        return MerkleProof.verify(proof, root, leaf);
    }
    function claim(bytes32[] memory proof, uint amount) public {
        
        require(airDropToken.balanceOf(address(this))>= amount,"Not enough token");
        require(!claimRecord[msg.sender],"already claimed");
        require(vertifyMerkelProof(proof, merkleRoot, amount), "Invalid proof.");
        airDropToken.transfer(msg.sender, amount);
        claimRecord[msg.sender] = true;
    }
    function devWithdraw(address to,uint amount) public onlyOwner {
        require(airDropToken.balanceOf(address(this))>= amount,"Not enough token");
        airDropToken.transfer(to, amount);
    }
}
