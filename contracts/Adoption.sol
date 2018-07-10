pragma solidity ^0.4.19;

/**
 * The Adoption contract does this and that...
 */
contract Adoption {
	address[16] public adopters;
	address public owner;

	constructor() public {
		owner = msg.sender;
	}

    function adopt(uint petId) public returns(uint) {
    	require (petId <= 15 && petId >= 0);
    	adopters[petId] = msg.sender;
    	return petId;
    }

    function getAdopters() public view returns (address[16]) {
  		return adopters;
	}

}

