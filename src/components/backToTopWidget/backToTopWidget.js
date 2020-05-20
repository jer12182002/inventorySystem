import React from 'react';
import $ from 'jquery';

import './backToTopWidget.scss';
export default class backToTopWidget extends React.Component {

	componentDidMount() {
		$(window).scroll(function() {
			if($(window).scrollTop() > 250) { // in pixels
				$('#goBackToTop').fadeIn(800); // 800 milliseconds for the fade in effect
				}
			else {
				$('#goBackToTop').fadeOut('fast'); // 200 milliseconds for the fade out effect
				}
		});
	}


	clickToTop(e) {
		$('body,html').animate({scrollTop: 0});
	}


	render() {
		return (
			<div className="backToTopWidget-wrapper">
				 <div id="goBackToTop" onClick={e => this.clickToTop(e)}></div>
			</div>
		);
	}
}
