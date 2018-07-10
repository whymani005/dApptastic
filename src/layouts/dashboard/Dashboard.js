import React, { Component } from 'react';
import AvatarSelector from '../../components/AvatarSelector';

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <div>
        <p><strong>Congratulations {this.props.authData.name}!</strong> You've logged in with UPort successfully.</p>
        <h1 style={{textAlign: 'center'}}>Dashboard</h1>
        <p>This is where you will see your pledges, and check in for the day!</p>
        <p>Before you create a new pledge, pick a fun avatar from Profile tab.</p>
        <AvatarSelector />
      </div>
    )
  }
}

export default Dashboard
