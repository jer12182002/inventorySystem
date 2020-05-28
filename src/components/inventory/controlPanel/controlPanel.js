import React from 'react';
import './controlPanel.scss';

import AddItem from './addItem/addItem';
import EditItem from './editItem/editItem';
import Filter from './filter/filter';
import HoldItem from './holdItem/holdItem';

export default class controlPanel extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		// This is just a container to hold different functions

		return (
			<div className="controlPanel-wrapper">
				<AddItem/>
				<EditItem/>
				<HoldItem/>
				<Filter/>
			</div>
		);
	}
}
