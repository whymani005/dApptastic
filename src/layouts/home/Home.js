import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import AvatarCard from '../../components/AvatarCard';

//Contracts
import getContract from '../../util/getContract.js';
import PledgeFactory from "../../../build/contracts/PledgeFactory.json";

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      totalPledgeCount: '',
      totalPledgedAmt: ''
    };

    this.getAllPledges = this.getAllPledges.bind(this);
  }

  async componentDidMount() {
    this.pledgeFactoryInstance = await getContract(PledgeFactory);
    const totalPledgeCount = await this.pledgeFactoryInstance.allTimePledgedCount();
    const totalPledgedAmt = await this.pledgeFactoryInstance.allTimePledgedAmt();
    this.setState({ totalPledgeCount: totalPledgeCount.toString(), 
                    totalPledgedAmt: totalPledgedAmt.toString()
                  });
  }

  async getAllPledges() {

  }

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
            <h4 style={{textAlign: 'center'}}>Total pledges: {this.state.totalPledgeCount} with total pledged amount: {this.state.totalPledgedAmt}</h4>
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
