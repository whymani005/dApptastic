import React, { Component } from 'react';
import AvatarSelector from '../../components/AvatarSelector';
var MNID = require('mnid')

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  getNetworkSpecificUserAddress(mnidAddress) {
    const decodedId = MNID.decode(mnidAddress);
    const specificNetworkAddress = decodedId.address;
    return specificNetworkAddress;
  }

  render() {
    return(
      <div>
        <p><strong>Congratulations {this.props.authData.name}</strong> from {this.props.authData.country}! You've logged in with UPort successfully.</p>
        <p><strong>Your uPort MNID: {this.props.authData.address}</strong> </p>
        <p><strong>Your address: {this.getNetworkSpecificUserAddress(this.props.authData.address)}</strong> </p>
        <h1 style={{textAlign: 'center'}}>Dashboard</h1>
        <p>This is where you will see your pledges, and check in for the day!</p>
        <p>Before you create a new pledge, pick a fun avatar from Profile tab.</p>
        <AvatarSelector />
      </div>
    )
  }
}

export default Dashboard
