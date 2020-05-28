import React from 'react';
import './addItem.scss';
export default class addItem extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="addItem-wrapper controlPanel-functions">
				<div className="main-function"></div>
				<div className="action-area">
					<button>Add Item</button>
				</div>
			</div>
		);
	}
}
