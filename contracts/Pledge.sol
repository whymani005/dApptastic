pragma solidity ^0.4.24;

/**
 * @title Contract to hold single pledge info & pledged ether to be returned either to pledger or recipient
 * @dev The pledge can be controlled only by the pledger and can only send ether to the set recipient.
 */
contract Pledge {
        
    address public fundedFrom; //metamask wallet address


    //uport MNID.decode'd address
    //actually we dont really need this, it doesn't help us in anyway.
    //we already have a mapping from this to pledge in factory.
    //TODO - REMOVE!
    address public uportUser; 
    
    uint public creationDate;
    uint public value;

    uint8 public numDays;
    string public goalType;

    bool public isActive;

    modifier restricted(address _uPortId) { 
        require (uportUser == _uPortId); 
        _; 
    }
    
    constructor(address _uportUser, address _fundedFrom, uint _totPledgedAmt, string _goalType) public payable {
        require(msg.value >= _totPledgedAmt);
        uportUser = _uportUser;
        fundedFrom = _fundedFrom;
        value = msg.value;
        goalType = _goalType;
        isActive = true;
        creationDate = now;
    }

    function getSummary() public view returns (uint, uint, uint8, string, bool) {
        return (creationDate, value, numDays, goalType, isActive);
    }

    
    /*function checkin() public {
        require(pledgeStatus == Status.STARTED);
       //todo 
    }*/

}