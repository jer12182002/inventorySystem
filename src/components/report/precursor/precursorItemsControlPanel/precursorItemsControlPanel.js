import React from 'react';
import './precursorItemsControlPanel.scss';
import $ from 'jquery';

export default class precurorItemsControlPanel extends React.Component {

	constructor(props) {
		super(props);

	}


	precursorItemClicked(e, id) {
		e.preventDefault();
		$(".precursorItemsPanel-display .precursorItems").removeClass("clicked");
		e.currentTarget.className += " clicked";
		this.props.updateSelectedPrecursorItem_idToBeRemoved(id);
	}


	itemClicked(e, item) {
		e.preventDefault();
		$(".allItemPanel-display .allItems").removeClass("clicked");
		e.currentTarget.className += " clicked";
		$("#allItemSearch").val(item);
		this.props.updateSelectPrecursorItem(item);
	}


	render() {
		return (
			<div className="precurorItemsControlPanel-wrapper">
				<div className="head-section text-center"><h3>Precursor Items Management</h3></div>
				<div className="main-section">
					<div className="panels row">
						<div className="col-5">
							<div className="precursorItemsPanel-display">
								{this.props.precursorItems.map((item, index) => 
									<div key={`precursorItem-${index}`} className="precursorItems" onClick = {e => this.precursorItemClicked(e,item.ITEM_ID)}><strong>Ration: {item.RATION} | NPN: {item.NPN === 0? 'N/A' : item.NPN}</strong><br/>{item.ITEM_NAME}</div>
								)}
							</div>
							<div className="function-panel">
								<button id="removePrecursorItemBtn" className="btn btn-warning" onClick = {e => this.props.removePrecursorItemClick(e)}>Remove</button>
							</div>
						</div>

						<div className="col-2"/>
						<div className="col-5">
							<div className="allItemPanel-display">
								{this.props.allItems.map((item, index)=> 
									<div key={`inventoryItem-${index}`} className="allItems" onClick = {e => this.itemClicked(e,item)}>{item}</div>
								)}
							</div>
							<div className="function-panel">
								<label>Search</label>
								<input id="allItemSearch" type="text" onChange = {e=> this.props.loadAllItems(e.target.value)}/>
								<label>Ration/100g</label>
								<input id="precursor-ration" type="number" step="0.001" placeholder = "0.000" min="0"/>
								<label>NPN</label>
								<input id="precursor-npn" type="number" min=""/>
								<button id="addPrecursorItemBtn" className="btn btn-primary"onClick={e => this.props.addPrecursorItemClick(e)}>Add</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
