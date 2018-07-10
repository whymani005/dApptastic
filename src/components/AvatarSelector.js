import React, { Component } from 'react';
import { Card, Grid, Segment, Dropdown } from 'semantic-ui-react';
import Avatar from 'avataaars';

import {facialHairColorOptions} from '../util/common.js';
import getRandomAttrVal from '../util/avataarHelper.js';


class AvatarSelector extends Component {

	constructor(props) {
	    super(props);

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

	    this.generateRandomAvatar = this.generateRandomAvatar.bind(this);
  	}

  	generateRandomAvatar() {
  		console.log('hellerrrr?');
	    const topType=getRandomAttrVal('topType');
	    const accessoriesType=getRandomAttrVal('accessoriesType');
	    const hairColor=getRandomAttrVal('hairColor');
	    const facialHairType=getRandomAttrVal('facialHairType');
	    const facialHairColor=getRandomAttrVal('facialHairColor');
	    const clotheType=getRandomAttrVal('clotheType');
	    const clotheColor=getRandomAttrVal('clotheColor');
		const eyeType=getRandomAttrVal('eyeType');
		const eyebrowType=getRandomAttrVal('eyebrowType');
		const mouthType=getRandomAttrVal('mouthType');
		const skinColor=getRandomAttrVal('skinColor');

	    this.setState(function() {
	      	return {
	      		  topType: topType, accessoriesType: accessoriesType, hairColor: hairColor,
			      facialHairType: facialHairType, facialHairColor: facialHairColor,
			      clotheType: clotheType, clotheColor: clotheColor,
			      eyeType: eyeType, eyebrowType: eyebrowType,
			      mouthType: mouthType, skinColor: skinColor
	      	}
	    });
	}


  	render() {
  		//onChange={this.onChange} <-- for dropdown!
  		console.log(this.state);
  		return(
  			<Grid>
			    <Grid.Column width={4}>
			      <Card>
	                <Card.Content>
	                  <Card.Header>
	                    <div>
	                      <Avatar style={{width:'230px',height:'230px'}} avatarStyle='Circle' 
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
			    </Grid.Column>
			    <Grid.Column width={12}>
			      <Grid columns='equal'>
				    <Grid.Row>
				      <Grid.Column>
				        <Dropdown placeholder='Facial Hair Color' selection options={facialHairColorOptions} />
				      </Grid.Column>
				    </Grid.Row>
				    <Grid.Row>
				    	<button onClick={this.generateRandomAvatar}>Generate Random!</button>
				    </Grid.Row>
				  </Grid>
			    </Grid.Column>
			</Grid>
		)
  	}

}

module.exports = AvatarSelector;

