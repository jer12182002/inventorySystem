import React from 'react';
import $ from 'jquery';
import Moment from 'moment';
import {CSVReader} from 'react-papaparse';
export default class bulkItemImporter extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loggedUser: [],
			types: []
		}
	}

	componentWillReceiveProps(newProps) {
	  if (this.state.types !== newProps.types) {
	    this.setState({loggedUser: newProps.loggedUser, types: newProps.types});
	  }
	}

// 	processFile (path){
// 		// let csvFilePath = require(path);
// 		// let Papa = require("papaparse/papaparse.min.js");
// 		// Papa.parse(csvFilePath, {
// 		// 	header:true,
// 		// 	skipEmptyLine:true,
// 		// 	complete: (result)=>{
// 		// 		console.log(result.data);
// 		// 	}
// 		// })
// 		const fs = require('fs');
// 		const file = fs.createReadStream(path);
// 		const papa = require('papaparse');
// 		var count = 0;
// 		papa.parse(file, {
//     worker: true, // Don't bog down the main thread if its a big file
//     step: function(result) {
//         // do stuff with result
//     },
//     complete: function(results, file) {
//         console.log('parsing complete read', count, 'records.'); 
//     }
// });

// 	}

// 	fileUploaded(e){
// 		e.preventDefault();
// 		console.log($('#fileUpload').val());
// 		if($('#fileUpload').val().includes('.csv')) {
// 			this.processFile($('#fileUpload').val());
// 		}else {
// 			alert("File type is not supported, please upload CSV file only");
// 		}
// 	}


  handleOnDrop = (data) => {
  	let bulkItems = [];
    console.log(this.state.types);
    console.log(data);
	 
    for (let i = 1; i < data.length;i++) {
    	let passCheck = true;
    	let types = this.state.types;
  
    	data[i].data.forEach(itemAttr=>{  
    		if($.trim(itemAttr.toString().replace(/[\u4e00-\u9fa5]/g,'a').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '')) === "" ) {
    			passCheck = false;
    			console.log("empty or sepcial words chk fails");
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
    		let dateFormat = new Date(new Date($.trim(data[i].data[6].toString().match(/^[0-9]{4}[\-+.~_/][0-9]{2}[\-+.~_/][0-9]{2}$/g))));
    		dateFormat.setDate(dateFormat.getDate()+1);

    		let item = {
    			TYPE: $.trim(data[i].data[0].toString().replace(/[^a-z]/gi,'')).replace(/^[a-z]/g,c => c.toUpperCase()),
    			SHELF_NO: $.trim(data[i].data[1].toString().replace(/[^a-z0-9]/gi,'')).toUpperCase(),
    			MANUFACTURER: $.trim(data[i].data[2].toString().replace(/[^a-z0-9]/gi,'')).toUpperCase(),
    			ENGLISH_NAME: $.trim(data[i].data[3].toString().replace(/[^a-z0-9 ]/gi,'').toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => ' '+ chr.toUpperCase())).replace(/^[a-z]/g,c => c.toUpperCase()),
    			CHINESE_NAME: $.trim(data[i].data[4].toString().split("").filter(char => /\p{Script=Han}/u.test(char)).join("")),
    			QTY: parseInt(data[i].data[5]),
    			EXPIRY_DATE: Moment(dateFormat).format('YYYY-MM-DD'),
    			GRAM: parseInt(data[i].data[7]),
    			AUTHOR: this.state.loggedUser.USERNAME

    		}
    		bulkItems.push(item);
    		console.log(bulkItems);
    	}
    }
    if(bulkItems.length > 0) {
    	fetch(`http://localhost:4000/inventory/addbulkItems?bulkItems=${JSON.stringify(bulkItems)}`)
    	.then(res=>res.json())
    	.then(data => {
    		console.log(data);
    	})
    }
  }



  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleOnRemoveFile = (data) => {
    console.log('---------------------------')
    console.log(data)
    console.log('---------------------------')
  }

	render() {
				//<input id="fileUpload" type="file" accept=".csv" onChange={e=>this.fileUploaded(e,this)}></input>
		return (
			<div className="bulkItemImporter-wrapper inline-b">
				<CSVReader
			        onDrop={this.handleOnDrop}
			        onError={this.handleOnError}
			        noDrag
			        addRemoveButton
			        onRemoveFile={this.handleOnRemoveFile}
			      >
			        <span>Click to upload.</span>
	      		</CSVReader>
			</div>
		);
	}
}
