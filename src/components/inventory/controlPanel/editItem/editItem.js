import React from 'react';
import './editItem.scss';

import $ from 'jquery';
export default class editItem extends React.Component {


	editItemClick(e){
		e.preventDefault();
		$('.controlPanel-functions').addClass("display-none");
		$('.editItem-wrapper').removeClass("display-none");
		$('#editItemBtn').addClass("display-none");
		$('.editFunctonBtns-container').removeClass("display-none");
		this.props.lockEditLock();
	}


	editFinishClick(e) {
		e.preventDefault();
		$('.editFunctonBtns-container').addClass("display-none");
		$('.controlPanel-functions').removeClass("display-none");
		$('#editItemBtn').removeClass("display-none");
		this.props.lockEditLock(false);
	}


	render() {
		return (
			<div className="editItem-wrapper controlPanel-functions">
				<div className="main-function display-none"></div>
				<div className="action-area">
					<button id="editItemBtn"className="btn btn-primary" onClick={e=>this.editItemClick(e)}>Edit Item</button>
					<div className = "editFunctonBtns-container inline-b display-none">
						<button className="btn btn-success" onClick = {e=> this.editFinishClick(e)}>Finish</button>
					</div>
				</div>
			</div>
		);
	}
}
