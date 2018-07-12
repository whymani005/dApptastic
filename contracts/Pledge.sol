pragma solidity ^0.4.24;

/**
 * @title Contract to hold single pledge info & pledged ether to be returned either to pledger or recipient
 * @dev The pledge can be controlled only by the pledger and can only send ether to the set recipient.
 */
contract Pledge {
        
    address public fundedFrom; //metamask wallet address
    address public uportUser; //uport MNID.decode'd address
    
    uint public creationDate;
    uint8 public days;
    uint public value;

    modifier restricted(address _uPortId) { 
        require (uportUser == _uPortId); 
        _; 
    }
    
    constructor(address _uportUser, address _fundedFrom, uint _totPledgedAmt) public payable {
        require(msg.value >= _totPledgedAmt);
        uportUser = _uportUser;
        fundedFrom = _fundedFrom;
        creationDate = now;
        value = msg.value;
    }
    
    /*function checkin() public {
        require(pledgeStatus == Status.STARTED);
       //todo 
    }*/

}