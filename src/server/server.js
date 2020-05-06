const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require ('mysql');

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

	connection.query(sqlQuery,(err, result) =>{
		if(err){
			res.send(err);
		}else {
			console.log(result);
			return res.json({data:result})
		}
	});
});


app.get('/login/account',(req,res)=>{
	console.log("Get request for fetch data from all user");

	var sqlQuery = `SELECT * FROM account_list where ID != 1`;

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
	console.log(newUserInfo);
	
	let sqlQuery = `INSERT INTO account_list(USERNAME, ACCOUNT, PASSWORD, CREATEDBY) VALUES ('${newUserInfo.username}', '${newUserInfo.account}', '${newUserInfo.password}', '${newUserInfo.createdBy}');`;
	console.log(sqlQuery);
	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
			console.log("err");
			console.log(err);
		}else {
			return res.json({data:result})
		}
	});
});


app.get('/login/account/resetpassword',(req,res)=>{
	console.log("Received Data from resetPassword");
	let userPwdInfo = JSON.parse(req.query.newUserInfo);

	var sqlQuery = `UPDATE account_list set PASSWORD = '${userPwdInfo.newPassword}' where ID = ${userPwdInfo.id}`;
	console.log(sqlQuery);

	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}
		else{
			return res.json({data:'success'});
		}
	});

});



app.get('/login/account/displayUsers',(req,res) =>{
	console.log("Get Target User" + req.query);

	var sqlQuery = `SELECT * FROM account_list where ID = ${req.query.id}`;
	console.log(sqlQuery);
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
	console.log(sqlQuery);

	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return (res.json({data: 'success'}));
		}
	});
});

//*******************************************************************************************




//****************************Inventroy******************************************************
app.get('/inventory/loadSelect',(req,res)=>{

	var sqlQuery = 'SELECT ITEM_TYPE FROM item_list_type_list';
	console.log('Get request from inventory/loadSelect');
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
	console.log('Get request to add newItem');

	let sqlQuery = `INSERT INTO item_list(TYPE, SHELF_NO,MANUFACTURE,ENGLISH_NAME,CHINESE_NAME, QTY,EXPIRE_DATE,GRAM,CREATED_BY,LAST_MODIFIED_BY) VALUES ('${newItem.type}', '${newItem.shelfNo}', '${newItem.manufacturer}', '${newItem.ENname}','${newItem.CHname}', '${newItem.qty}', '${newItem.exp}','${newItem.gram}', '${newItem.createdBy}', '${newItem.createdBy}')`;
	console.log(sqlQuery);
	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return (res.json({data: 'success'}));
		}
	});
});

app.get('/inventory/loadAllItem',(req,res)=>{
	let filter = req.query.filter;

	//let sqlQuery = `SELECT I.ID, I.TYPE, I.SHELF_NO, I.MANUFACTURE, I.ENGLISH_NAME,I.CHINESE_NAME,I.HOLD_QTY, I.QTY, T.T_QTY, DATE_FORMAT(I.EXPIRE_DATE, "%Y-%m-%d") AS EXPIRE_DATE,GRAM,I.CREATED_BY,I.LAST_MODIFIED_BY,ROWSPAN FROM item_list I INNER JOIN (SELECT ENGLISH_NAME AS T_ENGLISH_NAME, CHINESE_NAME AS T_CHINESE_NAME,TYPE AS T_TYPE, SUM(QTY) AS T_QTY,'Filter' AS ROWSPAN FROM item_list GROUP BY CHINESE_NAME, TYPE) T ON I.ENGLISH_NAME = T.T_ENGLISH_NAME AND I.CHINESE_NAME = T.T_CHINESE_NAME AND I.TYPE = T.T_TYPE WHERE UPPER(I.TYPE) LIKE '%${filter}%' OR UPPER(I.SHELF_NO) LIKE '%${filter}%' OR UPPER(I.MANUFACTURE) LIKE '%${filter}%' OR UPPER(I.ENGLISH_NAME) LIKE '%${filter}%' OR UPPER(I.CHINESE_NAME) LIKE '%${filter}%' OR EXPIRE_DATE LIKE '%${filter}%' Order by I.TYPE, I.ENGLISH_NAME`;
	let sqlQuery = `SELECT I.ID, I.TYPE, I.SHELF_NO, I.MANUFACTURE, I.ENGLISH_NAME,I.CHINESE_NAME,I.HOLD_QTY, I.QTY, T.T_QTY, DATE_FORMAT(I.EXPIRE_DATE, "%Y-%m-%d") AS EXPIRE_DATE,GRAM,I.CREATED_BY,I.LAST_MODIFIED_BY FROM item_list I INNER JOIN (SELECT ENGLISH_NAME AS T_ENGLISH_NAME, CHINESE_NAME AS T_CHINESE_NAME,TYPE AS T_TYPE, SUM(QTY) AS T_QTY,'Filter' AS ROWSPAN FROM item_list GROUP BY CHINESE_NAME, TYPE) T ON I.ENGLISH_NAME = T.T_ENGLISH_NAME AND I.CHINESE_NAME = T.T_CHINESE_NAME AND I.TYPE = T.T_TYPE WHERE UPPER(I.TYPE) LIKE '%${filter}%' OR UPPER(I.SHELF_NO) LIKE '%${filter}%' OR UPPER(I.MANUFACTURE) LIKE '%${filter}%' OR UPPER(I.ENGLISH_NAME) LIKE '%${filter}%' OR UPPER(I.CHINESE_NAME) LIKE '%${filter}%' OR EXPIRE_DATE LIKE '%${filter}%' Order by I.TYPE, I.ENGLISH_NAME`;
	
	console.log(sqlQuery);
	console.log('Get all item for inventory');

	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return (res.json({data:result}));
		}
	})
});

app.get('/inventory/loadAllHoldItem',(req,res)=>{

	let sqlQuery = 'SELECT I.ID, H.ID, H.ITEM_ID, I.CHINESE_NAME, I.ENGLISH_NAME, I.TYPE, DATE_FORMAT(I.EXPIRE_DATE, "%Y-%m-%d") AS EXPIRE_DATE, I.GRAM, I.MANUFACTURE, H.PERSON, H.HOLD_QTY, DATE_FORMAT(H.DATE, "%Y-%m-%d") AS DATE from item_list I INNER JOIN hold_item_list H ON I.ID = H.ITEM_ID';
	
	console.log('Get hold items');
	console.log(sqlQuery);

	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return (res.json({data:result}));
		}
	})
});


app.get('/inventory/updateItems',(req,res)=>{
	let updatedItem = JSON.parse(req.query.updatedItem);
	let sqlQuery = `UPDATE item_list SET ENGLISH_NAME = '${updatedItem.ENGLISH_NAME}',CHINESE_NAME = '${updatedItem.CHINESE_NAME}',TYPE = '${updatedItem.TYPE}',SHELF_NO = '${updatedItem.SHELF_NO}' ,QTY = '${updatedItem.QTY}'`;
		sqlQuery += updatedItem.EXPIRE_DATE? `,EXPIRE_DATE = '${updatedItem.EXPIRE_DATE}'`:``
		sqlQuery += `,GRAM = '${updatedItem.GRAM}' WHERE ID = '${updatedItem.ID}'`;

	console.log(updatedItem);
	console.log(sqlQuery);
	connection.query(sqlQuery,(err,result)=>{
		if(err) {
			res.send(err);
		}
		else {
			console.log(result);
			return (res.json({data:result}));
		}
	})
});

app.get('/inventory/deleteItem',(req,res)=>{
	let {itemId} = req.query;

	let sqlQuery = `DELETE FROM hold_item_list WHERE ITEM_ID = ${itemId}; DELETE FROM item_list where ID = ${itemId}`;
	
	connection.query(sqlQuery,[1,2],(err,result)=>{
		if(err){
			res.send(err);
		}
		else {
			return (res.json({data:'success'}));
		} 
	})
})



app.get('/inventory/addhold',(req,res)=>{

	let holdItem = JSON.parse(req.query.holdItem);
	
	let sqlQuery = `INSERT INTO hold_item_list (ITEM_ID, PERSON, HOLD_QTY, DATE) VALUES ('${holdItem.ITEM_ID}', '${holdItem.PERSON}','${holdItem.HOLD_QTY}', '${holdItem.DATE}')`;

	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}
		else {
			connection.query(`UPDATE item_list set HOLD_QTY = (SELECT HOLD_QTY FROM item_list where ID = ${holdItem.ITEM_ID}) + ${holdItem.HOLD_QTY} where ID = ${holdItem.ITEM_ID}`,(err,result)=>{
				if(err) {
					res.send(err);
				}
				else {
					return (res.json({data:'success'}));
				}
			});
		}
	})
})
	


app.get('/inventory/restockHold',(req,res)=>{

	let restockItem = JSON.parse(req.query.restockInfo);
	
	let sqlQuery = `UPDATE item_list set HOLD_QTY = (SELECT HOLD_QTY FROM item_list where ID = ${restockItem.ITEM_ID}) - ${restockItem.HOLD_QTY} where ID = ${restockItem.ITEM_ID}`;
	console.log(sqlQuery);
	connection.query(sqlQuery,(err,result)=>{
		if(err){
			res.send(err);
		}
		else {
			console.log(restockItem);
			sqlQuery = `DELETE FROM hold_item_list WHERE ID = ${restockItem.ID}`;
			
			console.log(sqlQuery);
			connection.query(sqlQuery,(err,result)=>{
				if(err) {
					res.send(err);
				}
				else {
					return (res.json({data:'success'}));
				}
			});
		}
	})
})
	
//*************************************** Checkout **********************************************************************
app.get("/checkout",(req,res)=> {
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
	let {orderId} = req.query;
	
	let sqlQuery1 = `SELECT * FROM ongoing_order WHERE ORDER_ID = ${orderId};`;
	let	sqlQuery2 = `SELECT O.ID AS "ORDER_ITEM_ID", O.PRODUCT AS "ORDER_ITEM_PRODUCT", o.QTY AS "ORDER_ITEM_QTY",O.PICKUP_ITEMS AS "PICKUP_ITEMS", i.ID, i.SHELF_NO,I.MANUFACTURE, i.QTY, i.EXPIRE_DATE, i.TYPE FROM ORDER_ITEM_LIST o LEFT JOIN item_list i ON o.product = CONCAT(i.ENGLISH_NAME,' ',i.CHINESE_NAME) where o.ORDER_ID = ${orderId} ORDER BY O.PRODUCT, I.EXPIRE_DATE ASC;`;
	let sqlQuery3 = `UPDATE ONGOING_ORDER SET NEW_MSG_CHKOUT = 0 WHERE ORDER_ID = ${orderId}`;
	console.log(sqlQuery2);
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
	let {orderId} = req.query;

	let sqlQuery = `SELECT ID, PRODUCT AS "ORDER_ITEM_PRODUCT", QTY AS "ORDER_ITEM_QTY",PICKUP_ITEMS AS "DIFFERENT_TYPE" FROM ORDER_ITEM_LIST WHERE ORDER_ID = ${orderId}`;
	console.log(sqlQuery);
	connection.query(sqlQuery,(err,result)=>{
		if(err) {
			res.send(err);
		}else {
			return res.json({data: result});
		}
	})
});


app.get("/checkout/order/loadnotes",(req,res)=>{
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



app.get("/checkout/ongoingorder/pushtoprocess",(req,res)=>{
	let orderInfo = JSON.parse(req.query.orderInfo);
	let pauseTask = false;

	console.log(orderInfo);
	let sqlQuery1 = `UPDATE ongoing_order SET PROCESS_TIME = '${orderInfo.PROCESS_TIME}', PERSON = '${orderInfo.ACCOUNTINFO}' , STATUS = '${orderInfo.NEXTSTATUS}', NEW_MSG_PICKUP = NEW_MSG_PICKUP + 1 WHERE ORDER_ID = ${orderInfo.ORDER_NO};`;
		sqlQuery1 += orderInfo.NOTE ? `INSERT INTO checkout_note (ORDER_ID, PERSON, TIME, NOTE, STATUS) VALUES ('${orderInfo.ORDER_NO}', '${orderInfo.ACCOUNTINFO}', '${orderInfo.PROCESS_TIME}', '${orderInfo.NOTE}','${orderInfo.CURRENTSTATUS}');` : ``;

		console.log(sqlQuery1);
	orderInfo.ITEMS.forEach(item => {
		let sqlQuery2 = `UPDATE order_item_list SET PICKUP_ITEMS ='${JSON.stringify(item.DIFFERENT_TYPE)}', STATUS='${orderInfo.NEXTSTATUS}' WHERE ID = ${item.ORDER_ITEM_ID};`;
		console.log(sqlQuery2);
		connection.query(sqlQuery2,(err,result2) => {
			if(err) {
				pauseTask = true;
			}else {
				item.DIFFERENT_TYPE.forEach(diffItem => {
					let sqlQuery3 = `UPDATE item_list SET QTY = QTY - ${diffItem.PICKUPVALUE} WHERE ID = ${diffItem.ID};`;
					console.log(sqlQuery3);
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
		connection.query(sqlQuery1,[1,2],(err,result1)=>{
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

//***********************************************************************************************************************

//*********************************Pick up*******************************************************************************

app.get('/pickup',(req,res)=> {
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
	let actionInstr = JSON.parse(req.query.actionInstr);

	let sqlQueries = `UPDATE ongoing_order SET STATUS = '${actionInstr.action}',${actionInstr.note? "NEW_MSG_CHKOUT = NEW_MSG_CHKOUT+1" : ""} WHERE ORDER_ID = ${actionInstr.orderNo};`;
		sqlQueries += `UPDATE order_item_list SET STATUS = '${actionInstr.action}' WHERE ORDER_ID = ${actionInstr.orderNo};`;

		sqlQueries += actionInstr.note? `INSERT INTO checkout_note (ORDER_ID, PERSON, TIME, NOTE, STATUS) VALUES (${actionInstr.orderNo}, '${actionInstr.PERSON}','${actionInstr.PROCESS_TIME}','${actionInstr.note}', '${actionInstr.action}');`: ``;

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
app.post("/shopify", (req, res) => {
	let shopifyData = req.body;
	console.log(shopifyData);
	let sqlQuery = `INSERT INTO ongoing_order(ORDER_ID, CUSTOMER, ORDER_TIME, STATUS) VALUES ('${shopifyData.order_number}' , '${shopifyData.customer.first_name} ${shopifyData.customer.last_name}' , '${shopifyData.updated_at}', 'RECEIVED');`;
	sqlQuery += 'INSERT INTO order_item_list(ORDER_ID, PRODUCT, QTY, STATUS) VALUES ?';


	let valueItems = [];

	shopifyData.line_items.forEach(item => {
		if(item.grams) {
			valueItems.push([shopifyData.order_number, item.name , item.grams === 200? parseInt(item.quantity)*2 : parseInt(item.quantity), 'RECEIVED']);
		}else {
			valueItems.push([shopifyData.order_number, item.name , parseInt(item.quantity), 'RECEIVED']);
		}
	});
	
	connection.query(sqlQuery,[valueItems],(err,result)=>{
		if(err){
			res.send(err);
		}else {
			return (res.json({data:result}));
		}
	})
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