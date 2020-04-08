import React from 'react';

import Notification from './notificationView/notificationView';
import InventroyItemDisplay from './inventoryItemDisplay/inventoryItemDisplay';
export default class inventoryMain extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			accountInfo: this.props.accountInfo
		}

	
	}

	render() {
		return (
			<div className= "inventorymain-wrapper">
				<Notification/>
				{this.state.accountInfo.VIEW_ITEM? 
				<InventroyItemDisplay loggedUser = {this.state.accountInfo}/>
				:null}
			</div>
		);
	}
}
