import React, { Component } from 'react';
import { Card, Icon } from 'semantic-ui-react';
import Avatar from 'avataaars';

import getAvatarDictFromStr from '../util/common.js';
import web3 from '../util/getWeb3.js';


class AvatarCard extends Component {

	render() {
		var items = getAvatarDictFromStr(this.props.userAvatar);

		var d = new Date(0);
		d.setUTCSeconds(this.props.createdAt);

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
		          <span>Created on: {d.toString()}</span>
		        </Card.Meta>
		        <Card.Description>
		        	<p><strong>Number of Days: </strong>{this.props.numDays}</p>
		        	<p><strong>Total Pledged Amount: </strong>{web3.utils.fromWei(this.props.totalPledgedAmt.toString(), 'ether')} ETH</p>
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

