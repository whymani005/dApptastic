import React, { Component } from 'react';
import Avatar from 'avataaars';
import AvatarSelector from '../../../components/AvatarSelector';
var MNID = require('mnid');

//Contracts
import getContract from '../../../util/getContract.js';
import PledgeFactory from "../../../../build/contracts/PledgeFactory.json";

import getAvatarDictFromStr from '../../../util/common.js';


class Profile extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props;

    this.state = {
      specificNetworkAddress: 'none',
      totalNumPledges: 0,
      avatarDesc: ''
    };
  }

  async componentDidMount() {
    const specificNetworkAddress = this.getNetworkSpecificUserAddress(this.props.authData.address);
    this.pledgeFactoryInstance = await getContract(PledgeFactory);
    const thisUserPledges = await this.pledgeFactoryInstance.getPledgesForUser(specificNetworkAddress);
    const thisUserAvatar = await this.pledgeFactoryInstance.getProfileInfoForUser(specificNetworkAddress);
    this.setState({ specificNetworkAddress: specificNetworkAddress, 
      totalNumPledges: thisUserPledges.length.toString(),
      avatarDesc: thisUserAvatar});
  }

  getNetworkSpecificUserAddress(mnidAddress) {
    const decodedId = MNID.decode(mnidAddress);
    const specificNetworkAddress = decodedId.address;
    return specificNetworkAddress;
  }

  renderUserAvatar() {
    var items = getAvatarDictFromStr(this.state.avatarDesc);
    return(
      <Avatar style={{width:'250px',height:'250px'}} avatarStyle='Circle' 
        topType={items['topType']} accessoriesType={items['accessoriesType']} 
        hairColor={items['hairColor']} facialHairType={items['facialHairType']} 
        clotheType={items['clotheType']} clotheColor={items['clotheColor']}
        eyeType={items['eyeType']} eyebrowType={items['eyebrowType']} 
        mouthType={items['mouthType']} skinColor={items['skinColor']}
      />
    );
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1 style={{textAlign: 'center'}}>Profile</h1>
            <p>
              <strong>Name</strong><br />
              {this.props.authData.name}
            </p>
            <p>
              <strong>Multi Network ID</strong><br />
              {this.props.authData.address}
            </p>
            <p>
              <strong>Network Specific Address</strong><br />
              {this.state.specificNetworkAddress}
            </p>
            <p>
              <strong>Total Pledges</strong><br />
              {this.state.totalNumPledges}
            </p>
            <div>
              <strong>Your Avatar</strong><br />
              { (this.state.avatarDesc !== '') ? 
                  this.renderUserAvatar() : 
                  <p>A default avatar will be created when you create your first pledge.<br/>
                  Options to customize your avatar appear the more checkins/pledges you finish.<br/><br/>
                  <strong>Go to your Dashboard now to get started!!</strong>
                  </p> 
              }
            </div>
            <br/>
          </div>
        </div>
      </main>
    )
  }
}

module.exports = Profile;
