var username="";

function setUsername(){

}

function gameStart(){
    var gamestart=false;
    var connection = new WebSocket("ws://localhost:8080/testServlet/test");

    connection.onopen=function(e){
        connection.send("gameStart");
        connection.start("username");

    }
    connection.onmessage=function(message){
        if(gamestart==false){
            gamestart=true;
        }else{
            
        }
    }
    
    connection.onerror=function(){
    
    }
    
    connection.onclose=function(){
    
    }
    
}





