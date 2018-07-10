pragma solidity ^0.4.17;

/*
== infoIpfsHash ==
{
  "createDate": "07/02/2018",
  "avatar": {
    "topType": "",
    "accessoriesType": "",
    "hairColor": "",
    "facialHairType": "",
    "facialHairColor": ""
  },
  "goal": "WORKOUT",
  "status": "STARTED",
  "checkins": [1,2,3,7,8,4]
}
*/


contract DApptasticFactory {

    enum Goal {WORKOUT, CREATIVE_WORK, MEDITATE}
    enum Status {STARTED, NOT_STARTED, SUCCESS, FAILED}
    enum RecipientType {DAPPTASTIC, OTHER_USER, RANDOM_USER}
    enum Status {STARTED, NOT_STARTED, SUCCESS, FAILED}

    struct Pledge {
        string infoIpfsHash;
        uint dateAdded;
    }

    /*struct User {
        address userAddress;
        string avatarInfo;
    }*/

    /*Platform owner - dApp creater*/
    address public owner;
    uint public totalPledgeCount;

    /*array, not a mapping because to get ALL pledges, 
    we need to loop, whcih we cant do with a mapping
    
    So we need to either keep array of all pledge objects, or user objects.
    Chose user objects, because in theory: there will be one user to many pledges.
    So we will save memory by saving the smaller data set of the two.
    Then, we can just loop users array and get all pledges for that user address
    using the userPledges mapping which is constant lookup time.
    */
    //User[] public allUsers; 
    address[] public allUsers; 

    mapping(address => string) userProfileInfo;
    mapping(address => Pledge[]) public userPledges; //no way to get around this.


    modifier adminOnly() {
        require(msg.sender == owner);
        _;
    }

    modifier restricted() {
        require(msg.sender == pledger);
        _;
    }

    function userExists() public view returns(bool) {
        return userPledges[msg.sender].isValue);
    }


    function createUser(string avatarInfo) public {
        allUsers.push(User({
            address: msg.sender,
            avatarInfo: avatarInfo
        }));
    }
    

    function createPledge(Goal goal, uint stakeAmt, 
        RecipientType recipientType, address recipientAdddress) public payable {
        
        require (msg.balance >= stakeAmt);
        
        string ipfsHashAddress = ''. //create ipfs file and get hash for this info.
        userPledges[msg.sender] = ipfsHashAddress;

        userPledges[msg.sender].push(Pledge({
            ifpsHash: ipfsHashAddress,
            dateAdded: now
        }));

        //send back any extra amount

        totalPledgeCount++;
    }


    function createCheckin() {
        
    }

    function getPledgesForUser(address userAddress) public view returns (User, Pledge[]) {

        return(data1,data2);
    }

    function getAllPledges() public view returns (User, Pledge[]) {

        return(data1,data2);
        return allPledges;
    }
}
