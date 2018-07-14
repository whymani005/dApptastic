import React, { Component } from 'react';
import { Form, Checkbox } from 'semantic-ui-react'
import getRandomAttrVal from '../util/avataarHelper.js';

//Contracts
import getContract from '../util/getContract.js';
import PledgeFactory from "../../build/contracts/PledgeFactory.json";

import web3 from '../util/getWeb3.js';


class CreatePledge extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    	choosenGoal: '',
	    	numDays: '',
	    	totalAmt: 0
	    }

	    this.createNewPledgeSol = this.createNewPledgeSol.bind(this);
	}

	async componentDidMount() {
    	this.pledgeFactoryInstance = await getContract(PledgeFactory);
  	}

	handleGoalSelection = (e, { value }) => this.setState({ choosenGoal: value })
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
		var firstAvaInfo = '';
		if(this.props.firstEverPledge) {
 			firstAvaInfo= this.generateFirstTimeRandAvatar();
		}
		
		const totPledgedAmt = '0.05'; //in ETHER
		console.log('RAND YOU: ', firstAvaInfo);
		console.log('FOR USER: ', this.props.userAddress)
    	const accounts = await web3.eth.getAccounts();
    	/*const newPledge = await this.pledgeFactoryInstance.createPledge(this.props.userAddress, 
    														totPledgedAmt, true, firstAvaInfo, 
    														{from: accounts[0], value: totPledgedAmt});*/
		

    	const newPledge = await this.pledgeFactoryInstance.createPledge.sendTransaction(this.props.userAddress, 
    														totPledgedAmt, this.state.choosenGoal,
    														this.props.firstEverPledge, firstAvaInfo,
    														{from: accounts[0], 
    															value: web3.utils.toWei(totPledgedAmt, 'ether'), 
    															gas:1100000
    														})

		console.log('I CREATED A NEW PLEDGE txn: ', newPledge);

		this.props.callbackMet();
		console.log('--------done--------');
  	}


	render() {
		return(
			<div>
				<p>You have no current pledges, fill the info below to get started!</p>
				<p>
	              <strong>Choose a GOAL</strong><br />
	            </p>
	            {this.renderGoalsList()}
	            <br/>
	            <button onClick={this.createNewPledgeSol}>Create Pledge!</button>
			</div>
		)
	}

}


module.exports = CreatePledge;