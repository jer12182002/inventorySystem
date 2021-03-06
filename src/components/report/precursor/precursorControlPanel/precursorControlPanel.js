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
		$(".hidden-btns").removeClass("display-none");
		this.props.updateSelectPrecursorId(precursor.ID);
	}

	

	render() {
		return (
			<div className="precursorControlPanel-wrapper">
				<div className="head-section text-center"><h3>Cites Management</h3></div>
				<div className="main-section container-fluid">
					<div className="precursorPanel-display">
						{this.props.precursors.map((precursor, index) =>
							<div key={`precursor-${index}`} className={`precursors ${precursor.ID === this.props.selectedPrecursor_id? "clicked" : ""}`} onClick = {e => this.precursorClicked(e, precursor)}>{precursor.PRECURSOR}</div>
							)}
					</div>
					<div className="precursorPanel-wrapper row">
						<div className="col-8 col-md-8">
							<label>Cites</label>
							<input id="precursor" type="text"/>
						</div>
						<div className="col-4 col-md-4">
							<button className="btn btn-primary"onClick={e => this.props.precursorAction(e,"add")}>Add</button>
							<div className="hidden-btns inline-b display-none">
								<button className="btn btn-info" onClick={e => this.props.precursorAction(e,"update")}>Update</button>
								<button className="btn btn-warning" onClick = {e => this.props.precursorAction(e, "delete")}>Delete</button>
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
