var maxtimes=0;
var start=false;

var iniUSI="position startpos moves";

function startShogi(){
    createTable("sente");//sente or gote
    loadUSI(iniUSI);
    loadPiece(iniboard);
    start=true;

    var btn=document.querySelector("#btn");
    btn.innerHTML="投了";
    btn.setAttribute("onclick","endShogi('lose')");

    wsConnect();
}

function endShogi(result){
    start=false;
    if(result == "lose"){
        wsSend("gameover lose");
    }
    if(result == "win"){

    }
    if(result == "draw"){

    }

    var btn=document.querySelector("#btn");
    btn.innerHTML="開始";
    btn.setAttribute("onclick","startShogi()");
}


