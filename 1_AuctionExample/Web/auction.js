
// var web3 = new Web3();
var web3 = new Web3('ws://localhost:7545');
 
// web3.setProvider(new web3.providers.HttpProvider("http://localhost:7545"));

var bidder;
//사용자들
let userList = [];
let adminList = [];
//서버주소
let contract_address = [];
//=   web3.eth.getAccounts(); // web3.eth.accounts[0];
let listCount = 0;

let statusList = [];


let contractAddress;
web3.eth.getAccounts().then(function(acc){
  // bidder=acc;
  console.log(acc)
  web3.eth.defaultAccount = acc[0]
  bidder = acc[0]
  // userList.push(acc[0])
  for(i = 0; i < acc.length; i++){
    userList.push(acc[i]);
  }

  // console.log("LIST")
  // for(i = 0; i < userList.length; i++){
  //   console.log(userList[i]);
  // }
  web3.eth.getBlockNumber().then(function (num) {
    let totalnumber = num;
    //console.log(totalnumber)
    for( i = 1 ; i <= num; i++){
      web3.eth.getBlock(i).then( function (data) {
        let blockData = data.transactions[0]
        web3.eth.getTransactionReceipt(blockData).then(function (rsdata) {
          console.log(rsdata)
          let reslutAddr = rsdata.contractAddress
          if(reslutAddr != null){
            contract_address.push(reslutAddr)
            adrsetting();
            let resultOwner = rsdata.from
            //console.log("RSOW:"+resultOwner)
            adminList.push(resultOwner);
            usersetting();
          }
        });

      });
    }
  });
  //usersetting();
});

function usersetting(){
  let adminstr = "";
  if(adminList.length > 0){
    for ( i = 0 ; i < adminList.length; i++){
      adminstr += `<option name='userselect' value='admin${i}'>Admin${i}</option>`;
    }
  }
  let userstr = "";
  if(userList.length > 0){
    for( i = 0 ; i < userList.length; i++){
      userstr += `<option name='userselect' value='${i}'>User${i}</option>`;
    }
    //document.getElementById('userselect').innerHTML = aminstr + userstr;
  }else{
    userstr = "<option name='userselect' value=''>No Data</option>";
  }

  document.getElementById('userselect').innerHTML = adminstr + userstr;
}
function adrsetting(){
  
  if(contract_address.length > 0){
    let str = "";
    for( i = 0; i < contract_address.length; i++){
      str += `<option name='serverselect' value='${i}'>Server${i}</option>`;
    }
    document.getElementById('serverselect').innerHTML = str;
  }else{
    document.getElementById('serverselect').innerHTML = "<option name='serverselect' value=''>No Data</option>";
  }
}

function changemain1(){
  document.getElementById('main1').style.display="block";
  document.getElementById('main2').style.display="none";
  bidder = null;
  auction_owner = null;
  auctionContract.options.address = null;
}
function changemain2(){
  document.getElementById('main1').style.display="none";
  document.getElementById('main2').style.display="block";

  let choise1 = document.getElementById('serverselect');
  let chooseAddr = choise1.options[choise1.selectedIndex].value;

  let choise2 = document.getElementById('userselect');
  let chooseUser = choise2.options[choise2.selectedIndex].value;

  //console.log(chooseAddr)
  //console.log(chooseUser)

  contractAddress = contract_address[chooseAddr]
  //console.log("CAD:"+contractAddress)
  //console.log("BD:"+bidder)
  if (chooseUser.startsWith('admin')){
    bidder = adminList[ chooseUser.substring(5)];
    listCount = chooseUser.substring(5)
  }else{
    bidder = userList[chooseUser];
    listCount = chooseUser
  }
  console.log("BD:"+bidder)
  actionEvents();
  getOwnser();
}
function setSvId(){
  let str = "<label class='lead'> Server : "+contractAddress+"</label><br><label class='lead'>Your Info : "+bidder+"</label>";
  document.getElementById('setInfor').innerHTML = str;
}

function actionEvents(){
  auctionContract.options.address = contractAddress;

  auctionContract.methods.auction_end().call().then( (result)=>{
    document.getElementById("auction_end").innerHTML=result;
    //console.log("1")
    });
    
      auctionContract.methods.highestBidder().call().then( (result)=>{
    document.getElementById("HighestBidder").innerHTML=result;
    //console.log("2")
    }); 
        
    auctionContract.methods.highestBid().call().then( (result)=>{
    console.log("highest bid info: ", result)
    var bidEther = web3.utils.fromWei(web3.utils.toBN(result), 'ether');
    document.getElementById("HighestBid").innerHTML=bidEther;
    //console.log("3")
    
    }); 
      auctionContract.methods.STATE().call().then( (result)=>{
    document.getElementById("STATE").innerHTML=result;
    //console.log("4")
    }); 
    
      auctionContract.methods.Mycar().call().then( (result)=>{
        
      
        document.getElementById("car_brand").innerHTML=result[0];
        document.getElementById("registration_number").innerHTML=result[1];
      //  console.log("5")
    }); 
    
    auctionContract.methods.bids(bidder).call().then( (result) => {
      
      var bidEther = web3.utils.fromWei(web3.utils.toBN(result), 'ether');
      document.getElementById("MyBid").innerHTML=bidEther;
    }); 
}

// web3.eth.getBlock("latest").then(function(acc){
//   console.log("lastblock")
//   console.log(acc.transactions);
//   let cad = acc.transactions[0]
//   web3.eth.getTransactionReceipt(cad).then(function (acc) {
//     console.log("ADDR")
//     console.log(acc)
//     console.log("real")
//     console.log(acc.contractAddress)
//   })
// });

// web3.eth.getBlock(1).then(function(acc){
//   console.log("zero")
//   console.log(acc.transactions);
//   let cad = acc.transactions[0]
//   web3.eth.getTransactionReceipt(cad).then(function (acc) {
//     console.log("ADDR")
//     console.log(acc)
//     console.log("real")
//     console.log(acc.contractAddress)
//   })
// });


// web3.eth.defaultAccount = bidder;
var auctionContract =  new web3.eth.Contract(
   [
  {
    "constant": true,
    "inputs": [],
    "name": "Mycar",
    "outputs": [
      {
        "name": "Brand",
        "type": "string"
      },
      {
        "name": "Rnumber",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "get_owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "bid",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "cancel_auction",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdraw",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "bids",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "auction_start",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "highestBidder",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "destruct_auction",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "auction_end",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "STATE",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "highestBid",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_biddingTime",
        "type": "uint256"
      },
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_brand",
        "type": "string"
      },
      {
        "name": "_Rnumber",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "highestBidder",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "highestBid",
        "type": "uint256"
      }
    ],
    "name": "BidEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "withdrawer",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "WithdrawalEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "message",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "time",
        "type": "uint256"
      }
    ],
    "name": "CanceledEvent",
    "type": "event"
  }
]
  );
//var contractAddress = '';
// var auction = auctionContract.at(contractAddress); 
//auctionContract.options.address = contractAddress;

function bid() {
var mybid = document.getElementById('value').value;

auctionContract.methods.bid().send({from: bidder, value: web3.utils.toWei(mybid, "ether"), gas: 200000}).then((result)=>{
  console.log(result)
  // 

  document.getElementById("biding_status").innerHTML+="Successfull bid, transaction ID : "+ result.transactionHash; 

  
});

// Automatically determines the use of call or sendTransaction based on the method type
// auctionContract.methods.bid().call({value: web3.utils.toWei(mybid, "ether"), gas: 200000}, function(error, result){
//   if(error)	
//   {console.log("error is "+ error); 
//   document.getElementById("biding_status").innerHTML="Think to bidding higher"; 
//   }
//   if (!error)
//   document.getElementById("biding_status").innerHTML="Successfull bid, transaction ID"+ result; 
// });
  
} 
	

	
function init(){
 // setTimeout(() => alert("아무런 일도 일어나지 않습니다."), 3000);

 
 
}

var auction_owner=null;
function getOwnser(){
  auctionContract.methods.get_owner().call().then((result)=>{
        console.log("RS:"+result)
        auction_owner=result.toLowerCase();
       if(bidder!=auction_owner){
         $("#auction_owner_operations").hide();
       }else{
        $("#auction_owner_operations").show();
       }
  });
  setSvId();
}
  // auctionContract.methods.get_owner(function(error, result){
	 //  if (!error){
		//   auction_owner=result;
	 //   if(bidder!=auction_owner)
	 //   $("#auction_owner_operations").hide();
	 //  }

// }
// ); 
  
  
function cancel_auction(){
  // .auction_end().call().
// auctionContract.methods.cancel_auction().call().then( (result)=>{
//   console.log(result)
// });
auctionContract.methods.cancel_auction().send({from: bidder, gas: 200000}).then((res)=>{
// auctionContract.methods.cancel_auction().call({from: '0x3211BA2b204cdb231EF5616ec3cAd26043b71394'}).then((res)=>{
console.log(res);
console.log(res.message());
}); 
}



function Destruct_auction(){
// auctionContract.methods.destruct_auction().call().then( (result)=>{
//   console.log(result) //The auction is still open when now() time < auction_end time
// });
auctionContract.methods.destruct_auction().send({from: bidder, gas: 200000}).then((res)=>{
console.log(res);
}); 

}
  
function auctionEvents(){
  auctionContract.events.BidEvent(/*{highestBidder:"A",highestBid:"888"},*/function(error, event){ 
        console.log(event); 
    })
    .on("connected", function(subscriptionId){
        console.log(subscriptionId);
    })
    .on('data', function(event){
        console.log(event); // same results as the optional callback above
        document.getElementById('eventslog').innerHTML += event.returnValues.highestBidder + ' has bidden(' + event.returnValues.highestBid + ' wei)'
        //$("#eventslog").html(event.returnValues.highestBidder + ' has bidden(' + event.returnValues.highestBid + ' wei)');
  
    })
    .on('changed', function(event){
        // remove event from local database
        console.log(event);
    })
  
    // var BidE 
  /*filter.get(callback): Returns all of the log entries that fit the filter.
  filter.watch(callback): Watches for state changes that fit the filter and calls the callback. See this note for details.*/
  // var BidEvent = auctionContract.events.BidEvent(); // var BidEvent = auction.BidEvent(({}, {fromBlock: 0, toBlock: 'latest'});
  
    
  //     BidEvent.watch(function(error, result){
  //             if (!error)
  //                 {
  //                     $("#eventslog").html(result.args.highestBidder + ' has bidden(' + result.args.highestBid + ' wei)');
  //                 } else {
   
  //                     console.log(error);
  //                 }
  //         });
  
  //  auctionContract.events.allEvents({fromBlock: 0}, function(error, event){ console.log(event); })
  // .on("connected", function(subscriptionId){
  //     console.log(subscriptionId);
  // })
  // .on('data', function(event){
  //     console.log(event); // same results as the optional callback above
  // })
  // .on('changed', function(event){
  //     // remove event from local database
  // })
  // .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
      
  // });
  
  
  // var subscription = web3.eth.subscribe('CanceledEvent', function(error, result){
  //     if (!error)
  //         console.log(result);
  // })
  // .on("data", function(transaction){
  //     console.log(transaction);
  // });
  
  // unsubscribes the subscription
  // subscription.unsubscribe(function(error, success){
  //     if(success)
  //         console.log('Successfully unsubscribed!');
  // });
  
  
  
   auctionContract.events.CanceledEvent( function(error, event){ 
    console.log(event); 
    })
    .on("connected", function(subscriptionId){
        console.log(subscriptionId);
    })
    .on('data', function(event){
        console.log(event); // same results as the optional callback above
        document.getElementById('eventslog').innerHTML += event.returnValues.message+' at '+event.returnValues.time
     //$("#eventslog").html(event.returnValues.message+' at '+event.returnValues.time);
    })
    .on('changed', function(event){
        // remove event from local database
    })
    .on('error', function(error, receipt){ // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
     
    });

}


 // var CanceledEvent = auctionContract.events.CanceledEvent();
  
 //    CanceledEvent.watch(function(error, result){
 //            if (!error)
 //                {
	// 				                    console.log(result);

 //                    $("#eventslog").html(result.args.message+' at '+result.args.time);
 //                } else {
 
 //                    console.log(error);
 //                }
 //        });
	
  	 
// const filter = web3.eth.subscribe({
//   fromBlock: 0,
//   toBlock: 'latest',
//   address: contractAddress,
//   topics: [web3.utils.sha3('BidEvent(address,uint256)')]
// }, function(error, result){
//    if (!error)
//   console.log(result);
// })
 
// filter.get((error, result) => {
// 	   if (!error)
//   console.log(result);
//   //console.log(result[0].data);
 
// })