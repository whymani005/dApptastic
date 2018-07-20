import React, { Component } from 'react';
import { Container, Message } from 'semantic-ui-react';
import web3 from './util/getWeb3.js';

// UI Components
import Header from './components/Header';

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
      deployedBy: ''
    };

    this.getOwner = this.getOwner.bind(this);
  }

  async componentDidMount() {
    this.pledgeFactoryInstance = await getContract(PledgeFactory);
    //const users = await this.pledgeFactoryInstance.getUsers();
    const accounts = await web3.eth.getAccounts();
    const networkId = this.getNetworkName(await web3.eth.net.getId());
    const deployedBy = await this.pledgeFactoryInstance.deployedBy();
    this.setState({ deployedBy: deployedBy, 
          web3Accounts: accounts, web3Network: networkId});
  }

  async getOwner() {
    const deployedBy = await this.pledgeFactoryInstance.deployedBy();
    this.setState({ deployedBy: deployedBy });
  }

  /*renderAccounts() {
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
  }*/

  renderProviderInfo() {
    return (
      <Message info>
        <Message.Header>Application Info</Message.Header>
        <p>dApp deployed by: {this.state.deployedBy}</p>
        <p>You're connected to: <strong>{this.state.web3Network} network</strong></p>
        <p>Current Metamask Account: <strong>{this.state.web3Accounts[0]}</strong></p>
        <p></p>
      </Message>
    )
  }

  render() {
    return (
      <React.Fragment>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"></link>
        
        <div>
          {this.renderProviderInfo()}
          <br />
        </div>

        <Container>
          <h3 style={{textAlign: 'center'}}>A dApp to help you be a more fantastic version of you!</h3>
          <Header />
          <br />
          <div>
            {this.props.children}
          </div>
        </Container>

        <div>
          <br />
        </div>

      </React.Fragment>
    )
  }

}

module.exports = App;
