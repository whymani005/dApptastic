import React, { Component } from 'react';
import { Card, Button, Grid, Segment } from 'semantic-ui-react';
import Avatar from 'avataaars';

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
              <Card>
                <Card.Content>
                  <Card.Header>
                    <div>
                      <Avatar style={{width:'250px',height:'250px'}} avatarStyle='Circle' 
                        topType={this.state.topType} accessoriesType={this.state.accessoriesType} 
                        hairColor={this.state.hairColor} facialHairType={this.state.facialHairType} 
                        clotheType={this.state.clotheType} clotheColor={this.state.clotheColor}
                        eyeType={this.state.eyeType} eyebrowType={this.state.eyebrowType} 
                        mouthType={this.state.mouthType} skinColor={this.state.skinColor}
                      />
                    </div>
                  </Card.Header>
                </Card.Content>
              </Card>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

module.exports = Profile;
