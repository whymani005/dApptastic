import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import AvatarCard from '../../components/AvatarCard';

//Contracts
//import getContract from './util/getContract.js';
//import PledgeFactory from "../build/contracts/PledgeFactory.json";

class Home extends Component {

  /*constructor(props) {
    super(props);

    this.getAllPledges = this.getAllPledges.bind(this);
  }

  async componentDidMount() {
    this.pledgeFactoryInstance = await getContract(PledgeFactory);

    const allPledges = await this.pledgeFactoryInstance.getDeployedCampaigns().call();

    const owner = await this.pledgeFactoryInstance.owner();

  }

  async getAllPledges() {

  }*/

  renderRandomPledges() {
    var items = [];
    const names = ['TEST_Mike', 'TEST_Harvey', 'TEST_Rachel', 'TEST_Jessica', 
                  'TEST_Donna', 'TEST_Loius', 'TEST_Norma'];
    for(var i=0; i<names.length; i++) {
      items.push(<AvatarCard avaName={names[i]} key={names[i]}/>);
    }

    return items;
  }


  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h2 style={{textAlign: 'center'}}>Current Pledges</h2>
          </div>
          <div>
            <Card.Group centered>
              {this.renderRandomPledges()}
            </Card.Group>
          </div>
        </div>
      </main>
    )
  }
}

module.exports = Home;
