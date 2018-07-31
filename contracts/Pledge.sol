pragma solidity ^0.4.24;

/**
 * @title Contract to hold single pledge info & pledged ether to be returned either to pledger or recipient
 * @dev The pledge can be controlled only by the pledger and can only send ether to the set recipient.
 */
contract Pledge {
        
    address public pledgeOwner; //uport MNID.decode'd address
    uint public creationDate;
    uint public numDays;
    uint public successPerc;
    bool private isActive;
    address recipientAddress;
    
    uint private mostRecentCheckedInDay;
    uint private numOfSuccessCheckIns;

    //Can be stored in IPFS hash
    string public goalType;
    address public fundedFrom; //metamask wallet address
    
    modifier restricted(address _pledgeOwner) { 
        require (pledgeOwner == _pledgeOwner); 
        _; 
    }

    modifier activeOnly() { 
        require (isActive); 
        _; 
    }

    constructor(address _pledgeOwner, address _fundedFrom, 
                uint _totPledgedAmt, string _goalType, uint _numDays, uint _successPerc) public payable {
        require(msg.value >= _totPledgedAmt);
        require(_successPerc <= 100 && _successPerc >= 0); //floats not fully supported
        pledgeOwner = _pledgeOwner;
        fundedFrom = _fundedFrom;
        goalType = _goalType;
        numDays = _numDays;
        successPerc = _successPerc;
        isActive = true;
        creationDate = now;
    }
    
    function checkin(address _uPortId) public restricted(_uPortId) activeOnly() {
        //https://ethereum.stackexchange.com/questions/37026/how-to-calculate-with-time-and-dates
        uint forDay = (now - creationDate) / 60 / 60 / 24; 
        if(mostRecentCheckedInDay < forDay) {
            mostRecentCheckedInDay = forDay;
            numOfSuccessCheckIns++;
        }
    }

    function finishPledge(address _uPortId) public restricted(_uPortId) activeOnly() {
        isActive = false;

        if(numOfSuccessCheckIns >= numDays*(successPerc/100) ) {
            msg.sender.transfer(address(this).balance);
        } else {
            recipientAddress.transfer(address(this).balance);
        }
    }
    
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
    
    function getSummary() public view returns (uint, uint, uint, string, bool) {
        return (creationDate, address(this).balance, numDays, goalType, isActive);
    }
}