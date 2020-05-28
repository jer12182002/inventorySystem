import React from 'react';
import './holdItem.scss';

export default class holdItem extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className = "holdItem-wrapper controlPanel-functions display-none">
				<div className="main-function"></div>
				<div className="action-area">
					<button>Hold Item</button>
				</div>
			</div>
		);
	}
}
