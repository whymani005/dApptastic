pragma solidity ^0.4.24;

/*
== pledgeIpfsHash ==
{
  "goalType": "WORKOUT",
  "status": "STARTED",
  "checkins": [1,2,3,7,8,16,18]
}
*/

/*
== userInfo ==
{
  "uPortAddress": "2opcbYK76MfUMxDroNCLMJeTMg4YBmwd6zq",
  "avatar": {
    "topType": "",
    "accessoriesType": "",
    "hairColor": "",
    "facialHairType": "",
    "facialHairColor": ""
  },
  "totalAcctBalanceWei": "347"
}
*/

contract PledgeFactory {
    
    enum Goal {WORKOUT, CREATIVE_WORK, MEDITATE}
    enum Status {STARTED, NOT_STARTED, SUCCESS, FAILED}
    enum RecipientType {DAPPTASTIC, OTHER_USER, RANDOM_USER}
    
    uint constant minPrice = 0.01 ether;
    uint32 constant totalPledgeLength = 30 days;
    
    address public owner;
    uint public allTimePledgedAmt;
    address[] public newPledges;
    
    constructor() public {
        owner = msg.sender;
    }

    function createPledge(address _recipient, uint _money) public payable {
        //require(pledgeAmt >= totalPledgeLength*minPrice);
        //https://stackoverflow.com/questions/49851273/solidity-payable-constructor-from-contract
        address newPledge = (new Pledge).value(msg.value)(msg.sender, _recipient, _money);
        newPledges.push(newPledge);
        allTimePledgedAmt += msg.value; 
        
        //send any extra eth back
    }

    function getDeployedPledges() public view returns (address[]) {
        return newPledges;
    }
}


/**
 * @title Pledge to hold goal info & pledged ether to be returned either to pledger or recipient
 * @dev The pledge can be controlled only by the pledger and can only send ether to the set recipient.
 */
contract Pledge {
    
    address public pledger;
    string public pledgerUPortId;
    address public recipient;
    string public pledgeInfo;
    uint public creationDate;
    uint public value;

    bool active;

    modifier restricted(string _uPortId) { 
        require (pledgerUPortId == _uPortId); 
        _; 
    }
    

    
    constructor(address _pledger , address _recipient, uint _money) public payable {
        require(msg.value >= _money);
        pledger = _pledger;
        recipient = _recipient;
        creationDate = now;
        active = true;
        value = msg.value;
    }

}
