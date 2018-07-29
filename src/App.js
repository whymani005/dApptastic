import React, { Component } from 'react';
import { Container, Message, Icon } from 'semantic-ui-react';
import web3 from './util/getWeb3.js';

// UI Components
import Header from './components/Header';

var SUPPORTED_NETWORKS = 'Private,Rinkeby';

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

  async updateInterface() {
    const networkId = this.getNetworkName(await web3.eth.net.getNetworkType());
    const accounts = await web3.eth.getAccounts();
    this.setState({ web3Account: accounts[0], web3Network: networkId});
  }


  constructor(props) {
    super(props);

    this.state = {
      web3Network: 'Unknown',
      web3Account: 'Unknown',
      deployedBy: 'Unknown'
    };

    this.initAccountRefresher = this.initAccountRefresher.bind(this);

  }

  initAccountRefresher() {
    setInterval(function() {
      web3.eth.getAccounts().then(result => {
        if (result[0] !== this.state.web3Account) {
          this.updateInterface();
        }
      });
    }.bind(this), 1000) 
  }

  async componentDidMount() {
    this.initAccountRefresher();
  }

  renderProviderInfo() {
    return (
      <Message info>
        <p style={{textAlign: 'center'}}>Connected to <strong>{this.state.web3Network}</strong> network using Metamask account <strong>{this.state.web3Account}</strong></p>
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
          {
            (SUPPORTED_NETWORKS.includes(this.state.web3Network)) ? 
            this.props.children : this.renderNetworkError()
          }
        </Container>

        <div>
          <br />
        </div>

      </React.Fragment>
    )
  }

  renderNetworkError() {
    return(
      <Message icon negative>
        <Icon name='warning sign' />
        <Message.Content>
          <Message.Header>Network Error!</Message.Header>
            You appear to be connected to the Ethereum <strong>{this.state.web3Network} </strong>
            network. This dApp currently only works on {SUPPORTED_NETWORKS} networks. 
            Please <strong>switch to a local network running on http://127.0.0.1:8545 </strong> 
            in order to use this dApp.
        </Message.Content>
      </Message>
    );
  }

}

module.exports = App;
