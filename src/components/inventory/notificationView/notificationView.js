import React from 'react';

export default class notificationView extends React.Component {


	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className = "notificationview-wrapper">Notification
				<div className="header-section"></div>
				
				<div className="main-section">
					in this notificaiton, there are some tasks need to be done.
					1. display about expiry product info
				</div>
			</div>

		);
	}
}
