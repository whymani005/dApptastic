import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import AvatarCard from '../../components/AvatarCard';

//Contracts
import getContract from '../../util/getContract.js';
import PledgeFactory from "../../../build/contracts/PledgeFactory.json";
import Pledge from "../../../build/contracts/Pledge.json";

import web3 from '../../util/getWeb3.js';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      totalPledgeCount: 0,
      totalPledgedAmt: 0,
      allPledges: []
    };

    //this.getAllPledges = this.getAllPledges.bind(this);
  }

  async componentDidMount() {
    this.pledgeFactoryInstance = await getContract(PledgeFactory);

    //Platform Summary
    const totalPledgeCount = await this.pledgeFactoryInstance.allTimePledgedCount();
    const totalPledgedAmt = await this.pledgeFactoryInstance.allTimePledgedAmt();

    //Get All Pledges
    var items = [];
    const allUsers = await this.pledgeFactoryInstance.getUsers();
    for(var i=0; i< allUsers.length; i++) {
      const userAddress = allUsers[i];
      //TODO - get user avatar info!
      const userPledges = await this.pledgeFactoryInstance.getPledgesForUser(userAddress);
      for(var j=0; j<userPledges.length; j++) {
        const pledgeInstance = new web3.eth.Contract(Pledge.abi, userPledges[j]);
        //console.log('HOME - USRS - PLDGS --- INSTANCE: ', pledgeInstance);
        const tt = await pledgeInstance.methods.getSummary().call();
        tt['uportUser'] = userAddress;
        tt['avatarInfo'] = 'insert profile info';
        items.push(tt);
        console.log('HOME - USRS - PLDGS --- INSTANCE -- summaryyyyyy: ', tt);
      }
    }

    this.setState({ totalPledgeCount: totalPledgeCount, 
                    totalPledgedAmt: totalPledgedAmt,
                    allPledges: items
                  });
  }

  renderPledges() {
    var items = [];

    //REALL
    var realPledges = this.state.allPledges;
    for(var i=0; i<realPledges.length; i++) {
      const createTime = realPledges[i][0];
      const name = realPledges[i][3];
      const user = realPledges[i]['uportUser'];
      items.push(<AvatarCard avaName={name} key={createTime} userAddress={user}/>);
    }

    //JUST RANDOM
    const names = ['TEST_Mike', 'TEST_Harvey', 'TEST_Loius', 'TEST_Jessica', 'TEST_Donna'];
    for(var i=0; i<names.length; i++) {
      items.push(<AvatarCard avaName={names[i]} key={names[i]} />);
    }
    
    return items;
  }


  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h2 style={{textAlign: 'center'}}>Current Pledges</h2>
            <h4 style={{textAlign: 'center'}}>Total pledges: {this.state.totalPledgeCount.toString()} with total pledged amount: {this.state.totalPledgedAmt.toString()} wei</h4>
          </div>
          <br/>
          <div>
            <Card.Group centered>
              {this.renderPledges()}
            </Card.Group>
          </div>
        </div>
      </main>
    )
  }
}

module.exports = Home;
