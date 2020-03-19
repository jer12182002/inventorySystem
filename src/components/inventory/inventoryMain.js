import React from 'react';

import Notification from './notificationView/notificationView';
import InventroyItemDisplay from './inventoryItemDisplay/inventoryItemDisplay';
export default class inventoryMain extends React.Component {


	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className= "inventorymain-wrapper">
				inventory main
				<Notification/>
				<InventroyItemDisplay/>
			</div>
		);
	}
}
