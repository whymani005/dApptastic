import React, { Component } from 'react';
import { Card, Progress, Button } from 'semantic-ui-react';
var MNID = require('mnid');

//Contracts
import getContract from '../../util/getContract.js';
import PledgeFactory from "../../../build/contracts/PledgeFactory.json";
import Pledge from "../../../build/contracts/Pledge.json";

import web3 from '../../util/getWeb3.js';

//Components
import CreatePledge from '../../components/CreatePledge';

import differenceInDays from 'date-fns/difference_in_days'
import format from 'date-fns/format'

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

      var pledgedDate = format(createdAt, 'MM/DD/YYYY');
      var today = format(new Date(), 'MM/DD/YYYY');
      var onDay = Math.abs(differenceInDays(pledgedDate, today))+1;

      const totAmt = this.state.userActivePledgeSummaries[i][1];
      const numDays = this.state.userActivePledgeSummaries[i][2];
      const goalType = this.state.userActivePledgeSummaries[i][3];
      const checkins = [1,2,3,6,9,11,12,13,14,16,17,19,24,27];

      items.push(
        <Card key={createdAt.toString()}>
          <Card.Content>
            <Card.Header>Goal: {goalType}</Card.Header>
            <Card.Meta>Started On: {pledgedDate.toString()}</Card.Meta>
            <Card.Description>
              <strong>Number of Days: </strong>{numDays}<br/>
              <strong>Total Pledged Amount: </strong>{web3.utils.fromWei(totAmt.toString(), 'ether')} ETH<br/><br/>
              {this.renderCheckinsCal(numDays, checkins, onDay)}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button fluid basic color='red'>Close Pledge</Button>
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

  renderCheckinsCal(numDays, checkins, todaysIdx) {
    var items = [];
    for(var k=1; k<=numDays; k++) {
      if(k < todaysIdx) { //Day is in the past (before today)
        if(checkins.includes(k)) {
          items.push(
            <Button key={k} disabled basic icon='check' />
          );
        } else {
          items.push(
            <Button key={k} disabled basic icon='cancel' />
          );
        }
      } else if(k === todaysIdx) { //Day is Today
        if(checkins.includes(k)) {
          items.push(
            <Button key={k} basic color='green' icon='check' />
          );
        } else {
          items.push(
            <Button key={k} basic color='orange' icon='circle outline' />
          );
        }
      } else { //Day is in the future (after today)
        items.push(
          <Button key={k} disabled basic icon='circle outline' />
        );
      }
    }

    return(
      <React.Fragment>
        {items}
      </React.Fragment>
    );
  }

  renderPreviousPledges() {
    var items = [];
    const names = ['Goal: Eat Clean', 'Goal: Creative Work', 'Goal: Gym'];
    const starts = ['04/23/2018', '03/01/2018', '11/30/2017'];
    const amt = ['0.3', '0.01', '0.07'];
    const perc = [90, 43, 72];
    for(var i=0; i<names.length; i++) {
      items.push(<Card key={starts[i]}>
          <Card.Content>
            <Card.Header>{names[i]}</Card.Header>
            <Card.Meta>Started: {starts[i]}</Card.Meta>
            <Card.Description>Total Pledged: {amt[i]} ETH</Card.Description>
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
