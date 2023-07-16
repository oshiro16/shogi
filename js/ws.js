var username="guest";
var enemyName="";
var myTurn="s";
var connection;
function setUsername(name){
    username=name;
}

function wsConnect(){
    // connection = new WebSocket("ws://localhost:8080/ap/SGWebsocket");
    connection = new WebSocket("wss://tmasy.net/shogi/SGWebsocket");

    connection.onopen=function(e){
        wsSend("usinewgame "+username);
    }
    connection.onmessage=function(message){
        messageManager(message.data);
    }
    
    connection.onerror=function(){
    
    }
    
    connection.onclose=function(){
    
    }
}

function wsSend(message){
    connection.send(message);
}

function messageManager(message){
    // alert(message);
    var data=message.split(" ");
    if(data[0] == "usinewgame"){
        myTurn=data[2];
        enemyName=data[4];
        if(myTurn=="w"){
            createTable("gote");//sente or gote
            loadUSI(iniUSI);
            loadPiece(iniboard);        
        }
        setUserName();
    }
    if(data[0] == "position"){
        moveByUSI(data[2]);
    }
    if(data == "gameover win"){
        endShogi("win");
    }
}

function setUserName(){
    if(myTurn=="b"){
        document.querySelector("#user").innerHTML="先手："+username;
        document.querySelector("#enemy").innerHTML="後手："+enemyName;
    }else{
        document.querySelector("#user").innerHTML="後手："+username;
        document.querySelector("#enemy").innerHTML="先手："+enemyName;
    }

}
