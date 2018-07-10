import React, { Component } from 'react';
import { Card, Icon } from 'semantic-ui-react';
import Avatar from 'avataaars';

import getRandomAttrVal from '../util/avataarHelper.js';


class AvatarCard extends Component {

	render() {
		return(
			<Card>
		      <Card.Content>
		        <Card.Header>
		        	<div>
						<Avatar style={{width:'250px',height:'250px'}} avatarStyle='Circle' 
						  topType={getRandomAttrVal('topType')} accessoriesType={getRandomAttrVal('accessoriesType')} 
						  hairColor={getRandomAttrVal('hairColor')} facialHairType={getRandomAttrVal('facialHairType')} 
						  clotheType={getRandomAttrVal('clotheType')} clotheColor={getRandomAttrVal('clotheColor')}
						  eyeType={getRandomAttrVal('eyeType')} eyebrowType={getRandomAttrVal('eyebrowType')} 
						  mouthType={getRandomAttrVal('mouthType')} skinColor={getRandomAttrVal('skinColor')}
						/>
					</div>
					<br />
					<div>{this.props.avaName}</div>
		        </Card.Header>
		        <Card.Meta>
		          <span>Goal: Eat clean</span>
		        </Card.Meta>
		        <Card.Description>
		          <p className='date'>5 days left in pledge</p>
		          <p className='date'>84% success</p>
		        </Card.Description>
		      </Card.Content>
		      <Card.Content extra>
		        <a><Icon name='user' /> 0x7902d2bfsd8 </a>
		      </Card.Content>
		    </Card>
	  	)
	}
}

module.exports = AvatarCard;

