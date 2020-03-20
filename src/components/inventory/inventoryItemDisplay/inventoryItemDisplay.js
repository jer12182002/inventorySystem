import React from 'react';
import './inventoryItemDisplay.scss';

import ControlPanel from './inventoryControlPanel/inventoryControlPanel';

export default class inventoryItemDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedUser: this.props.loggedUser
		}
	}

	

	render() {
		return (
			<div className="inventoryitemdisplay-wrapper">

				<div className="header-section">Item Info</div>
				<div className="main-section">TYPE, SHELF NO, MANAFACTURE, NAME, TOTALQTY, QTY, EXPM, GRAM, TAG {this.state.loggedUser.ID}</div>
				<ControlPanel/>

			</div>
		);
	}
}
