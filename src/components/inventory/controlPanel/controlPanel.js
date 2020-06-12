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
			today: this.props.today,
			allItems: [], 
			allHistoryItems:[]
		}
			
	}

	componentWillReceiveProps(newProps) {
	  if (this.state.allItems !== newProps.allItems) {
	    this.setState({allItems: newProps.allItems});
	  }

	  if(this.state.allHistoryItems !== newProps.allHistoryItems) {
	  	this.setState({allHistoryItems: newProps.allHistoryItems});
	  }
	}

	//=================================Filter===================================================
	filterCallFromChild(filterArr){
		this.setState({allItems:this.props.setStateWithRowSpan(filterArr)});
	}
	//==========================================================================================
	render() {
		// This is just a container to hold different functions

		return (
			<div className="controlPanel-wrapper">
				{this.state.loggedUser.ADD_ITEM?
				<AddItem loggedUser = {this.state.loggedUser}/>:null
				}
				{ this.state.loggedUser.NAME_MODIFY || this.state.loggedUser.QTY_MODIFY
				||this.state.loggedUser.TYPE_MODIFY || this.state.loggedUser.SHELF_MODIFY 
				||this.state.loggedUser.GRAM_MODIFY || this.state.EXP_MODIFY?
				<EditItem  lockEditLock={this.props.lockEditLock} />:null
				}
				<HoldItem  loggedUser = {this.state.loggedUser}
						   today = {this.props.today}
						   allItems={this.props.allItems}
						   lockHoldLock={this.props.lockHoldLock}/>
				<Filter loggedUser = {this.state.loggedUser} 
						allHistoryItems = {this.state.allHistoryItems}
						filterAllItemsFromChild = {this.props.filterAllItemsFromChild}/>
			</div>
		);
	}
}
