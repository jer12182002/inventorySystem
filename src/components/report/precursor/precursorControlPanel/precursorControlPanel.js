import React from 'react';
import './precursorControlPanel.scss';

import $ from 'jquery';
export default class precursorControlPanel extends React.Component {


	constructor(props) {
		super(props);
	
	}


	precursorClicked(e, precursor) {
		e.preventDefault();
		$("#precursor").val(precursor.PRECURSOR);
		$("#precursor-ration").val(precursor.RATION);
		$(".hidden-btns").removeClass("display-none");
		this.props.updateSelectPrecursorId(e, precursor.ID);
	}

	

	render() {
		return (
			<div className="precursorControlPanel-wrapper">
				<div className="head-section"><h3>Precursor Management</h3></div>
				<div className="main-section container-fluid">
					<div className="precursorPanel-display">
						{this.props.precursors.map((precursor, index) =>
							<div className={`precursors ${precursor.ID === this.props.selectedPrecursor_id? "clicked" : ""}`} onClick = {e => this.precursorClicked(e, precursor)}>{precursor.PRECURSOR}/{precursor.RATION}</div>
							)}
					</div>
					<div className="precursorPanel-wrapper row">
						<div className="col-8 col-md-8">
							<label>Precursor</label>
							<input id="precursor" type="text"/>
							<label>Ration/100g</label>
							<input id="precursor-ration" type="number" step="0.001" placeholder = "0.000" min="0"/>
						</div>
						<div className="col-4 col-md-4">
							<button onClick={e => this.props.precursorAction(e,"add")}>Add</button>
							<div className="hidden-btns inline-b display-none">
								<button onClick={e => this.props.precursorAction(e,"update")}>Update</button>
								<button onClick = {e => this.props.precursorAction(e, "delete")}>Delete</button>
							</div>
						</div>
					</div>
					<div className="precursorItem-wrapper">
					</div>
				</div>
			</div>
		);
	}
}
