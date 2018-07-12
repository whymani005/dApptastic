import React, { Component } from 'react';
import AvatarSelector from '../../../components/AvatarSelector';

class Profile extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props;

    this.state = {
      topType: 'LongHairMiaWallace',
      accessoriesType: 'Prescription02',
      hairColor: 'BrownDark',
      facialHairType: 'Blank',
      facialHairColor: 'Blank',
      clotheType: 'Hoodie',
      clotheColor: 'PastelBlue',
      eyeType: 'Happy',
      eyebrowType: 'Default',
      mouthType: 'Smile',
      skinColor: 'Light'
    };

  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Profile</h1>
            <p>Change these details in UPort to see them reflected here.</p>
            <p>
              <strong>Name</strong><br />
              {this.props.authData.name}
            </p>
            <h2>Create a cool avatar!</h2>
            <div>
              <AvatarSelector />
            </div>
          </div>
        </div>
      </main>
    )
  }
}

module.exports = Profile;
