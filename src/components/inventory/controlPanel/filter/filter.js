import React from 'react';
import './filter.scss';

import $ from 'jquery';
export default class filter extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loggedUser : this.props.loggedUser,
			selectItems: [],
			checkedId:[]
		}

	}

	componentDidMount() {
		this.loadAllItem('',true);
	}


	loadAllItem(receviedFilter='',defaultCall=false){
		fetch(`http://localhost:4000/inventory/loadAllItem?filter=${receviedFilter}`)
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

				this.setState({selectItems: data.data}, console.log(this.state.selectItems));
			}
		});
	}




	filterItemOnChange(){
		this.loadAllItem($.trim($("#itemFilter").val().toUpperCase()));
	}


	filterBtn(){
		if($("#filterBtn").text()==="Filter"){
			$("#itemFilter").removeClass("display-none");
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

	 	let checkedIdArray = this.state.checkedId;
	 	let checkedItems = [];

	    if($(`#checkbox${id}`).prop("checked")){
	     		checkedIdArray.push(id);   // push in anyway, then delete the duplicate later
	    }else {
	    	checkedIdArray = checkedIdArray.filter(ele => {
	    		return ele !== id;
	    	});
	    }

	    checkedIdArray = checkedIdArray.filter((v,i)=>checkedIdArray.indexOf(v)===i);  // delete the duplicate

	   
	    this.state.defaultAllItems.forEach(item=>{

	    	if(checkedIdArray.includes(item.ID)){
	    		checkedItems.push(item);
	    	}
	    });

		this.setState({checkedId:checkedIdArray});
		console.log(checkedItems);
		this.props.filterAllItemsFromChild(checkedItems);
	}	



	render() {
		return (
			<div className = "filter-wrapper">
				<div className="selectfilter-container block display-none" >
					
					<div className="selectAll">
						<h3 className="inline-b">CheckItem</h3>
						<button id="hideBtn" type="button" onClick={e=>this.hideBtn(e)}>Hide</button>
					</div>
						
					<ul className="scroll-container">
						{this.state.selectItems.map((item,key)=>
							<li key={`${key}${item.ID}`}>
								<input key={`${key}${item.ID}`} id={`checkbox${item.ID}`} className="checkBoxDisplay inline-b" type="checkbox" defaultChecked={item.checked} onChange={e=>this.selectCheckBox(e,item.ID)}/>	
								<p className="inline-b">{item.ENGLISH_NAME}-{item.CHINESE_NAME}<br/>
								{this.state.loggedUser.EXP_VIEW?<strong>{item.EXPIRE_DATE}-</strong>: null}
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
