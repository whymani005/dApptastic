pragma solidity ^0.4.24;

/**
 * @title Contract to hold single pledge info & pledged ether to be returned either to pledger or recipient
 * @dev The pledge can be controlled only by the pledger and can only send ether to the set recipient.
 */
contract Pledge {
        
    address public fundedFrom; //metamask wallet address
    address public uportUser; //uport MNID.decode'd address
    
    uint public creationDate;
    uint public value; // in Wei
    uint8 public numDays;
    string public goalType;
    
    bool public isActive;

    mapping(uint => bool) public checkins;

    modifier restricted(address _uPortId) { 
        require (uportUser == _uPortId); 
        _; 
    }
    
    constructor(address _uportUser, address _fundedFrom, uint _totPledgedAmt, string _goalType, uint8 _numDays) public payable {
        require(msg.value >= _totPledgedAmt);
        uportUser = _uportUser;
        fundedFrom = _fundedFrom;
        value = msg.value;
        goalType = _goalType;
        numDays = _numDays;
        isActive = true;
        creationDate = now;
    }
    
    function checkin(address _uPortId, uint _forDay) public restricted(_uPortId) {
        require(isActive);
        checkins[_forDay] = true;
    }

    function getSummary() public view returns (uint, uint, uint8, string, bool) {
        return (creationDate, value, numDays, goalType, isActive);
    }

}