import React, { Component } from 'react';
import { Card, Progress } from 'semantic-ui-react';
var MNID = require('mnid');

//Contracts
import getContract from '../../util/getContract.js';
import PledgeFactory from "../../../build/contracts/PledgeFactory.json";

//Components
import CreatePledge from '../../components/CreatePledge';;

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props);
    authData = this.props;

    this.state = {
      userAddress: '',
      userPledges: []
    };

    this.createPledgeCallback = this.createPledgeCallback.bind(this);
  }

  async componentDidMount() {
    const specificNetworkAddress = this.getNetworkSpecificUserAddress(this.props.authData.address);

    this.pledgeFactoryInstance = await getContract(PledgeFactory);
    const thisUserPledges = await this.pledgeFactoryInstance.getPledgesForUser(specificNetworkAddress);
    console.log('thisUserPledges : ', thisUserPledges);
    this.setState({ userAddress: specificNetworkAddress, userPledges: thisUserPledges });
  }

  getNetworkSpecificUserAddress(mnidAddress) {
    const decodedId = MNID.decode(mnidAddress);
    const specificNetworkAddress = decodedId.address;
    return specificNetworkAddress;
  }

  renderCurrentPledges() {
    var items = [];
    items.push(
        <Card key={'aa'}>
          <Card.Content>
            <Card.Header>Goal: Eat Clean</Card.Header>
            <Card.Meta>Started: 07/11/2018</Card.Meta>
            <Card.Description>
              Steve wants to add you to the group <strong>best friends</strong>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Card.Meta>Days Remaining</Card.Meta>
            <Progress fluid="true" percent={33} indicating />
          </Card.Content>
        </Card>);

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

    const thisUserPledges = await this.pledgeFactoryInstance.getPledgesForUser(this.state.userAddress);
    console.log('CALLbacaaakkkk thisUserPledges : ', thisUserPledges);
    this.setState({ userPledges: thisUserPledges });
  }

  

  render() {
    return(
      <div>
        <p><strong>Welcome {this.props.authData.name}</strong> from {this.props.authData.country}!</p>
        <h1 style={{textAlign: 'center'}}>Dashboard</h1>

        <h2>Current Pledge</h2>
        { (this.state.userPledges.length < 1) ? 
          <CreatePledge userAddress={this.state.userAddress} callbackMet={this.createPledgeCallback} firstEverPledge={(this.state.userPledges.length < 1)}/> : 
          this.renderCurrentPledges() 
        }

        <br/>

        <h2>Previous Pledges</h2>
        <Card.Group>
          {this.renderPreviousPledges()}
        </Card.Group>

      </div>
    )
  }
}

export default Dashboard
