import React, { Component } from 'react';
import { Card, Progress } from 'semantic-ui-react';
var MNID = require('mnid');

//Contracts
import getContract from '../../util/getContract.js';
import PledgeFactory from "../../../build/contracts/PledgeFactory.json";
import Pledge from "../../../build/contracts/Pledge.json";

import web3 from '../../util/getWeb3.js';

//Components
import CreatePledge from '../../components/CreatePledge';

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props);
    authData = this.props;

    this.state = {
      userAddress: '',
      userActivePledgeSummaries: [],
      userInActivePledgeSummaries: []
    };

    this.createPledgeCallback = this.createPledgeCallback.bind(this);
  }

  async componentDidMount() {
    const specificNetworkAddress = this.getNetworkSpecificUserAddress(this.props.authData.address);
    this.pledgeFactoryInstance = await getContract(PledgeFactory);
    const pledgeAddresses = await this.pledgeFactoryInstance.getPledgesForUser(specificNetworkAddress);

    var active_pledgeSummaries = [];
    var inactive_pledgeSummaries = [];

    for(var i=0; i<pledgeAddresses.length; i++) {
        const pledgeInstance = new web3.eth.Contract(Pledge.abi, pledgeAddresses[i]);
        const tt = await pledgeInstance.methods.getSummary().call();
        const isActive = tt[i][4];
        if(isActive) {
          active_pledgeSummaries.push(tt);
        } else {
          inactive_pledgeSummaries.push(tt);
        }
    }

    this.setState({ userAddress: specificNetworkAddress, 
                    userActivePledgeSummaries: active_pledgeSummaries, 
                    userInActivePledgeSummaries: inactive_pledgeSummaries});
  }

  getNetworkSpecificUserAddress(mnidAddress) {
    const decodedId = MNID.decode(mnidAddress);
    const specificNetworkAddress = decodedId.address;
    return specificNetworkAddress;
  }



  renderCurrentPledges() {
    var items = [];
    for(var i=0; i<this.state.userActivePledgeSummaries.length; i++) {      
      var createdAt = new Date(0);
      createdAt.setUTCSeconds(this.state.userActivePledgeSummaries[i][0]);
      const totAmt = this.state.userActivePledgeSummaries[i][1];
      const numDays = this.state.userActivePledgeSummaries[i][2];
      const goalType = this.state.userActivePledgeSummaries[i][3];

      items.push(
        <Card key={createdAt.toString()}>
          <Card.Content>
            <Card.Header>{goalType}</Card.Header>
            <Card.Meta>Started On: {createdAt.toString()}</Card.Meta>
            <Card.Description>
              <strong>Number of Days: </strong>{numDays}<br/>
              <strong>Total Pledged Amount: </strong>{web3.utils.fromWei(totAmt.toString(), 'ether')} ETH
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Card.Meta>Days Remaining</Card.Meta>
            <Progress fluid="true" percent={33} indicating />
          </Card.Content>
        </Card>
      );
    }

    return(
      <Card.Group>
        {items}
      </Card.Group>
    );

  }

  renderPreviousPledges() {
    var items = [];
    const names = ['Goal: Eat Clean', 'Goal: Creative Work', 'Goal: Gym'];
    const starts = ['04/23/2018', '03/01/2018', '11/30/2017'];
    const perc = [90, 43, 72];
    for(var i=0; i<names.length; i++) {
      items.push(<Card key={starts[i]}>
          <Card.Content>
            <Card.Header>{names[i]}</Card.Header>
            <Card.Meta>Started: {starts[i]}</Card.Meta>
            <Card.Description>
              Steve wants to add you to the group <strong>best friends</strong>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Card.Meta>Success Rate</Card.Meta>
            <Progress fluid="true" percent={perc[i]} progress indicating/>
          </Card.Content>
        </Card>);
    }

    return items;
  }

  //https://stackoverflow.com/questions/33680315/react-need-to-call-parent-to-re-render-component
  async createPledgeCallback() {
    console.log('I AM IN create CALLbacaaakkkk');
    const pledgeAddresses = await this.pledgeFactoryInstance.getPledgesForUser(this.state.userAddress);

    var active_pledgeSummaries = [];
    var inactive_pledgeSummaries = [];

    for(var i=0; i<pledgeAddresses.length; i++) {
        const pledgeInstance = new web3.eth.Contract(Pledge.abi, pledgeAddresses[i]);
        const tt = await pledgeInstance.methods.getSummary().call();
        const isActive = tt.userPledgeSummaries[i][4];
        if(isActive) {
          active_pledgeSummaries.push(tt);
        } else {
          inactive_pledgeSummaries.push(tt);
        }
    }

    console.log('CALLbacaaakkkk active_pledgeSummaries : ', active_pledgeSummaries);

    this.setState({ userActivePledgeSummaries: active_pledgeSummaries, 
                    userInActivePledgeSummaries: inactive_pledgeSummaries});
  }

  

  render() {
    const firstEverPledge = (this.state.userActivePledgeSummaries.length < 1 && this.state.userInActivePledgeSummaries.length < 1)
    return(
      <div>
        <p><strong>Welcome {this.props.authData.name}</strong> from {this.props.authData.country}!</p>
        <h1 style={{textAlign: 'center'}}>Dashboard</h1>

        <h2>Current Pledge</h2>
        { (this.state.userActivePledgeSummaries.length < 1) ? 
          <CreatePledge userAddress={this.state.userAddress} callbackMet={this.createPledgeCallback} firstEverPledge={firstEverPledge}/> : 
          this.renderCurrentPledges() 
        }

        <br/>

        <h2>Previous Pledges</h2>
        <Card.Group>
          {this.renderPreviousPledges()}
        </Card.Group>

        <br/>
      </div>
    )
  }
}

export default Dashboard
