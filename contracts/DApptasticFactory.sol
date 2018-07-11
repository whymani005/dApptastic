pragma solidity ^0.4.24;

/*
TODO: Structs w sample data, to be saved in IPFS

== PledgeInfo ==
{
  "goalType": "WORKOUT",
  "status": "STARTED",
  "checkins": [1,2,3,7,8,16,18]
}

== ProfileInfo ==
{
  "uPortAddress": "2opc6YK76MfUMd8roNCLMJeTMg4Yrmwd6zq",
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
    enum RecipientType {DAPPTASTIC, OTHER_USER, RANDOM_USER}
    
    uint32 constant public totalPledgeLength = 14 days;
    
    address public owner;
    uint public allTimePledgedCount;
    uint public allTimePledgedAmt;
    
    string[] public users; //used to iterate
    mapping(string => string) uPortIdToProfileInfo;
    mapping(string => address[]) userPledges;
    
    //address[] public newPledges;
    
    constructor() public {
        owner = msg.sender;
    }

    function createPledge(string _uportId, address _recipient, uint _totPledgedAmt) public payable returns (address) {
        //https://stackoverflow.com/questions/49851273/solidity-payable-constructor-from-contract
        address newPledge = (new Pledge).value(msg.value)(_uportId, msg.sender, _recipient, _totPledgedAmt);
        users.push(_uportId);
        userPledges[_uportId].push(newPledge);
        allTimePledgedAmt += msg.value; 
        allTimePledgedCount++;
        
        //send any extra eth back
        
        return newPledge;
    }
}


/**
 * @title Contract to hold single pledge info & pledged ether to be returned either to pledger or recipient
 * @dev The pledge can be controlled only by the pledger and can only send ether to the set recipient.
 */
contract Pledge {
    
    enum Status {STARTED, NOT_STARTED, SUCCESS, FAILED}
    
    //Pledger Identity
    address public pledger;
    string public pledgerUPortId;
    
    address public recipient;
    //string public pledgeInfo;
    uint public creationDate;
    uint public value;
    
    Status public pledgeStatus;
    PledgeFactory.Goal public goalType;

    /*modifier restricted(string _uPortId) { 
        require (pledgerUPortId() == _uPortId); 
        _; 
    }*/
    
    constructor(string _pledgerUportId, address _pledger, address _recipient, uint _totPledgedAmt) public payable {
        require(msg.value >= _totPledgedAmt);
        pledgerUPortId = _pledgerUportId;
        pledger = _pledger;
        recipient = _recipient;
        creationDate = now;
        value = msg.value;
        pledgeStatus = Status.STARTED;
    }
    
    /*function checkin() public {
        require(pledgeStatus == Status.STARTED);
       //todo 
    }*/

}
