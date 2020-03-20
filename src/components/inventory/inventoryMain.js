import React from 'react';

import Notification from './notificationView/notificationView';
import InventroyItemDisplay from './inventoryItemDisplay/inventoryItemDisplay';
export default class inventoryMain extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			loggedUser: this.props.accountInfo
		}

	
	}

	render() {
		return (
			<div className= "inventorymain-wrapper">
				<Notification/>
				<InventroyItemDisplay loggedUser = {this.props.accountInfo}/>
				
			</div>
		);
	}
}
