import React from 'react';
import './precursorItemsControlPanel.scss';

export default class precurorItemsControlPanel extends React.Component {

	constructor(props) {
		super(props);

	}

	render() {
		return (
			<div className="precurorItemsControlPanel-wrapper">
				<div className="head-section"></div>
				<div className="main-section">
					<div className="panels row">
						<div className="col-5">
							<div className="precursorItemsPanel-display">
								{this.props.precursorItems.map((item, index) => 
									<div key={`precursorItem-${index}`} className="precursorItems">{item.ITEM_NAME}</div>
								)}
							</div>
						</div>

						<div className="col-2"/>
						<div className="col-5">
							<div className="allItemPanel-display">
								{this.props.allItems.map((item, index)=> 
									<div key={`inventoryItem-${index}`} className="allItems">{item}</div>
								)}
							</div>
							<label>Search</label>
							<input id="allItemSearch" type="text"/>
							<label>Ration/100g</label>
							<input id="precursor-ration" type="number" step="0.001" placeholder = "0.000" min="0"/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
