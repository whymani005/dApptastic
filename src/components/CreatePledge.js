import React, { Component } from 'react';
import { Form, Checkbox } from 'semantic-ui-react'
import getRandomAttrVal from '../util/avataarHelper.js';

//Contracts
import getContract from '../util/getContract.js';
import PledgeFactory from "../../build/contracts/PledgeFactory.json";

import web3 from '../util/getWeb3.js';
import { setJSON, getJSON } from '../util/ipfs.js'


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

	async createNewPledgeSol() {
		this.setState({ loading: true, stepStatus: 'Generating avatar' });
		var firstAvaInfo = '';
		if(this.props.firstEverPledge) {
 			firstAvaInfo = this.generateFirstTimeRandAvatar();
		}

		this.setState({ stepStatus: 'Saving avatar to IPFS. This will take a minute...' });
		const hash = await setJSON({ userAvatar: firstAvaInfo });
		console.log('CreatePledge.js - Got IPFS hash for avatar: ', hash);
		
		const totPledgedAmt = '0.05'; //in ETHER
		const numDays = 30;
		console.log('RAND YOU: ', firstAvaInfo);
		console.log('FOR USER: ', this.props.userAddress)
    	const accounts = await web3.eth.getAccounts();

		this.setState({ stepStatus: 'Avatar saved! Review/Submit txn details on Metamask to finalize pledge...' });
        console.log('CreatePledge.js - Before createPledge with avatar hash loc: ', firstAvaInfo);
    	const newPledge = await this.pledgeFactoryInstance.createPledge.sendTransaction(this.props.userAddress, 
    														totPledgedAmt, this.state.choosenGoal, numDays,
    														this.props.firstEverPledge, firstAvaInfo,
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
				<p>You have no current pledges, fill the info below to get started!</p>
				<p>
	              <strong>Choose a GOAL</strong><br />
	            </p>
	            {this.renderGoalsList()}
	            <br/>
	            <button onClick={this.createNewPledgeSol}>Create Pledge!</button>
			</React.Fragment>
		);
	}

	renderGoalsList() {
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
	}

}


module.exports = CreatePledge;