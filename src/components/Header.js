import React, { Component } from "react";
import { Link } from 'react-router';
import { HiddenOnlyAuth, VisibleOnlyAuth } from '../util/wrappers.js';
import { Menu } from "semantic-ui-react";

// UI Components
import LoginButtonContainer from '../user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from '../user/ui/logoutbutton/LogoutButtonContainer'


class Header extends Component {
	render() {
		const OnlyAuthLinks = VisibleOnlyAuth(() => (

			<Menu.Menu position="right"> 
				<Menu.Item>
					<Link to="/dashboard"> Dashboard </Link>
				</Menu.Item>
				<Menu.Item>
					<Link to="/profile"> Profile </Link>
				</Menu.Item>
				<LogoutButtonContainer />
			</Menu.Menu>

		));

		const OnlyGuestLinks = HiddenOnlyAuth(() => (
			<span>
				<LoginButtonContainer />
			</span>
		));

		return (
			<Menu style={{ marginTop: "10px" }}>
				<Menu.Item>
					<Link to="/">dApptastic</Link>
				</Menu.Item>
				<Menu.Menu position="right">
					<Menu.Item> <OnlyGuestLinks /> </Menu.Item>
					<OnlyAuthLinks />
				</Menu.Menu>
			</Menu>
		);
	}
}

module.exports = Header;
