import React from 'react';
import './controlPanel.scss';

import AddItem from './addItem/addItem';
import EditItem from './editItem/editItem';
import Filter from './filter/filter';
import HoldItem from './holdItem/holdItem';

export default class controlPanel extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loggedUser : this.props.loggedUser, 
			today: this.props.today
		}
	}

	render() {
		// This is just a container to hold different functions

		return (
			<div className="controlPanel-wrapper">
				{this.state.loggedUser.ADD_ITEM?
				<AddItem loggedUser = {this.state.loggedUser}/>:null
				}
				<EditItem/>
				<HoldItem/>
				<Filter/>
			</div>
		);
	}
}
