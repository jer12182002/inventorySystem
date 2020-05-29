import React from 'react';
import './holdItem.scss';

import $ from 'jquery';
export default class holdItem extends React.Component {

	holdItemClick(e) {
		this.props.lockHoldLock();
		$(".controlPanel-functions").addClass("display-none");
		$(".holdItem-wrapper").removeClass("display-none");
		$(".holdItem-input-container,.holdItem-input-container").removeClass("display-none");
		$(".holdFunctonBtns-container").removeClass("display-none");
	}

	holdConfirmClick(e) {
		let checkKey = false;
		let holdItems = {};

		let items = this.props.allItems.filter(item =>  // save item which have input of holdQty into items array
		{
			let holdQty = $(`#holdQty${item.ID}`).val();
			if(holdQty > 0) {
				item.HOLD_QTY = holdQty;
				return true;
			}
		});

		if(items.length > 0) {  // if there is or more than one item with holdQty save to holdItems
			holdItems.ITEMS = items;
			checkKey = true;
		}else {
			alert("Pleas enter Qty for hold Items");
		}

		
		if(checkKey && $("#holdName").val()){  // check if HoldFor info and date are valid
			holdItems.HOLDFOR = $("#holdName").val();
			holdItems.UNTIL = $("#holdDate").val();
			holdItems.AUTHOR = this.props.loggedUser.USERNAME;
			checkKey = true;
			if(holdItems.UNTIL && holdItems.UNTIL <= this.props.today) {
				alert("Invalid date");
				checkKey = false;
			}
		}else {
			alert("Missing information of Hold For");
		}

		console.log(holdItems);
		if(checkKey) {
			fetch(`http://localhost:4000/inventory/addhold?`,
				{	method:'POST',  
    				headers: {'Content-Type': 'application/json'},
    				body: JSON.stringify({holdItems:holdItems})
    			}	
    		)
			.then(res => res.json())
			.then(data=> {
				if(data.data && data.data === 'success') {
				}else {
					alert("Something is wrong, contact IT");
				}
					window.location.reload();
			})
		}
	}


	holdCancelClick(e) {
		$(".controlPanel-functions").removeClass("display-none");
		$(".holdFunctonBtns-container,.holdItem-input-container").addClass("display-none");
		this.props.lockHoldLock(false);
	}



	insertHoldItem (id,key) {
		let holdItem = {};
		holdItem.ITEM_ID = id;
		holdItem.RECIPIENT = $(`#holdName${key}`).val();
		holdItem.HOLD_QTY = $(`#holdQty${key}`).val();
		holdItem.DATE = $(`#holdDate${key}`).val();
		holdItem.PERSON = this.state.loggedUser.USERNAME;
		if(holdItem.PERSON === '' || holdItem.HOLD_QTY <= 0 || (holdItem.DATE !== '' && holdItem.DATE <= this.props.today)) {
			alert("Error! You are missed some infomation for hold item !!");
		}

		else {
			fetch(`http://localhost:4000/inventory/addhold?holdItem=${JSON.stringify(holdItem)}`)
			.then(res => res.json())
			.then(data=> {
				if(data.data === 'success') {
					this.props.loadAllItem();
					this.props.loadAllHoldItems();
				} 
			})
		}
	}
	render() {
		
		return (
			<div className = "holdItem-wrapper controlPanel-functions">
				<div className="holdItem-input-container main-function display-none">
				
						<label>Hold For:</label>	
						<input id="holdName" type="text" placeholder="Name"/>	
						
						<label>Until:</label>
						<input id="holdDate" className="sm-input inline-b" type="date"/>	
								
				</div>

				<div className="action-area">
					<button className="btn btn-primary" onClick = {e=>this.holdItemClick(e)}>Hold Item</button>
					<div className = "holdFunctonBtns-container inline-b display-none">
						<button className="btn btn-success" onClick = {e=> this.holdConfirmClick(e)}>Confirm</button>
						<button className="btn btn-warning" onClick = {e=>this.holdCancelClick(e)}>Cancel</button>
					</div>
				</div>
			</div>
		);
	}
}
