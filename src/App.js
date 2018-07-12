import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import web3 from './util/getWeb3.js';

// UI Components
import Layout from './components/Layout';

//Contracts
import getContract from './util/getContract.js';
import PledgeFactory from "../build/contracts/PledgeFactory.json";


class App extends Component {

  //https://web3js.readthedocs.io/en/1.0/web3-eth-net.html
  getNetworkName(netId) {
    switch (netId) {
      case "1": return 'Mainnet';
      case "2": return 'Morden';
      case "3": return 'Ropsten';
      case "4": return 'Rinkeby';
      case "42": return 'Kovan';
      default: return 'Unknown/Private';
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      web3Network: 'Unknown',
      web3Accounts: [],
      owner: '',
      users: []
    };

    this.getOwner = this.getOwner.bind(this);
  }

  async componentDidMount() {
    this.pledgeFactoryInstance = await getContract(PledgeFactory);
    //const users = await this.pledgeFactoryInstance.getUsers();
    const accounts = await web3.eth.getAccounts();
    const networkId = this.getNetworkName(await web3.eth.net.getId());
    const owner = await this.pledgeFactoryInstance.owner();
    this.setState({ owner: owner, web3Accounts: accounts, web3Network: networkId});
  }

  async getOwner() {
    const owner = await this.pledgeFactoryInstance.owner();
    console.log('WONEERRR ehreeee: ',owner);
    this.setState({ owner: owner });
  }

  renderAccounts() {
    var allAccts = this.state.web3Accounts;
    return (
      <ul>
        {allAccts.map(function(acct) {
          return (
            <li key={acct}>{acct}</li>
          )
        })}
      </ul>
    )
  }

  renderProviderInfo() {
    return (
      <Card fluid color='red'>
        <Card.Content>
          <Card.Header>
            <div>Deployed by: {this.state.owner}</div>
            <br />
            <div>Current web3 Provider Info</div>
          </Card.Header>
          <Card.Meta>Network: {this.state.web3Network}</Card.Meta>
          <Card.Description>{this.renderAccounts()}</Card.Description>
        </Card.Content>
      </Card>
    )
  }

  


  render() {
    return (
      <Layout className="App">
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"></link>
        <h3 style={{textAlign: 'center'}}>A dApp to help you be a more fantastic version of you!</h3>
        <div className="metamaskDiv">
          {this.renderProviderInfo()}
        </div>
        <button onClick={this.getOwner}>Get Deployer Address!</button>
        <br />
        <div>
          {this.props.children}
        </div>
        
      </Layout>
    )
  }

}

module.exports = App;
