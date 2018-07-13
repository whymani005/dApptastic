pragma solidity ^0.4.24;

import "./Pledge.sol";


contract PledgeFactory {

    address public deployedBy;
    uint public allTimePledgedCount;
    uint public allTimePledgedAmt;
    
    /*
        Used to iterate since it's not possible natively from mappings
        address -> mnid.decode()'d value from users UPort profile
                -> NOT a metamask wallet address! 
    */
    address[] public users;

    /*
        Used to save user's unique profile info
        userUPortAddress -> IPFSHash(JSON formatted avatar info, 
                                      stats[# of completed pledges, etc]
                                    )
    */
    mapping(address => string) userProfileInfo;

    /*
        Used to retrieve a list of current & previous for a single user
        userUPortAddress -> Pledge.sol contract address
    */
    mapping(address => address[]) userPledges;
    
    constructor() public {
        deployedBy = msg.sender;
    }

    function createPledge(address _uportAddress, uint _totPledgedAmt, bool firstPledge, string avatarInfo) public payable returns (address) {
        address newPledge = (new Pledge).value(msg.value)(_uportAddress, msg.sender, _totPledgedAmt);
        users.push(_uportAddress);
        userPledges[_uportAddress].push(newPledge);
        allTimePledgedAmt += msg.value; 
        allTimePledgedCount++;

        if(firstPledge) {
            saveProfileInfo(_uportAddress, avatarInfo);
        }

        //send any extra eth back
        
        return newPledge;
    }
    
    function getUsers() public view returns (address[]) {
        return users;
    }
    
    function saveProfileInfo(address _uportAddress, string value) public {
        userProfileInfo[_uportAddress] = value;
    }
    
    function getProfileInfoForUser(address _uportAddress) public view returns (string) {
        return userProfileInfo[_uportAddress];
    }
    
    function getPledgesForUser(address _uportAddress) public view returns (address[]) {
        return userPledges[_uportAddress];
    }
}

