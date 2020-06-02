import React from 'react';
import './bulkItemImporter.scss';
import $ from 'jquery';
import Moment from 'moment';
import {CSVReader} from 'react-papaparse';
export default class bulkItemImporter extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loggedUser: [],
			types: [], 
			bulkItems: []
		}
	}

	componentWillReceiveProps(newProps) {
	  if (this.state.types !== newProps.types) {
	    this.setState({loggedUser: newProps.loggedUser, types: newProps.types});
	  }
	}



  handleOnDrop = (data) => {
  	let bulkItems = [];
	 
    for (let i = 1; i < data.length;i++) {
    	let passCheck = true;
    	let types = this.state.types;
  
    	data[i].data.forEach(itemAttr=>{  
    		if($.trim(itemAttr.toString().replace(/[\u4e00-\u9fa5]/g,'a').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '')) === "" ) {
    			passCheck = false;
    		}
    	})

    	if(passCheck) {
	    	if(data[i].data.length !== 8) {
	    		passCheck = false;
	    		console.log("length chk fails");
	    	}
    	}
    	
    	if(passCheck) {
	    	if(!types.find(t => t.ITEM_TYPE.toString().toUpperCase() === data[i].data[0].toString().toUpperCase())) {
	    		passCheck = false;
	    		console.log("type chk fails");
	    	}
    	}


    	if(passCheck) {
	    	if(isNaN(data[i].data[5]) || isNaN(data[i].data[7])) {
	    		passCheck = false;
	    		console.log("qty chk fails");
	    	}
    	}

    	if(passCheck) {
    		if(data[i].data[6].toString().match(/^[0-9]{4}[\-+.~_/][0-9]{2}[\-+.~_/][0-9]{2}$/g)){
			}else　{
				passCheck = false;
				console.log("date format chk fails");
			}
    	}


    	if(passCheck) {
    		let item = {
    			TYPE: $.trim(data[i].data[0].toString().replace(/[^a-z]/gi,'')).replace(/^[a-z]/g,c => c.toUpperCase()),
    			SHELF_NO: $.trim(data[i].data[1].toString().replace(/[^a-z0-9]/gi,'')).toUpperCase(),
    			MANUFACTURER: $.trim(data[i].data[2].toString().replace(/[^a-z0-9]/gi,'')).toUpperCase(),
    			ENGLISH_NAME: $.trim(data[i].data[3].toString().toLowerCase().replace(/\s\s/g, '').replace(/[^a-zA-Z0-9-]+(.)/g, (m, chr) => ' '+ chr.toUpperCase())).replace(/^[a-z]/g,c => c.toUpperCase()),
    			CHINESE_NAME: $.trim(data[i].data[4].toString().split("").filter(char => /\p{Script=Han}/u.test(char)).join("")),
    			QTY: parseInt(data[i].data[5]),
    			EXPIRY_DATE: Moment(new Date($.trim(data[i].data[6].toString().match(/^[0-9]{4}[\-+.~_/][0-9]{2}[\-+.~_/][0-9]{2}$/g)))).format('YYYY-MM-DD'),
    			GRAM: parseInt(data[i].data[7]),
    			AUTHOR: this.state.loggedUser.USERNAME

    		}
    		bulkItems.push(item);
    	}
    }
    console.log(bulkItems);
    if(bulkItems.length > 0) {
    //	fetch(`http://localhost:4000/inventory/addbulkItemsRepo?bulkItems=${JSON.stringify(bulkItems)}`)
    fetch(`http://localhost:4000/inventory/addbulkItemsRepo`,
    	{	method:'POST',  
    		headers: {
    		    'Content-Type': 'application/json'
    		},
    		body: JSON.stringify({
    			bulkItems: bulkItems
    		})
    	})
    	.then(res=>res.json())
    	.then(data => {
    		if(data.data) {
    			this.setState({bulkItems: data.data});
    			$('.bulkItemImporter-wrapper .result-container').removeClass('display-none');
    		}else {
    			alert("OOps! Something went wrong...");
    		}
    	})
    }else {
    	alert("There are something wrong in your data. Please check");
    }
  }



  bulkImportClick(e) {
  	e.preventDefault();
  	fetch(`http://localhost:4000/inventory/addbulkItems?readyToImport=${JSON.stringify(true)}`)
  	.then(res => res.json())
  	.then(data => {
  		if(data.data && data.data === 'success') {
  			alert("Bulkitems are successfully Imported!");
  		}else {
  			alert("Something went wrong!, Please try again");
  		}
  		window.location.reload();
  	})
  }



  closeBulkItemsContainer(e) {
  	e.preventDefault();
  	$('.bulkItemImporter-wrapper .result-container').addClass('display-none'); 	
  		
  }


  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }





	render() {
		return (
			<div className="bulkItemImporter-wrapper inline-b">
				<CSVReader
			        onDrop={this.handleOnDrop}
			        onError={this.handleOnError}
			        noDrag
			        addRemoveButton
			        
			      >
			        <span>BulkAdd</span>
	      		</CSVReader>

	      		<div className="result-container display-none">
	      			<button type="button" className="close-btn" aria-label="Close"  onClick={e=>this.closeBulkItemsContainer(e)}><span aria-hidden="true">&times;</span></button>
	      			{this.state.bulkItems.length > 0 ?
	      			<div className="item-info">
	      			<h1><span>{this.state.bulkItems.length}</span> Items are ready to be imported!</h1>
		      			<table>
		      				<thead>
		      					<tr>
		      						<td>Index</td>
		      						<td className="text-left">Name</td>
		      						<td className="text-left">商品名稱</td>
		      						<td>Type</td>
		      						<td>Shelf No</td>
		      						<td>Manu.</td>
		      						<td>Qty</td>
		      						<td>Exp</td>
		      						<td>Gram</td>
		      					</tr>
		      				</thead>
		      				<tbody>
		      					{this.state.bulkItems.map((item,key)=>
		      						<tr key={`bulkItem${key+1}`}>
		      							<td>{key+1}</td>
			      						<td className="text-left">{item.ENGLISH_NAME}</td>
			      						<td className="text-left">{item.CHINESE_NAME}</td>
			      						<td>{item.TYPE}</td>
			      						<td>{item.SHELF_NO}</td>
			      						<td>{item.MANUFACTURE}</td>
			      						<td>{item.QTY}</td>
			      						<td>{Moment(item.EXPIRE_DATE).format('YYYY-MM-DD')}</td>
			      						<td>{item.GRAM}</td>
		      						</tr>
		      					)}
		      				</tbody>
		      				
		      			</table>
		      			<div className="btns-container">
		      				<button className="btn btn-success" onClick={e=>this.bulkImportClick(e)}>Import</button>
		      				<button className="btn btn-warning" onClick={e=>this.closeBulkItemsContainer(e)}>Cancel</button>
		      			</div>
	      			</div>
	      			:
	      			<h1>No items have been imported, please check your data format</h1>
	      		}
	      		</div>
			</div>
		);
	}
}

