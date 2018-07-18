import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import AvatarCard from '../../components/AvatarCard';

//Contracts
import getContract from '../../util/getContract.js';
import PledgeFactory from "../../../build/contracts/PledgeFactory.json";
import Pledge from "../../../build/contracts/Pledge.json";

import web3 from '../../util/getWeb3.js';
import { getJSON } from '../../util/ipfs.js'
import getRandomAttrVal from '../../util/avataarHelper.js';


class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      totalPledgeCount: 0,
      totalPledgedAmt: 0,
      allPledges: [],
      isLoading: true
    };

    this.fetchAllPledges = this.fetchAllPledges.bind(this);
  }

  async componentDidMount() {
    this.pledgeFactoryInstance = await getContract(PledgeFactory);

    //Platform Summary
    const totalPledgeCount = await this.pledgeFactoryInstance.allTimePledgedCount();
    const totalPledgedAmt = await this.pledgeFactoryInstance.allTimePledgedAmt();

    //Get All Pledges
    const items = await this.fetchAllPledges();

    this.setState({ totalPledgeCount: totalPledgeCount, 
                    totalPledgedAmt: totalPledgedAmt,
                    allPledges: items, isLoading: false
                  });
  }

  fetchAllPledges = async () => {
    var items = [];
    const allUsers = await this.pledgeFactoryInstance.getUsers();

    for(var a=0; a<allUsers.length; a++) {
      const userAddress = allUsers[a];
      const userAvatarHash = await this.pledgeFactoryInstance.getProfileInfoForUser(userAddress);
      const userDetails = await getJSON(userAvatarHash);

      const userPledges = await this.pledgeFactoryInstance.getPledgesForUser(userAddress);
      for(var j=0; j<userPledges.length; j++) {
        const pledgeInstance = new web3.eth.Contract(Pledge.abi, userPledges[j]);
        //console.log('HOME - USRS - PLDGS --- INSTANCE: ', pledgeInstance);
        const tt = await pledgeInstance.methods.getSummary().call();
        tt['userAddress'] = userAddress;
        tt['userDetails'] = userDetails;
        items.push(tt);
        //console.log('HOME - USRS - PLDGS --- INSTANCE -- summaryyyyyy: ', tt);
      }
    }
    return items;
  }

  renderPledges() {
    var items = [];

    //REALL
    var realPledges = this.state.allPledges;
    for(var i=0; i<realPledges.length; i++) {
      const createTime = realPledges[i][0];
      const totalPledgedAmt = realPledges[i][1];
      const numDays = realPledges[i][2];
      const goalType = realPledges[i][3];
      const userAddress = realPledges[i]['userAddress'].replace(/^(.{25}).+/, "$1…");
      const userAvatarDetails = realPledges[i]['userDetails']['userAvatar'];

      items.push(<AvatarCard goalType={goalType} key={createTime} 
                  userAddress={userAddress} userAvatar={userAvatarDetails} 
                  createdAt={createTime} numDays={numDays} totalPledgedAmt={totalPledgedAmt}/>);
    }

    //JUST RANDOM
    const names = ['TEST_Harvey', 'TEST_Loius', 'TEST_Jessica', 'TEST_Donna'];
    const totalPledgedAmt = 0;
    for(var a=0; a<names.length; a++) {
      const firstAvaInfo = this.generateFirstTimeRandAvatar();
      items.push(<AvatarCard goalType={names[a]} key={names[a]} userAvatar={firstAvaInfo}
                  totalPledgedAmt={totalPledgedAmt} />);
    }

    return (
      <Card.Group centered>
        {items}
      </Card.Group>
    );
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h2 style={{textAlign: 'center'}}>Current Pledges</h2>
            <h4 style={{textAlign: 'center'}}>Total pledges: {this.state.totalPledgeCount.toString()} with total pledged amount: {web3.utils.fromWei(this.state.totalPledgedAmt.toString(), 'ether')} ETH</h4>
          </div>
          <br/>
          <div>
            { this.state.isLoading ? this.renderLoading() : this.renderPledges() }
          </div>
        </div>
      </main>
    );
  }

  renderLoading() {
    return(
      <React.Fragment>
        <p>Fetching all pledges on this platform from blockchain/IPFS.</p>
        <p>Lots of talking going on. <strong>Hang on, this may take a minute...</strong></p>
      </React.Fragment>
    );
  }


  //----------------------------------
  /// ====== HELPER ======
  //----------------------------------

  generateFirstTimeRandAvatar() {
    var avatarStr = '';
    const avaAttributes = ['topType','accessoriesType','hairColor','facialHairType','facialHairColor',
                'clotheType','clotheColor','eyeType','eyebrowType','mouthType','skinColor'];

    for(var i=0; i<avaAttributes.length; i++) {
      var attr = avaAttributes[i]+'='+getRandomAttrVal(avaAttributes[i]);
      avatarStr = ((avatarStr === '') ? attr : avatarStr+'&'+attr);
    }
    return avatarStr;
  }

}

module.exports = Home;
