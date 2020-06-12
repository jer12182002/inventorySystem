import React from 'react';
import './filter.scss';
import Moment from 'moment';
import $ from 'jquery';

export default class filter extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loggedUser : this.props.loggedUser,
			defaultAllItems:[], // all inventory items
			selectItems: [],    // all items which have been filtered
			checkedId:[],		// saved items in whole scope
			checkAllToggle:false, 
			allHistoryItems: [], 
			allHistoryItemsDisplay:[]
		}
	}

	componentWillReceiveProps(newProps) {
		if(this.state.allHistoryItems !== newProps.allHistoryItems) {
			this.setState ({allHistoryItems: newProps.allHistoryItems});
		}
	}

	componentDidMount() {
		this.loadAllItem('',true);
	}


	loadAllItem(receviedFilter='',defaultCall=false){
		fetch(`${process.env.REACT_APP_INVENTROY_API}/inventory/loadAllItem?filter=${receviedFilter}`)
		.then(res => res.json())
		.then(data =>{
			if(data) {
				if(defaultCall) {
					this.setState({defaultAllItems:data.data});
				}

				data.data.forEach(item=>{
					if(this.state.checkedId.includes(item.ID)){
							item.checked = true;
					}
				});

				this.setState({selectItems: data.data});
			}
		});
	}




	filterItemOnChange(){
		let inputVal = $.trim($("#itemFilter").val().toUpperCase());
		let allHistoryItemsDisplay = [];
		allHistoryItemsDisplay = this.state.allHistoryItems.filter(
			item => (item.ENGLISH_NAME + item.CHINESE_NAME + item.TYPE + Moment(item.EXPIRE_DATE).format('YYYY-MM-DD') + item.MANUFACTURE).toUpperCase().includes(inputVal));
		
		this.loadAllItem(inputVal);
		this.setState({allHistoryItemsDisplay: allHistoryItemsDisplay});
		this.setState({checkAllToggle: false}); 
	}


	filterBtn(e){
		e.preventDefault();
		if($("#filterBtn").text()==="Filter"){
			$("#itemFilter").removeClass("display-none");
			$("#itemFilter").focus();
			$(".selectfilter-container").removeClass("display-none");
			$("#filterBtn").text("Close");
		}else {
			$("#itemFilter").addClass("display-none");
			$(".selectfilter-container").addClass("display-none");
			$("#filterBtn").text("Filter");
			$("#showBtn").addClass("display-none");
			window.location.reload();
		}
	}

	hideBtn(e) {
		e.preventDefault();
		$("#showBtn").removeClass("display-none");
		$(".selectfilter-container").addClass("display-none");
	}


	showBtn(e) {
		e.preventDefault();
		$(".selectfilter-container").removeClass("display-none");
		$("#showBtn").addClass("display-none");	
	}




	selectCheckBox(e,id){
		e.stopPropagation();
	 	
	 	let checkedItems = [];
	 	let selectItems = this.state.selectItems;
	 	let checkedId = this.state.checkedId;

	 	let index = checkedId.indexOf(id);
	 	if(index !== -1) {
			checkedId.splice(index,1);
		}else {
			checkedId.push(id);
		}

		this.state.defaultAllItems.forEach(item=>{
			if(checkedId.includes(item.ID)){
				checkedItems.push(item);
			}
		})

		selectItems.forEach(item=>{
			item.checked = false;
			if(checkedId.includes(item.ID)){
				item.checked = true;
			}	
		})

		this.setState({checkedId: checkedId});
		this.setState({selectItems: selectItems});
		this.props.filterAllItemsFromChild(checkedItems);
	}	




	checkAllFilter(e) {
		e.stopPropagation();
		let allItems = this.state.defaultAllItems;
		let checkedId = this.state.checkedId;
		let selectItems = this.state.selectItems;
		let checkedItems = [];

		this.setState({checkAllToggle: !this.state.checkAllToggle});

		if(!this.state.checkAllToggle) {   //toggle does not contains filter elements
			selectItems.forEach(item=>{
				item.checked = true;
				checkedId.push(item.ID);
			})
		}else {							  //toggle contains filter elements
			selectItems.forEach(item=>{
				item.checked = false;
				let index = checkedId.indexOf(item.ID);
				if(index !== -1) {
					checkedId.splice(index,1);
				}
			})
		}

		checkedId = checkedId.filter((v,i)=>checkedId.indexOf(v) === i);  // delete the duplicate

		this.state.defaultAllItems.forEach(item => {
			if(checkedId.includes(item.ID)) {
				checkedItems.push(item);
			}
		})
	 	
	 	this.setState({checkedId: checkedId});
	 	this.setState({selectItems: selectItems});
	 	this.props.filterAllItemsFromChild(checkedItems);
		
	}

	render() {
		return (
			<div className = "filter-wrapper">
				<div className="selectfilter-container block display-none" >
					
					<div className="selectAll">
						<h3 className={`${this.state.checkAllToggle?"checkAll":""} inline-b`} onClick={e=>this.checkAllFilter(e)}>Select All</h3>
						<button id="hideBtn" type="button" onClick={e=>this.hideBtn(e)}>Hide</button>
					</div>
						
					<ul className="scroll-container">
						{this.state.selectItems.map((item,key)=>
							<li key={`${key}${item.ID}`} className={`${item.checked && item.checked === true? "checked":""}`} onClick={e=>this.selectCheckBox(e,item.ID)}>
								<p className="inline-b">{item.ENGLISH_NAME}-{item.CHINESE_NAME}<br/>
								{this.state.loggedUser.EXP_VIEW?<strong>{item.EXPIRE_DATE}-</strong>: null}
								<strong>{item.MANUFACTURE}</strong></p>
							</li>					
						)}
						{this.state.allHistoryItemsDisplay.map((item,key)=>
							<li key={`historyItem${key}`} className="historyItem">
								<p className="inline-b">{item.ENGLISH_NAME}-{item.CHINESE_NAME}<br/>
								{this.state.loggedUser.EXP_VIEW?<strong>{Moment(item.EXPIRE_DATE).format('YYYY-MM-DD')}-</strong>: null}
								<strong>{item.MANUFACTURE}</strong></p>
							</li>

						)}						
					</ul>
				</div>
				
				<div className="action-area">
					<div className="inline-f filter-Section">
						<input id="itemFilter" type="text" className="display-none" onChange= {e=>this.filterItemOnChange(e)}/>
						<button id="showBtn" type="button" className="display-none" onClick={e=>this.showBtn(e)}>Show</button>
						<button id="filterBtn" type="button" className="btn btn-warning" onClick={e=>this.filterBtn(e)}>Filter</button>
					</div>
				</div>
			</div>
		);
	}
}
