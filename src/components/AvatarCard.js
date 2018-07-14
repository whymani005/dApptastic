import React, { Component } from 'react';
import { Card, Icon } from 'semantic-ui-react';
import Avatar from 'avataaars';

import getAvatarDictFromStr from '../util/common.js';


class AvatarCard extends Component {

	render() {
		var items = getAvatarDictFromStr(this.props.userAvatar);
		return(
			<Card>
		      <Card.Content>
		        <Card.Header>
		        	<div>
						<Avatar style={{width:'250px',height:'250px'}} avatarStyle='Circle' 
					        topType={items['topType']} accessoriesType={items['accessoriesType']} 
					        hairColor={items['hairColor']} facialHairType={items['facialHairType']} 
					        clotheType={items['clotheType']} clotheColor={items['clotheColor']}
					        eyeType={items['eyeType']} eyebrowType={items['eyebrowType']} 
					        mouthType={items['mouthType']} skinColor={items['skinColor']}
				      	/>
					</div>
					<br />
					<div>{this.props.goalType}</div>
		        </Card.Header>
		        <Card.Meta>
		          <span>Goal: {this.props.goalType}</span>
		        </Card.Meta>
		        <Card.Description>
		          <p className='date'>5 days left in pledge</p>
		          <p className='date'>84% success</p>
		        </Card.Description>
		      </Card.Content>
		      <Card.Content extra>
		        <a><Icon name='user' /> {this.props.userAddress} </a>
		      </Card.Content>
		    </Card>
	  	)
	}
}

module.exports = AvatarCard;

