import React from 'react';
import './filter.scss';

export default class filter extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className = "filter-wrapper controlPanel-functions display-none">
				<div className="main-function"></div>
				<div className="action-area">
					<button>Filter</button>
				</div>
			</div>
		);
	}
}
