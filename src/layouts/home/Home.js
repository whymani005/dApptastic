import React, { Component } from 'react';
import { Card, Statistic, Message, Icon } from 'semantic-ui-react';
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
      totalUsersCount: 0,
      allPledges: [],
      isLoading: true
    };

    this.fetchAllPledges = this.fetchAllPledges.bind(this);
  }

  async componentDidMount() {
    this.pledgeFactoryInstance = await getContract(PledgeFactory);

    //Platform Stats
    const dappSummary = await this.pledgeFactoryInstance.getSummary();

    //Get All Pledges
    const items = await this.fetchAllPledges();

    this.setState({ totalPledgeCount: dappSummary[0], 
                    totalPledgedAmt: dappSummary[1],
                    totalUsersCount: dappSummary[2],
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
    const names = ['Explore a new street_TEST', 'Listen to a new song_TEST'];
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
            {this.renderInfoStats()}
          </div>
          <br/>
          <div>
            { this.state.isLoading ? this.renderLoading() : this.renderPledges() }
          </div>
        </div>
      </main>
    );
  }

  renderInfoStats() {
    return(
      <Statistic.Group size='tiny' widths='three'>
        <Statistic>
          <Statistic.Value>{this.state.totalPledgeCount.toString()}</Statistic.Value>
          <Statistic.Label>Pledges</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>{web3.utils.fromWei(this.state.totalPledgedAmt.toString(), 'ether')} ETH</Statistic.Value>
          <Statistic.Label>Pledged Amount</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>{this.state.totalUsersCount.toString()}</Statistic.Value>
          <Statistic.Label>Users</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    );
  }

  renderLoading() {
    return(
      <Message icon>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Fetching all pledges on this platform from blockchain/IPFS.</Message.Header>
          Lots of talking going on. <strong>Hang on, this may take a minute...</strong>
        </Message.Content>
      </Message>
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
