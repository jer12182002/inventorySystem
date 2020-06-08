import React from 'react';
import './home.scss';
import Moment from 'moment';
import $ from 'jquery';


export default class home extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			accountInfo: this.props.accountInfo,
			announcements:[]
		}
	}


	loadAnnouncement() {
		fetch(`${process.env.REACT_APP_INVENTROY_API}/home/loadallannouncements`)
		.then(res=>res.json())
		.then(data =>{
			if(data.data){
				this.setState({announcements: data.data});
			}
		});
	}


	componentDidMount(){
		this.loadAnnouncement();
	}


	btnAddNewAnnouncement(e) {
		e.preventDefault();
		let announcementInfo = {
			ANNOUNCEMENT : $('#announcementManagerInput').val(),
			PERSON : this.state.accountInfo.USERNAME
		} 

		fetch(`${process.env.REACT_APP_INVENTROY_API}/home/addannouncements?announcementInfo=${JSON.stringify(announcementInfo)}`)
		.then(res => res.json())
		.then(data=> {
			if(data.data && data.data === 'success') {
				window.location.reload();
			}
		})
	} 

	btnModifyActions(e,action,id) {
		e.preventDefault();
	
		let announcementInfo = {
			ID : id,
			ANNOUNCEMENT : $(`#announcement-${id}`).val(),
			PERSON : this.state.accountInfo.USERNAME, 
			ACTION: action
		} 
		
		fetch(`${process.env.REACT_APP_INVENTROY_API}/home/modifyannouncements?announcementInfo=${JSON.stringify(announcementInfo)}`)
		.then(res => res.json())
		.then(data=> {
			if(data.data && data.data === 'success') {
				window.location.reload();
			}
		})

	}


	

	render() {
		return (
			<div className="home-wrapper">
			{this.state.accountInfo.USERNAME?
				<>
				<h1>Announcement</h1>
				
				{this.state.announcements.map((announcement, key)=>
					this.state.accountInfo.ACCESS_LEVEL < 3 && this.state.accountInfo.USERNAME === announcement.PERSON?
						
						<div className="accouncement-field" key={`announcement${key}`}>
							<p className="announcementInfo">Time: {Moment(announcement.TIME).format('YYYY-MM-DD')}By.{announcement.PERSON}</p>
							<textarea id={`announcement-${announcement.ID}`} className="announceDisplay-manager" defaultValue={announcement.ANNOUNCEMENT}/>
		
							<div className="btnsContainer">
								<button onClick={e=>this.btnModifyActions(e, 'update',announcement.ID)} className="btn btn-warning">Update</button>
								<button onClick={e=>this.btnModifyActions(e, 'delete',announcement.ID)} className="btn btn-danger">Delete</button>
							</div>
						</div>				
						:
						<div className="accouncement-field" key={`announcement${key}`}>
							<p className="announcementInfo">Time: {Moment(announcement.TIME).format('YYYY-MM-DD')}    By.{announcement.PERSON}</p>
							<textarea readonly="readonly" className="announceDisplay">{announcement.ANNOUNCEMENT}</textarea>
						</div>
					)}
				{this.state.accountInfo.ACCESS_LEVEL<3?
	
					<div className="announcementPush-field">
						<textarea id="announcementManagerInput"/>
						<div className="btnsContainer">
							<button onClick={e=>this.btnAddNewAnnouncement(e)} className="btn btn-success">Add</button>
						</div>
					</div>
					:
					null
				}
				</>
			:null
			}
			</div>

		);
	}
}
