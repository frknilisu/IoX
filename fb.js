console.log("starting..")

var firebase = require("firebase");
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
	apiKey: "AIzaSyDgzcwoWSXS3X0JSKpwCYURs76gZsOyq78",
	authDomain: "kumbara-f2a95.firebaseapp.com",
	databaseURL: "https://kumbara-f2a95.firebaseio.com",
	projectId: "kumbara-f2a95",
	storageBucket: "kumbara-f2a95.appspot.com",
	messagingSenderId: "106010349713",
};

firebase.initializeApp(config);

var database = firebase.database();
var usersRef = database.ref("users");

var acc0 = null;

if (web3.eth.accounts.length < 1) {

	acc0 = web3.personal.newAccount("pass");

	usersRef.child(acc0).set({
		'pending': [],
		'status': {
			'balance': 0,
			'mining': "OFF"
		}
	});

	console.log("New account created");

} else {
	acc0 = web3.eth.accounts[0];
}


console.log("Acc: " + acc0);
console.log(web3.eth.blockNumber);

var mining = "OFF";
var currentBalance = web3.fromWei(web3.eth.getBalance(acc0), "ether");
var prevBalance = currentBalance;
console.log("First Balance: " + currentBalance + " ether");


accRef = usersRef.child(acc0);

/* 	
	*********************************************************************
	*																	*
	*																	*
	*																	*
	*********************************************************************
*/

accRef.child("pending").on("child_added", function(snapshot) {


	console.log("pending child added read");

	var item = snapshot.val();
	console.log(item);
	var item_key = snapshot.key;

	web3.personal.unlockAccount(acc0, "pass", 30);
	var val = web3.toWei(parseInt(item.value), "ether");
	val = parseInt(val);
	web3.eth.sendTransaction({from: item.from, to: item.to, value: val});

	accRef.child("pending").child(snapshot.key).remove();
	console.log("Item removed: " + item_key);
   
}, function (error) {
   console.log("Error: " + error.code);
});


accRef.child("status").child("mining").on("value", function(snapshot) {

	var val = snapshot.val();

	if(val == "ON"){
		mining = "ON";
		setFace(3);
	} else if(val == "OFF"){
		mining = "OFF";
	}

}, function (error) {
	console.log("Error: " + error.code);
});


function updateBalance(){
	var acctBal = web3.fromWei(web3.eth.getBalance(acc0), "ether");
	console.log("currBal: " + currentBalance + ", acctBal: " + acctBal);
	if(currentBalance != acctBal){

		if(currentBalance - acctBal > 0.0001){
			setFace(2);
			console.log("losing money..");
		} else if(currentBalance - acctBal < -0.0001){
			setFace(1);
			console.log("earning money..");
		}

		currentBalance = acctBal;
		console.log("currBal: " + currentBalance + ", acctBal: " + acctBal);
		accRef.child("status").update({'balance': acctBal});
		console.log("Updated balance");
	}
}

setInterval(function(){
	updateBalance();
}, 1000);


setInterval(function(){
	if(mining == "ON"){
		setFace(3);
		console.log("mining on");
	} else {
		console.log("mining off");
	}
}, 2500);


/* 	
	*********************************************************************
	*																	*
	*																	*
	*																	*
	*********************************************************************
*/



const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 9600
}, function(err){
	console.log("Error: " + err);
});



/*
SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});


setInterval(function(){
	port.write('page page0');
	console.log("fill");
}, 500);
*/


function setFace(x){
	port.write(hex('p0.pic=' + x));
}


function init(){


	port.on('open', function() {
		//write.setPage(1);
		//write.uart('fill 100,100,500,500,RED');
		port.write(hex('fill 50,50,150,150,GREEN'));
		console.log('Port ouvert sur /dev/ttyUSB0 @ 9600 bds');
	});
	
	port.on('data', function(byte){
		var data = byte.toString('hex').match(/.{1,2}/g);
		readUart(data);
	});
}

var write = {
	uart: function(cmd){
		writeUart(cmd);
	},
	setPage: function(num){
		writeUart('page '+num);
	},
	setText: function(cmp, txt){
		writeUart(cmp+'.txt="'+txt+'"');
	},
	setVis: function(cmp, value){
		var val = value ? "1":"0";
		writeUart('vis '+cmp+','+val);
	},
	setColor: function(cmp, bco){
		writeUart(cmp + ".bco=" + bco);
		writeUart("ref " + cmp);
	},
	getPage: function(){
		writeUart('sendme');
	}
};

function writeUart(cmd){
	port.write(hex(cmd));
}

function readUart(data){
	console.log(data.join(" "));
}

function hex(str) {
	var arr = [];
	for (var i = 0, l = str.length; i < l; i ++) {
		var ascii = str.charCodeAt(i);
		arr.push(ascii);
	}
	arr.push(255);
	arr.push(255);
	arr.push(255);
	return new Buffer(arr);
}
//init();
