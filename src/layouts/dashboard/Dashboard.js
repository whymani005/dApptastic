import React, { Component } from 'react';
import { Card, Progress, Button, Message, Icon } from 'semantic-ui-react';
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
      isLoading: true,
      isError: false,
      userActivePledgeSummaries: [],
      userInActivePledgeSummaries: []
    };

    this.closePledgeSol = this.closePledgeSol.bind(this);
    this.fetchPledgesData = this.fetchPledgesData.bind(this);
  }

  async componentDidMount() {
    const specificNetworkAddress = this.getNetworkSpecificUserAddress(this.props.authData.address);
    this.pledgeFactoryInstance = await getContract(PledgeFactory);
    
    await this.fetchPledgesData(specificNetworkAddress);

    this.setState({ userAddress: specificNetworkAddress, 
                    isLoading: false });
  }

  //https://stackoverflow.com/questions/33680315/react-need-to-call-parent-to-re-render-component
  async fetchPledgesData(userAddress) {
    const pledgeAddresses = await this.pledgeFactoryInstance.getPledgesForUser(userAddress);

    var active_pledgeSummaries = [];
    var inactive_pledgeSummaries = [];

    for(var i=0; i<pledgeAddresses.length; i++) {
        const pledgeInstance = new web3.eth.Contract(Pledge.abi, pledgeAddresses[i]);
        const tt = await pledgeInstance.methods.getSummary().call();
        tt['contractAddress'] = pledgeAddresses[i];
        const isActive = tt[4];
        console.log('fetchPledgesData: ', tt);
        console.log('fetchPledgesData ii isActive : ', tt[4]);
        if(isActive) {
          active_pledgeSummaries.push(tt);
        } else {
          inactive_pledgeSummaries.push(tt);
        }
    }

    this.setState({ userActivePledgeSummaries: active_pledgeSummaries, 
                    userInActivePledgeSummaries: inactive_pledgeSummaries});
  }

  getNetworkSpecificUserAddress(mnidAddress) {
    const decodedId = MNID.decode(mnidAddress);
    const specificNetworkAddress = decodedId.address;
    return specificNetworkAddress;
  }

  closePledgeSol = async (address, event) => {
    event.preventDefault();
    const initStatus = 'Initiate finishPledge() for Pledge contract at: '+ address;
    this.setState({ isLoading: true, stepStatus: initStatus });

    try {
      const accounts = await web3.eth.getAccounts();
      const pledgeInstance = new web3.eth.Contract(Pledge.abi, address);
      console.log('pledgeInstance: ', pledgeInstance);
      const tt = await pledgeInstance.methods.finishPledge(this.state.userAddress).send({
          from: accounts[0], gas:100000
        });

      this.setState({ isLoading: true, stepStatus: 'Pledge closed! Reloading data...' });
      await this.fetchPledgesData(this.state.userAddress);
      this.setState({ isLoading: false });
    } catch(err) {
      this.setState({ stepStatus: 'Error calling finishPledge: '+err.message });
    }
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
      const contractAddress = this.state.userActivePledgeSummaries[i]['contractAddress'];
      const checkins = [1,2,3,6,9,11,12,13,14,16,17,19,24,27];

      items.push(
        <Card fluid key={createdAt.toString()}>
          <Card.Content>
            <Card.Header>Goal: {goalType}</Card.Header>
            <Card.Meta>Started On: {pledgedDate.toString()}</Card.Meta>
            <Card.Description>
              Today is day <strong>{onDay}</strong> of a <strong>{numDays}</strong> day pledge.<br/>
              <strong>Total Pledged Amount: </strong>{web3.utils.fromWei(totAmt.toString(), 'ether')} ETH<br/><br/>
              {this.renderCheckinsCal(numDays, checkins, onDay)}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button fluid basic color='red' onClick={(e) => this.closePledgeSol(contractAddress, event)} >Close Pledge</Button>
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

    //REAL
    const percTest = [90];
    for(var i=0; i<this.state.userInActivePledgeSummaries.length; i++) {      
      var createdAt = new Date(0);
      createdAt.setUTCSeconds(this.state.userInActivePledgeSummaries[i][0]);
      var pledgedDate = format(createdAt, 'MM/DD/YYYY');

      const totAmt = this.state.userInActivePledgeSummaries[i][1];
      //const numDays = this.state.userInActivePledgeSummaries[i][2];
      const goalType = this.state.userInActivePledgeSummaries[i][3];

      items.push(<Card key={createdAt}>
          <Card.Content>
            <Card.Header>{goalType}</Card.Header>
            <Card.Meta>Started: {pledgedDate}</Card.Meta>
            <Card.Description>Total Pledged: {web3.utils.fromWei(totAmt.toString(), 'ether')} ETH</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Card.Meta>Success Rate</Card.Meta>
            <Progress fluid="true" percent={percTest[i]} progress indicating/>
          </Card.Content>
        </Card>);
    }


    //JUST RANDOM
    const names = ['Goal: Creative Work_TEST', 'Goal: Gym_TEST'];
    const perc = [43, 72];
    for(var test=0; test<names.length; test++) {
      items.push(<Card key={names[test]}>
          <Card.Content>
            <Card.Header>{names[test]}</Card.Header>
            <Card.Meta>Started: Invalid Date</Card.Meta>
            <Card.Description>Total Pledged: xx.XX ETH</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Card.Meta>Success Rate</Card.Meta>
            <Progress fluid="true" percent={perc[test]} progress indicating/>
          </Card.Content>
        </Card>);
    }

    return items;
  }

  render() {
    return(
      <React.Fragment>
        <p><strong>Welcome {this.props.authData.name}</strong> from {this.props.authData.country}!</p>
        <h1 style={{textAlign: 'center'}}>Dashboard</h1>

        {
          (this.state.isLoading) ? this.renderLoading() : this.renderPledges()
        }

        <br/>
      </React.Fragment>
    )
  }

  renderPledges() {
    const firstEverPledge = (this.state.userActivePledgeSummaries.length < 1 && this.state.userInActivePledgeSummaries.length < 1)
    return(
      <React.Fragment>
        <h2>Current Pledge</h2>
        { (this.state.userActivePledgeSummaries.length < 1) ? 
          <CreatePledge userAddress={this.state.userAddress} callbackMet={this.fetchPledgesData} firstEverPledge={firstEverPledge}/> : 
          this.renderCurrentPledges() 
        }

        <br/>

        <h2>Previous Pledges</h2>
        <Card.Group>
          {this.renderPreviousPledges()}
        </Card.Group>
      </React.Fragment>
    );
  }

  renderLoading() {
    return(
      <Message icon>
          <Icon name='circle notched' loading />
          <Message.Content>
            <Message.Header>Things in progress, sit tight!</Message.Header>
            <strong>Status:</strong> {this.state.stepStatus}
          </Message.Content>
        </Message>
    );
  }


}

export default Dashboard
