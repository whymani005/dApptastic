import React, { Component } from 'react';
import { Form, Input, Select, Button, Message, Icon } from 'semantic-ui-react'
import getRandomAttrVal from '../util/avataarHelper.js';

//Contracts
import getContract from '../util/getContract.js';
import PledgeFactory from "../../build/contracts/PledgeFactory.json";

import web3 from '../util/getWeb3.js';
import { setJSON } from '../util/ipfs.js'

const options = [
	  { key: '14', text: '14 Days', value: '14' },
	  { key: '30', text: '30 Days', value: '30' },
	  { key: '45', text: '45 Days', value: '45' }
	]


class CreatePledge extends Component {

	handleNumDaysSelection = (e, { value }) => this.setState({ numDays: value })

	constructor(props) {
	    super(props);

	    this.state = {
	    	choosenGoal: '',
	    	numDays: '',
	    	totalAmt: 0,
	    	loading: false,
	    	stepStatus: ''
	    }

	    this.createNewPledgeSol = this.createNewPledgeSol.bind(this);
	}

	async componentDidMount() {
    	this.pledgeFactoryInstance = await getContract(PledgeFactory);
  	}

	generateFirstTimeRandAvatar() {
		var avatarStr = '';
		const avaAttributes = ['topType','accessoriesType','hairColor','facialHairType','facialHairColor',
								'clotheType','clotheColor','eyeType','eyebrowType','mouthType','skinColor'];

		for(var i=0; i<avaAttributes.length; i++) {
			var attr = avaAttributes[i]+'='+getRandomAttrVal(avaAttributes[i]);
			avatarStr = ((avatarStr === '') ? attr : avatarStr+'&'+attr);
		}
		return avatarStr;
	}

	createNewPledgeSol = async (event) => {
		event.preventDefault();
		this.setState({ loading: true, stepStatus: 'Generating avatar' });

		var firstAvaInfo = '';
		if(this.props.firstEverPledge) {
 			firstAvaInfo = this.generateFirstTimeRandAvatar();
		}

		this.setState({ stepStatus: 'Saving info to IPFS. This will take a minute...' });
		const hash = await setJSON({ userAvatar: firstAvaInfo });
		const ipfsRet = 'Avatar saved at IPFS: ' + hash + '. Review/Submit txn details on Metamask to finalize.'; 
		this.setState({ stepStatus: ipfsRet });

		const totPledgedAmt = '0.05'; //in ETHER
		const numDays = this.state.numDays.trim();
    	const accounts = await web3.eth.getAccounts();
    	const successPerc = 60;

    	try {
			const newPledge = await this.pledgeFactoryInstance.createPledge.sendTransaction(
																this.props.userAddress, 
																totPledgedAmt, 
																this.state.choosenGoal, 
																numDays, successPerc, 
																this.props.firstEverPledge, 
																hash,
	    														{from: accounts[0], 
	    															value: web3.utils.toWei(totPledgedAmt, 'ether'), 
	    															gas:1100000
	    														}
															);

			console.log('I CREATED A NEW PLEDGE txn: ', newPledge);

			this.props.callbackMet();
			this.setState({ stepStatus: 'Pledge created! Go to profile to view your default avatar.' });
			console.log('--------done--------');
    	} catch(err) {
    		console.log('[CreatePledge.js][createNewPledgeSol] - ', err);
    		this.setState({ stepStatus: err });
    	}

    	
  	}


	render() {
		return(
			<React.Fragment>
				{ this.state.loading ? this.renderLoading() : this.renderCreatePledgeForm() }
			</React.Fragment>
		);
	}

	renderLoading() {
		return(
			<Message icon>
			    <Icon name='circle notched' loading />
			    <Message.Content>
			      <Message.Header>Creating Pledge ... (this may take some time)</Message.Header>
			      <strong>Status:</strong> {this.state.stepStatus}
			    </Message.Content>
		  	</Message>
		);
	}

	
	renderCreatePledgeForm() {
		return(
			<React.Fragment>
				<p>You've got none. Let's create one!</p>
				<Form onSubmit={this.createNewPledgeSol}>
			        <Form.Group >
			          <Form.Field width={10} control={Input} 
			          				value={this.state.choosenGoal} 
			          				onChange={event => this.setState({ choosenGoal: event.target.value })} 
			          				label='Name your new habit' placeholder='New Habit...' 
          				/>
			          <Form.Field width={4} control={Select} value={this.state.numDays} 
			          			onChange={this.handleNumDaysSelection}
			          			label='How many days are you committing to?' 
			          			options={options} placeholder='Length' />
			          <Form.Field width={2} control={Input} label='ETH per day' placeholder='Amt' />
			        </Form.Group>

				    <Message info>
				        <Message.Header>Summary</Message.Header>
				        <p>Habit Name: {this.state.choosenGoal}</p>
				        <p>For {this.state.numDays} days</p>
				        <p>At 0.001 ETH per day</p>
				        <p>Totalling 0.003 ETH currently valued at ~$50 USD</p>
			      	</Message>

			        <Form.Field control={Button}>Submit</Form.Field>
			    </Form>
			</React.Fragment>
		);
	}

}


module.exports = CreatePledge;