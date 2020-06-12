const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require ('mysql');
const moment = require('moment');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password:'',
	database:'inventorysystem',
	multipleStatements: true
});


var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
  /*var err = new Error('Not Found');
   err.status = 404;
   next(err);*/

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Pass to next layer of middleware
  next();
});

connection.connect();

//****************************Account*************************************
app.get('/chcekPermission',(req,res)=>{
	var userId = req.query.id;
	const sqlQuery = `SELECT * FROM account_list where ID = ${userId}`;
	
	connection.query(sqlQuery,(err,result)=>{
		if(err) {
			res.send(err);
		}else {
			return res.json({data:result});
		}
	});
});


app.get('/login',(req,res)=>{
	const {account, password } = req.query;
	var sqlQuery = `SELECT * FROM ACCOUNT_LIST WHERE ACCOUNT = '${account}' AND PASSWORD = '${password}'`;

	console.log("login");
	connection.query(sqlQuery,(err, result) =>{
		if(err){
			res.send(err);
		}else {
			return res.json({data:result})
		}
	});
});


app.get('/login/account',(req,res)=>{
	var sqlQuery = `SELECT * FROM account_list where ID != 1`;

	console.log("Get information for all users except IT");
	connection.query(sqlQuery,(err,result) => {
		if(err){
			res.send(err);
		}else {
			return res.json({data:result});
		}
	});

});


app.get('/login/account/register',(req,res) =>{	
	let newUserInfo = JSON.parse(req.query.newUserInfo);
	let sqlQuery = `INSERT INTO account_list(USERNAME, ACCOUNT, PASSWORD, CREATEDBY) VALUES ('${newUserInfo.username}', '${newUserInfo.account}', '${newUserInfo.password}', '${newUserInfo.createdBy}');`;
	
	console.log("register");
	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return res.json({data:result})
		}
	});
});


app.get('/login/account/resetpassword',(req,res)=>{
	let userPwdInfo = JSON.parse(req.query.newUserInfo);
	var sqlQuery = `UPDATE account_list set PASSWORD = '${userPwdInfo.newPassword}' where ID = ${userPwdInfo.id}`;
	
	console.log("Reset password");
	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}
		else{
			return res.json({data:'success'});
		}
	});

});

app.get('/login/account/displayActivities',(req,res)=> {
	let sqlQueries = 'SELECT * FROM inventory_activity_logs ORDER BY TIME DESC;';
	    sqlQueries+= 'SELECT * FROM chk_pickup_activity_logs ORDER BY TIME DESC;';

	console.log("Get all activities");
	connection.query(sqlQueries,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return res.json(
				{
					inventoryLog: result[0],
					chk_pickupLog: result[1]
				}
			)
		}
	});
});




app.get('/login/account/displayUsers',(req,res) =>{
	var sqlQuery = `SELECT * FROM account_list where ID = ${req.query.id}`;
	
	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}
		else {
			return res.json({data: result})
		}
	});
})


app.get('/login/account/saveUpdatedUser',(req,res)=>{
	let userInfo = JSON.parse(req.query.userInfo);
	
	var sqlQuery = `UPDATE account_list set ACCESS_LEVEL = ${userInfo.ACCESS_LEVEL}, VIEW_ITEM = ${userInfo.VIEW_ITEM}, ADD_ITEM = ${userInfo.ADD_ITEM}, DELETE_ITEM = ${userInfo.DELETE_ITEM}, NAME_MODIFY=${userInfo.NAME_MODIFY}, QTY_VIEW = ${userInfo.QTY_VIEW}, QTY_MODIFY = ${userInfo.QTY_MODIFY}, TYPE_VIEW = ${userInfo.TYPE_VIEW}, TYPE_MODIFY = ${userInfo.TYPE_MODIFY}, SHELF_MODIFY = ${userInfo.SHELF_MODIFY}, GRAM_VIEW = ${userInfo.GRAM_VIEW}, GRAM_MODIFY = ${userInfo.GRAM_MODIFY}, EXP_VIEW = ${userInfo.EXP_VIEW}, EXP_MODIFY = ${userInfo.EXP_MODIFY}, TAG_VIEW = ${userInfo.TAG_VIEW}, TAG_MODIFY = ${userInfo.TAG_MODIFY}, CHK_VIEW = ${userInfo.CHK_VIEW}, CHK_MODIFY = ${userInfo.CHK_MODIFY}, PICKUP_VIEW = ${userInfo.PICKUP_VIEW}, PICKUP_RESPOND = ${userInfo.PICKUP_RESPOND} where ID = ${userInfo.ID}`;
	
	console.log("Change user permission");

	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return (res.json({data: 'success'}));
		}
	});
});

//*******************************************************************************************




//****************************Announcement***************************************************

app.get('/home/loadallannouncements',(req,res)=>{
	let sqlQuery = 'SELECT * FROM announcements ORDER BY TIME DESC';

	console.log("Load all announcements");
	connection.query(sqlQuery,(err,result)=>{
		if(err) {
			res.send(err);
		}else {
			return res.json({data:result});
		}
	})
})


app.get('/home/addannouncements',(req,res)=>{
	let announcementInfo = JSON.parse(req.query.announcementInfo);
	
	let sqlQuery = `INSERT INTO announcements (ANNOUNCEMENT, PERSON) VALUES('${announcementInfo.ANNOUNCEMENT}', '${announcementInfo.PERSON}');`;

	console.log("Add new announcement");
	connection.query(sqlQuery,(err,result)=>{
		if(err) {
			res.send(err);
		}else {
			return res.json({data:'success'});
		}
	})
})



app.get('/home/modifyannouncements',(req,res)=>{
	let announcementInfo = JSON.parse(req.query.announcementInfo);
	
	let sqlQuery = '';

	console.log("Delete or Modify announcement");
	if(announcementInfo.ACTION === 'update') {
		sqlQuery = `UPDATE announcements SET ANNOUNCEMENT = '${announcementInfo.ANNOUNCEMENT}', TIME = SYSDATE() WHERE ID = ${announcementInfo.ID};`;
	}else if(announcementInfo.ACTION === 'delete') {
		sqlQuery = `DELETE FROM announcements WHERE ID = ${announcementInfo.ID};`;
	}
 
	connection.query(sqlQuery,(err,result)=>{
		if(err) {
			res.send(err);
		}else {
			return res.json({data:'success'});
		}
	})
})


//*******************************************************************************************







//****************************Inventroy******************************************************
app.get('/inventory/actionbeforloadallitem',(req,res)=>{
	let sqlQueries = '';
	sqlQueries += 'UPDATE item_list AS I, (SELECT ITEM_ID, HOLD_QTY FROM `hold_item_list` WHERE DATE < CURRENT_DATE() AND DATE != "0000-00-0") AS H SET I.HOLD_QTY = I.HOLD_QTY - H.HOLD_QTY WHERE I.ID = H.ITEM_ID;';
	sqlQueries += 'INSERT INTO history_item_list SELECT * FROM item_list where QTY = 0;';
	sqlQueries += 'DELETE H1 FROM history_item_list H1, history_item_list H2 WHERE h1.EXPIRE_DATE < h2.EXPIRE_DATE AND h1.ENGLISH_NAME = h2.ENGLISH_NAME;';
	sqlQueries += 'DELETE FROM hold_item_list WHERE DATE < CURRENT_DATE AND DATE != "0000-00-00";';
	sqlQueries += 'DELETE FROM item_list WHERE QTY <= 0;';

	console.log("Check if there is any expired on hold items or 0 qty item in inventory");
	
	connection.query(sqlQueries,(err, result)=> {
		if(err) {
			res.send(err);
		}else {
			return (res.json({data: 'success'}));
		}
	})
})


app.get('/inventory/loadSelect',(req,res)=>{

	var sqlQuery = 'SELECT ITEM_TYPE FROM item_list_type_list';
	console.log('Load all Type');
	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return res.json({data: result});
		}
	});
});



app.get('/inventory/addNewItem',(req,res)=>{
	let newItem = JSON.parse(req.query.newItem);

	let sqlQueries = `INSERT INTO item_list(TYPE, SHELF_NO,MANUFACTURE,ENGLISH_NAME,CHINESE_NAME, QTY,EXPIRE_DATE,GRAM,CREATED_BY,LAST_MODIFIED_BY) VALUES ('${newItem.type}', '${newItem.shelfNo}', '${newItem.manufacturer}', '${newItem.ENname}','${newItem.CHname}', '${newItem.qty}', '${newItem.exp}','${newItem.gram}', '${newItem.createdBy}', '${newItem.createdBy}');`;

	let actionDetails = `${newItem.ENname} ${newItem.CHname} Type: ${newItem.type}, Shelf No: ${newItem.shelfNo}, Manu.: ${newItem.manufacturer}, QTY: ${newItem.qty}, Exp.: ${newItem.exp}, Gram: ${newItem.gram}`;
		sqlQueries += `INSERT INTO inventory_activity_logs (PERSON, ACTION, DETAIL) VALUES ('${newItem.createdBy}','Add New Item' ,'${actionDetails}');`;

	console.log("Add new Item");
	connection.query(sqlQueries,(err,result)=>{
		if(err){
			console.log(err);
			res.send(err);
		}else {
			return (res.json({data: 'success'}));
		}
	});
});



app.post('/inventory/addbulkItemsRepo',(req,res)=>{
	console.log("Add items into bulkItemRepo");

	let bulkItems = req.body.bulkItems;
	
	let sqlQueries = '';
		sqlQueries += 'DELETE FROM bulk_item_list_repository;';
	bulkItems.forEach(item=>{
		sqlQueries += `INSERT INTO bulk_item_list_repository (TYPE, SHELF_NO ,MANUFACTURE,ENGLISH_NAME,CHINESE_NAME, QTY,EXPIRE_DATE,GRAM,CREATED_BY,LAST_MODIFIED_BY) VALUES ('${item.TYPE}', '${item.SHELF_NO}', '${item.MANUFACTURER}', '${item.ENGLISH_NAME}', '${item.CHINESE_NAME}','${item.QTY}', '${item.EXPIRY_DATE}', '${item.GRAM}', '${item.AUTHOR}', '${item.AUTHOR}');`;
		let actionDetails = `${item.ENGLISH_NAME} ${item.CHINESE_NAME} Type: ${item.TYPE}, Shelf No: ${item.SHELF_NO}, Manu.: ${item.MANUFACTURER}, QTY: ${item.QTY}, Exp.: ${item.EXPIRY_DATE}, Gram: ${item.GRAM}`;	
			
	})
	
	connection.query(sqlQueries, (err,result)=>{
		if(err) {
			res.send(err);
		}else {
			sqlQueries = 'SELECT * FROM bulk_item_list_repository;';
			connection.query(sqlQueries, (err2, result2)=>{
				if(err2) {
					res.send(err2);
				}else {
					return res.json({data:result2});
				}
			})
		}
	});
})


app.get('/inventory/addbulkItems',(req,res)=>{
	console.log("Inert all bulkItems from repo to item_list");

	let readyToImport = JSON.parse(req.query.readyToImport);
	
	let sqlQueries = '';
	if(readyToImport) {
		sqlQueries = 'INSERT INTO item_list( TYPE, SHELF_NO, MANUFACTURE, ENGLISH_NAME, CHINESE_NAME, QTY, EXPIRE_DATE, GRAM, CREATED_BY, LAST_MODIFIED_BY) SELECT TYPE, SHELF_NO, MANUFACTURE, ENGLISH_NAME, CHINESE_NAME, QTY, EXPIRE_DATE, GRAM, CREATED_BY, LAST_MODIFIED_BY FROM bulk_item_list_repository;';
		sqlQueries+= 'INSERT INTO inventory_activity_logs (PERSON, ACTION, DETAIL) SELECT CREATED_BY, "Add BulkItems", CONCAT(ENGLISH_NAME," ",CHINESE_NAME," Type: ",TYPE,", Shelf No: ",SHELF_NO," ,Mfr: ", MANUFACTURE, ", QTY: ",QTY,", Exp: ", EXPIRE_DATE, ", Gram: ",GRAM) FROM bulk_item_list_repository;';	
		
	}

	sqlQueries+= 'DELETE FROM bulk_item_list_repository;';

	connection.query(sqlQueries, (err, result)=> {
		if(err) {
			res.send(err);
		}else {
			return res.json({data: 'success'});
		}
	})

})



app.get('/inventory/loadallhistoryItem', (req,res)=>{
	console.log("Load Hisotory items");
	let sqlQuery = 'SELECT * FROM history_item_list ORDER BY EXPIRE_DATE';

	connection.query(sqlQuery, (err, result)=>{
		if(err) {
			res.send(err);
		}else {
			return (res.json({data:result}));
		}
	})
})


app.get('/inventory/loadAllItem',(req,res)=>{
	console.log("Load all items in stock now");
	let filter = req.query.filter;

	let	sqlQuery = `SELECT I.ID, I.TYPE, I.SHELF_NO, I.MANUFACTURE, I.ENGLISH_NAME,I.CHINESE_NAME,I.HOLD_QTY, I.QTY, T.T_QTY, DATE_FORMAT(I.EXPIRE_DATE, "%Y-%m-%d") AS EXPIRE_DATE,GRAM,I.CREATED_BY,I.LAST_MODIFIED_BY FROM item_list I INNER JOIN (SELECT CONCAT(ENGLISH_NAME, CHINESE_NAME, TYPE) AS T_NAME, SUM(QTY) AS T_QTY FROM item_list GROUP BY CONCAT(CHINESE_NAME, ENGLISH_NAME, TYPE)) T ON CONCAT(I.ENGLISH_NAME, I.CHINESE_NAME, I.TYPE) = T.T_NAME WHERE UPPER(I.TYPE) LIKE '%${filter}%' OR UPPER(I.SHELF_NO) LIKE '%${filter}%' OR UPPER(I.MANUFACTURE) LIKE '%${filter}%' OR UPPER(I.ENGLISH_NAME) LIKE '%${filter}%' OR UPPER(I.CHINESE_NAME) LIKE '%${filter}%' OR EXPIRE_DATE LIKE '%${filter}%' Order by I.TYPE, I.ENGLISH_NAME;`; 
	
	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return (res.json({data:result}));
		}
	})
});

app.get('/inventory/loadAllHoldItem',(req,res)=>{
	console.log("Load all items are on hold");
	let sqlQuery = 'SELECT I.ID, H.ID, H.ITEM_ID, I.CHINESE_NAME, I.ENGLISH_NAME, I.TYPE, DATE_FORMAT(I.EXPIRE_DATE, "%Y-%m-%d") AS EXPIRE_DATE, I.GRAM, I.MANUFACTURE, H.PERSON, H.HOLD_QTY, DATE_FORMAT(H.DATE, "%Y-%m-%d") AS DATE from item_list I INNER JOIN hold_item_list H ON I.ID = H.ITEM_ID';

	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return (res.json({data:result}));
		}
	})
});


app.get('/inventory/updateItems',(req,res)=>{
	console.log("Update item");
	let updatedItem = JSON.parse(req.query.updatedItem);

	connection.query(`SELECT * FROM item_list WHERE ID = ${updatedItem.ID}`,(selectErr,selectResult)=>{
		if(selectResult[0]) {
			let itemInfo = selectResult[0];
			
			let actionDetails = `${itemInfo.TYPE !== updatedItem.TYPE? `Change Item Type From ${itemInfo.TYPE} To ${updatedItem.TYPE}.`: ""}`
							  +	`${itemInfo.SHELF_NO !== updatedItem.SHELF_NO? `Change ShelfNo From ${itemInfo.SHELF_NO} To ${updatedItem.SHELF_NO}.`:""}`
							  + `${itemInfo.MANUFACTURE !== updatedItem.MANUFACTURE? `Change Manu. From ${itemInfo.MANUFACTURE} To ${updatedItem.MANUFACTURE}`: ""}`
							  + `${itemInfo.ENGLISH_NAME + itemInfo.CHINESE_NAME !== updatedItem.ENGLISH_NAME + updatedItem.CHINESE_NAME? `Change Item Name From ${itemInfo.ENGLISH_NAME} ${itemInfo.CHINESE_NAME} To ${updatedItem.ENGLISH_NAME} ${updatedItem.CHINESE_NAME}.`: ""}`
							  + `${itemInfo.QTY !== updatedItem.QTY? `Change Item Qty From ${itemInfo.QTY} To ${updatedItem.QTY}.`: ""}`
							  +	`${moment(itemInfo.EXPIRE_DATE).format('YYYY-MM-DD') !== updatedItem.EXPIRE_DATE? `Change Item Exp. Date From ${moment(itemInfo.EXPIRE_DATE).format('YYYY-MM-DD')} To ${updatedItem.EXPIRE_DATE}.`:""}`
							  +	`${itemInfo.GRAM.toString() !== updatedItem.GRAM.toString()? `Change Item Gram from ${itemInfo.GRAM} To ${updatedItem.GRAM}.`:""}`;		

			if(actionDetails !== '') {
				let sqlQueries = `UPDATE item_list SET ENGLISH_NAME = '${updatedItem.ENGLISH_NAME}',CHINESE_NAME = '${updatedItem.CHINESE_NAME}',TYPE = '${updatedItem.TYPE}',SHELF_NO = '${updatedItem.SHELF_NO}' ,QTY = '${updatedItem.QTY}'`;
					sqlQueries += updatedItem.EXPIRE_DATE? `,EXPIRE_DATE = '${updatedItem.EXPIRE_DATE}'`:``
					sqlQueries += `,GRAM = '${updatedItem.GRAM}', LAST_MODIFIED_BY = '${updatedItem.LAST_MODIFIED_BY}' WHERE ID = '${updatedItem.ID}';`;
					sqlQueries += `INSERT INTO inventory_activity_logs (PERSON, ACTION, DETAIL) VALUES ('${updatedItem.LAST_MODIFIED_BY}','Update Item' ,'${updatedItem.ENGLISH_NAME} ${updatedItem.CHINESE_NAME}: ${actionDetails}');`;
	
				connection.query(sqlQueries,(err,result)=>{
					if(err) {
						res.send(err);
					}
					else {
						return (res.json({data:result[0]}));
					}
				})
			}
		}
	})



});

app.get('/inventory/deleteItem',(req,res)=>{
	console.log("Delete item");
	let deleteInfo = JSON.parse(req.query.deleteInfo);

	connection.query(`SELECT * FROM item_list WHERE ID = ${deleteInfo.ITEM_ID}`,(selectErr,selectResult)=>{
		if(selectResult[0]) {
			let itemInfo = selectResult[0];
			
			let sqlQueries = `DELETE FROM hold_item_list WHERE ITEM_ID = ${deleteInfo.ITEM_ID};`; 
				sqlQueries+= `DELETE FROM item_list where ID = ${deleteInfo.ITEM_ID};`;
				
			let actionDetails = `${itemInfo.ENGLISH_NAME} ${itemInfo.CHINESE_NAME} Type: ${itemInfo.TYPE}, Shelf No: ${itemInfo.SHELF_NO}, Manu.: ${itemInfo.MANUFACTURE}, QTY: ${itemInfo.QTY}, Exp.: ${moment(itemInfo.EXPIRE_DATE).format('YYYY-MM-DD')}, Gram: ${itemInfo.GRAM}`;
			sqlQueries += `INSERT INTO inventory_activity_logs (PERSON, ACTION, DETAIL) VALUES ('${deleteInfo.PERSON}','Delete Item' ,'${actionDetails}');`;

			connection.query(sqlQueries,(err,result)=>{
				if(err){
					console.log(err);
					res.send(err);
				}
				else {
					return (res.json({data:'success'}));
				} 
			})
		}
	})	
})


app.post('/inventory/addhold',(req,res)=>{
	console.log("Put item to on hold");
	let holdItems = req.body.holdItems;
	
	let sqlQueries = '';
	
	holdItems.ITEMS.forEach(item=>{
		console.log(item);
		sqlQueries += `INSERT INTO hold_item_list (ITEM_ID, PERSON, HOLD_QTY, DATE) VALUES ('${item.ID}', '${holdItems.HOLDFOR}','${item.HOLD_QTY}', '${holdItems.UNTIL}');`;
		sqlQueries += `UPDATE item_list set HOLD_QTY = HOLD_QTY + ${item.HOLD_QTY} WHERE ID = ${item.ID};`; 
		sqlQueries += `INSERT INTO inventory_activity_logs (PERSON, ACTION, DETAIL) VALUES('${holdItems.AUTHOR}', 'Hold Item','Item(${item.ENGLISH_NAME} ${item.CHINESE_NAME}-${item.TYPE}-${item.EXPIRE_DATE}) Qty: ${item.HOLD_QTY} for ${holdItems.HOLDFOR} ${holdItems.UNTIL===''?`with no expiry date`:`with expiry date: ${holdItems.UNTIL}`} is holded');`;

	})
	
	connection.query(sqlQueries, (err,result)=>{
		if(err) {
			res.send(err);
		}else {
			return (res.json({data:'success'}));
		}
	})

})



app.get('/inventory/restockHold',(req,res)=>{
	console.log("Reset on Hold Item");
	let restockItem = JSON.parse(req.query.restockInfo);
	
	connection.query(`SELECT * FROM item_list WHERE ID = ${restockItem.ITEM_ID}`,(selectErr,selectResult)=>{
		if(selectResult[0]) {
			let itemInfo = selectResult[0];

			let sqlQueries = `UPDATE item_list set HOLD_QTY = HOLD_QTY - ${restockItem.HOLD_QTY} where ID = ${restockItem.ITEM_ID};`;
				sqlQueries+= `DELETE FROM hold_item_list WHERE ID = ${restockItem.ID};`;
				sqlQueries+= `INSERT INTO inventory_activity_logs (PERSON, ACTION, DETAIL) VALUES ('${restockItem.PERSON}','Restock Item','Item(${itemInfo.ENGLISH_NAME} ${itemInfo.CHINESE_NAME}-${itemInfo.TYPE}-${moment(itemInfo.EXPIRE_DATE).format("YYYY-MM-DD")}) has been restocked');`;

		
			connection.query(sqlQueries,(err,result)=> {
				if(err) {
					res.send(err);
				}else {
					return (res.json({data:'success'}));
				}
			})
		}
	});
	
})
	
//*************************************** Checkout **********************************************************************
app.get("/checkout",(req,res)=> {
	console.log("Load all Orders in checkout");
	let sqlQuery = "SELECT * FROM ongoing_order ORDER BY ORDER_TIME DESC";

	connection.query(sqlQuery, (err,result) => {
		if(err) {
			res.send(err);
		}else {
			return (res.json({data: result}));
		}
	});
});


app.get("/checkout/ongoingordernotifications",(req,res)=>{
	console.log("Load all new notifications for ONGOING_ORDER every 3 sec");
	let sqlQuery = 'SELECT ORDER_ID, NEW_MSG_CHKOUT FROM ONGOING_ORDER';  

	connection.query(sqlQuery,(err,result)=>{
		if(err) {
			res.send(err);
		}else {
			return res.json({data:result});
		}
	})
})





app.get("/checkout/ongoingorder",(req,res)=>{
	console.log("Load information for chosen ONGOING_ORDER");
	let {orderId} = req.query;
	
	let sqlQuery1 = `SELECT * FROM ongoing_order WHERE ORDER_ID = ${orderId};`;
	let	sqlQuery2 = `SELECT O.ID AS "ORDER_ITEM_ID", O.PRODUCT AS "ORDER_ITEM_PRODUCT", o.QTY AS "ORDER_ITEM_QTY",O.PICKUP_ITEMS AS "PICKUP_ITEMS", i.ID, i.SHELF_NO,I.MANUFACTURE, i.QTY, i.EXPIRE_DATE, i.TYPE FROM ORDER_ITEM_LIST o LEFT JOIN item_list i ON LOWER(o.product) = LOWER(CONCAT(i.ENGLISH_NAME,' ',i.CHINESE_NAME)) where o.ORDER_ID = ${orderId} ORDER BY O.PRODUCT, I.EXPIRE_DATE ASC;`;
	let sqlQuery3 = `UPDATE ONGOING_ORDER SET NEW_MSG_CHKOUT = 0 WHERE ORDER_ID = ${orderId}`;

	let data = [];
	connection.query(sqlQuery1+sqlQuery2+sqlQuery3,(err,result)=>{
		if(err) {
			res.send(err);
		}else{
			return res.json(
				{
					data:{
						order : result[0],
						orderItems : result[1]
					}
				}
			)
		}
	});
});


app.get("/check/ongoingorder/inprocess",(req,res)=> {
	console.log("Load the information for chosen ONGOING_ORDER if the order is in process");
	let {orderId} = req.query;

	let sqlQuery = `SELECT ID, PRODUCT AS "ORDER_ITEM_PRODUCT", QTY AS "ORDER_ITEM_QTY",PICKUP_ITEMS AS "DIFFERENT_TYPE" FROM ORDER_ITEM_LIST WHERE ORDER_ID = ${orderId}`;
	connection.query(sqlQuery,(err,result)=>{
		if(err) {
			res.send(err);
		}else {
			return res.json({data: result});
		}
	})
});


app.get("/checkout/order/loadnotes",(req,res)=>{
	console.log("Load all notes for the chosen order every 1 sec");
	let {orderId} = req.query;

	let	sqlQuery = `SELECT * FROM checkout_note WHERE ORDER_ID = ${orderId} ORDER BY TIME DESC`;

	connection.query(sqlQuery, (err,result)=>{
		if(err) {
			res.send(err);
		}else {
			return res.json({data: result});
		}
	})
});



app.post("/checkout/ongoingorder/pushtoprocess",(req,res)=>{
	console.log("Push RECEIVED order or Pushed Back order to In Process");

	let orderInfo = req.body;
	
	let pauseTask = false;

	let actvityLogQuery = `INSERT INTO chk_pickup_activity_logs (PERSON, ACTION, DETAIL) VALUES('${orderInfo.ACCOUNTINFO}', 'PUSH TO IN PROCESS', 'Push Order: ${orderInfo.ORDER_NO} from ${orderInfo.CURRENTSTATUS} to IN PROCESS');`;
	let sqlQuery1 = `UPDATE ongoing_order SET PROCESS_TIME = '${orderInfo.PROCESS_TIME}', PERSON = '${orderInfo.ACCOUNTINFO}' , STATUS = '${orderInfo.NEXTSTATUS}', NEW_MSG_PICKUP = NEW_MSG_PICKUP + 1 WHERE ORDER_ID = ${orderInfo.ORDER_NO};`;
		sqlQuery1 += orderInfo.NOTE ? `INSERT INTO checkout_note (ORDER_ID, PERSON, TIME, NOTE, STATUS) VALUES ('${orderInfo.ORDER_NO}', '${orderInfo.ACCOUNTINFO}', '${orderInfo.PROCESS_TIME}', '${orderInfo.NOTE}','${orderInfo.CURRENTSTATUS}');` : ``;

		
	orderInfo.ITEMS.forEach(item => {
		let sqlQuery2 = `UPDATE order_item_list SET PICKUP_ITEMS ='${JSON.stringify(item.DIFFERENT_TYPE)}', STATUS='${orderInfo.NEXTSTATUS}' WHERE ID = ${item.ORDER_ITEM_ID};`;
		connection.query(sqlQuery2,(err,result2) => {
			if(err) {
				pauseTask = true;
			}else {
				item.DIFFERENT_TYPE.forEach(diffItem => {
					let sqlQuery3 = `UPDATE item_list SET QTY = QTY - ${diffItem.PICKUPVALUE} WHERE ID = ${diffItem.ID};`;
					connection.query(sqlQuery3,(err,result3)=>{
						if(err) {
							pauseTask = true;
						}
					});

				});
			}
		});
	})

	if (!pauseTask) {
		connection.query(sqlQuery1+actvityLogQuery,(err,result1)=>{
			if(err) {
				res.send(err);
			}else {
				return res.json({data:'success'});
			}
		});
	}else {
		return res.json({data: 'fail'});
	}

});



app.get("/checkout/ongoingorder/deleteorder",(req,res)=> {
	console.log("Delete order in ONGOING_ORDER");
	let orderInfo = JSON.parse(req.query.orderInfo);
	let sqlQueries = `UPDATE ongoing_order SET PROCESS_TIME = "${orderInfo.PROCESS_TIME}", PERSON = "${orderInfo.PERSON}", STATUS = "DELETED" WHERE ORDER_ID = ${orderInfo.ORDER_ID};`;
		sqlQueries+= `UPDATE order_item_list SET STATUS = "DELETED" WHERE ORDER_ID = ${orderInfo.ORDER_ID};`;
		sqlQueries+= `INSERT INTO checkout_note (ORDER_ID, PERSON,TIME, NOTE, STATUS) VALUES (${orderInfo.ORDER_ID}, '${orderInfo.PERSON}', '${orderInfo.PROCESS_TIME}', '${orderInfo.NOTE}','DELETED');`;
		sqlQueries+= `INSERT INTO chk_pickup_activity_logs (PERSON, ACTION, DETAIL) VALUES('${orderInfo.PERSON}','DELETE ORDER', 'Delete Order: ${orderInfo.ORDER_ID}');`;
		
	connection.query(sqlQueries,(err,result)=> {
		if(err) {
			res.send(err);
		}else {
			return res.json({data:'success'});
		}
	});

})

//***********************************************************************************************************************

//*********************************Pick up*******************************************************************************

app.get('/pickup',(req,res)=> {
	console.log("Load all Pick Up(In PROCESS) orders every 1 sec");
	let sqlQuery1 = "SELECT * FROM ongoing_order WHERE STATUS = 'IN PROCESS' ORDER BY ORDER_TIME DESC;";
	
	connection.query(sqlQuery1,(err,result)=>{
		if(err) {
			res.send(err);
		}else {
			return res.json({orders: result});
		}
	});
});


app.get('/pickup/order-detail',(req,res)=> {
	console.log("Load information for chosen order in PICK UP");
	let {orderId} = req.query;

	let sqlQueries = `SELECT * FROM order_item_list WHERE STATUS = 'IN PROCESS' AND ORDER_ID = ${orderId};`;
		sqlQueries+= `UPDATE ongoing_order SET NEW_MSG_PICKUP = 0 WHERE ORDER_ID = ${orderId};`

	connection.query(sqlQueries,(err,result)=> {
		if (err) {
			res.send(err);
		}else {
			return res.json({orderDetail:result[0]});
		}
	})
})


app.get('/pickup/order-detail/pushprocess',(req,res)=>{
	console.log("PUSH BACK order or FINISH order in PICK UP");
	let actionInstr = JSON.parse(req.query.actionInstr);
	
	let sqlQueries = `UPDATE ongoing_order SET PICKUP_PERSON = '${actionInstr.PERSON}' ,STATUS = '${actionInstr.action}' ,NEW_MSG_CHKOUT = NEW_MSG_CHKOUT+1 WHERE ORDER_ID = ${actionInstr.orderNo};`;
		sqlQueries += `UPDATE order_item_list SET STATUS = '${actionInstr.action}' WHERE ORDER_ID = ${actionInstr.orderNo};`;

		sqlQueries += actionInstr.note? `INSERT INTO checkout_note (ORDER_ID, PERSON, TIME, NOTE, STATUS) VALUES (${actionInstr.orderNo}, '${actionInstr.PERSON}','${actionInstr.PROCESS_TIME}','${actionInstr.note}', '${actionInstr.action}');`: ``;

		if(actionInstr.action === 'PUSHED BACK') {
			sqlQueries+= `INSERT INTO chk_pickup_activity_logs (PERSON, ACTION, DETAIL) VALUES('${actionInstr.PERSON}', 'PUSH BACK ORDER', 'Push back Order: ${actionInstr.orderNo} From Pick Up Station');`;
			actionInstr.orderItems.forEach(item => {
				item.PICKUP_ITEMS.forEach(diffItem => {
					sqlQueries += `UPDATE item_list SET QTY = QTY + ${diffItem.PICKUPVALUE} WHERE ID = ${diffItem.ID};`;
				})
			})
		}else {
			sqlQueries+= `INSERT INTO chk_pickup_activity_logs (PERSON, ACTION, DETAIL) VALUES('${actionInstr.PERSON}', 'Complete ORDER', 'Complete Order: ${actionInstr.orderNo} From Pick Up Station');`;
		}

	
	connection.query(sqlQueries,(err,result)=> {
		if(err) {
			res.send(err);
		}else {
			return res.json({data:'success'});
		}
	})
});













//***********************************************************************************************************************

//receiving Orders from shopify
app.use("/shopify", (req, res) => {
	let shopifyData = req.body;
	console.log(shopifyData);

	let sqlQuery = `INSERT INTO ongoing_order(ORDER_ID, CUSTOMER, ORDER_TIME, STATUS, NEW_MSG_CHKOUT) SELECT '${shopifyData.order_number}' , '${shopifyData.customer.first_name} ${shopifyData.customer.last_name}' , '${shopifyData.updated_at}', 'RECEIVED', 1 FROM DUAL WHERE NOT EXISTS(SELECT 1 FROM ongoing_order WHERE ORDER_ID = ${shopifyData.order_number});`;

	shopifyData.line_items.forEach(item => {
		if(item.name !== 'Tablet Service -200g' && item.name !== 'Tablet Service -100g'){
			sqlQuery += `INSERT INTO order_item_list(ORDER_ID, PRODUCT, QTY, STATUS) SELECT '${shopifyData.order_number}', '${item.name}', '${item.grams && item.grams === 200? parseInt(item.quantity)*2 : parseInt(item.quantity)}','RECEIVED' FROM DUAL WHERE NOT EXISTS(SELECT 1 FROM order_item_list WHERE ORDER_ID = ${shopifyData.order_number} AND PRODUCT = '${item.name}');`;
		}
	})

	connection.query(sqlQuery, (err,result) => {
		if(err) {
			console.log(err);
			res.send(err);
		}else {
			console.log("Shopify data has been saved");
			return (res.json({data:result}));
		}
	})	
})


app.use("/draft", (req, res) => {
	let shopifyData = req.body;
	console.log(shopifyData);

	
})

app.use("/draftdelete", (req, res) => {
	let shopifyData = req.body;
	console.log("@@@@@");
	console.log(shopifyData);

	
})

app.get('/home', function(req, res) {
	if (req.session.loggedin) {
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
});

app.listen(4000,()=>{
	console.log("##############Server listening on port 4000");
});