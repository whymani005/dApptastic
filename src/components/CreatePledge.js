import React, { Component } from 'react';
import { Form, Input, Select, Button, Message } from 'semantic-ui-react'
import getRandomAttrVal from '../util/avataarHelper.js';

//Contracts
import getContract from '../util/getContract.js';
import PledgeFactory from "../../build/contracts/PledgeFactory.json";

import web3 from '../util/getWeb3.js';
import { setJSON, getJSON } from '../util/ipfs.js'

const options = [
	  { key: '14', text: '14 Days', value: '14' },
	  { key: '30', text: '30 Days', value: '30' },
	  { key: '45', text: '45 Days', value: '45' }
	]


class CreatePledge extends Component {

	handleGoalSelection = (e, { value }) => this.setState({ choosenGoal: value })

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

		this.setState({ stepStatus: 'Saving avatar to IPFS. This will take a minute...' });
		const hash = await setJSON({ userAvatar: firstAvaInfo });
		const ipfsRet = 'Avatar saved at: ' + hash + '. Review/Submit txn details on Metamask to finalize.'; 
		this.setState({ stepStatus: ipfsRet });

		const totPledgedAmt = '0.05'; //in ETHER
		const numDays = 30;
		console.log('RAND YOU: ', firstAvaInfo);
		console.log('FOR USER: ', this.props.userAddress)
    	const accounts = await web3.eth.getAccounts();

    	const newPledge = await this.pledgeFactoryInstance.createPledge.sendTransaction(this.props.userAddress, 
    														totPledgedAmt, this.state.choosenGoal, numDays,
    														this.props.firstEverPledge, hash,
    														{from: accounts[0], 
    															value: web3.utils.toWei(totPledgedAmt, 'ether'), 
    															gas:1100000
    														})

		console.log('I CREATED A NEW PLEDGE txn: ', newPledge);

		this.props.callbackMet();
		this.setState({ stepStatus: 'Pledge created! Go to profile to view your default avatar.' });
		console.log('--------done--------');
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
			<React.Fragment>
				<p>CREATING PLEDGE ... (this may take some time)</p>
				<p>Status: {this.state.stepStatus}</p>
			</React.Fragment>
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
			          <Form.Field width={4} control={Select} label='How many days are you committing to?' options={options} placeholder='Length' />
			          <Form.Field width={2} control={Input} label='ETH per day' placeholder='Amt' />
			        </Form.Group>
			        <Message fluid="true" header='Summary'
					      list={[ 'Habit Name: ', 'For 30 days', 
					      'At 0.0001 ETH per day', 'Totalling 0.003 ETH currently valued at ~$50 USD' ]}
				  	/>
			        <Form.Field control={Button}>Submit</Form.Field>
			    </Form>
			</React.Fragment>
		);
	}

	/*renderGoalsList() {
		const GOALS = ['Gym', 'Creative Work', 'Eat Clean'];
		var items = [];
		for(var i=0; i<GOALS.length; i++) {
	      items.push(<Form.Field key={GOALS[i]}>
			          <Checkbox radio label={GOALS[i]}
			            name='checkboxRadioGroup'
			            value={GOALS[i]}
			            checked={this.state.value === GOALS[i]}
			            onChange={this.handleGoalSelection}
			          />
			        </Form.Field>);
	    }

	    return(
	    	<Form>
	    	<Form.Field>
	          Selected value: <b>{this.state.choosenGoal}</b>
	        </Form.Field>
	    	{items}
	    	</Form>
    	);
	}*/

}


module.exports = CreatePledge;