import './header.scss';
import React from 'react';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

class header extends React.Component {

	logoutClick = ()=>{
		cookies.remove('user');
	}


	render() {
		return (
			<div className="header-wrapper">
				<header>

					<h1><a href="/">Ren De Inc Inventory System</a></h1>

					{this.props.accountInfo.USERNAME?
						(<ul>
							<li><a href="/login/account">{this.props.accountInfo.USERNAME}</a></li>
							<li><a href="/" id="logout-btn" onClick = {this.logoutClick}>Log Out</a></li>
							<li><a href="/inventory">Inventory</a></li>
							<li><a href="/checkout">Checkout</a></li>
						</ul>)
						:
						(<ul>
							<li><a id="headerUserLink"href="/login">Log In</a></li>
						</ul>)
					}
				</header>

				
			</div>
		);
	}
}

export default header;
