import React, { Component } from 'react';
import { Container, Message } from 'semantic-ui-react';
import web3 from './util/getWeb3.js';

// UI Components
import Header from './components/Header';

//Contracts
//import getContract from './util/getContract.js';
//import PledgeFactory from "../build/contracts/PledgeFactory.json";


class App extends Component {

  //https://web3js.readthedocs.io/en/1.0/web3-eth-net.html
  getNetworkName(netId) {
    switch (netId) {
      case "main": return 'Mainnet';
      case "private": return 'Private';
      case "ropsten": return 'Ropsten';
      case "rinkeby": return 'Rinkeby';
      case "kovan": return 'Kovan';
      default: return 'Unknown';
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      web3Network: 'Unknown',
      web3Accounts: [],
      deployedBy: ''
    };

  }

  async componentDidMount() {
    const networkId = this.getNetworkName(await web3.eth.net.getNetworkType());
    const accounts = await web3.eth.getAccounts();

    /*this.pledgeFactoryInstance = await getContract(PledgeFactory);
    const deployedBy = await this.pledgeFactoryInstance.deployedBy();*/
    this.setState({ web3Accounts: accounts, web3Network: networkId});
  }

  renderProviderInfo() {
    return (
      <Message info>
        <p style={{textAlign: 'center'}}>Connected to <strong>{this.state.web3Network}</strong> network using Metamask account <strong>{this.state.web3Accounts[0]}</strong></p>
      </Message>
    )
  }

  render() {
    return (
      <React.Fragment>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"></link>
        
        <div>
          {this.renderProviderInfo()}
        </div>

        <Container>
          <Header />
          <br />
          {this.props.children}
        </Container>

        <div>
          <br />
        </div>

      </React.Fragment>
    )
  }

}

module.exports = App;
