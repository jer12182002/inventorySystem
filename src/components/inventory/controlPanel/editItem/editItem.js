import React from 'react';
import './editItem.scss';
export default class editItem extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="editItem-wrapper controlPanel-functions">
				<div className="main-function"></div>
				<div className="action-area">
					<button>Edit Item</button>
				</div>
			</div>
		);
	}
}
