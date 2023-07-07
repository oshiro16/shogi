var iniboard="lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1";
const posy2usi=["","a","b","c","d","e","f","g","h","i"];
const posy2kigou=["","一","二","三","四","五","六","七","八","九"];


const kifu=[];

function appendKifu(fPos,tPos,nari,piece){
    var move="";
    move=posToUsi(fPos)+posToUsi(tPos)+nari;
    kifu.push(move);

    var kigou=getKigou(fPos,tPos,nari,piece);
    var kifuTD=document.createElement('span');
    kifuTD.innerHTML=kigou+"<br>";
    var kifuTR=document.getElementById('kifu');
    kifuTR.appendChild(kifuTD);

}

function deleteKifu(){
    kifu.pop();
}
function getKigou(fPos,tPos,nari,piece){
    var kigou="";

    if(turn=="b"){
        kigou="☗";
    }else{
        kigou="☖";
    }

    var x=tPos.substr(0,1);
    var y=tPos.substr(1,1);
    x=10-x;
    kigou=kigou+x+posy2kigou[y];
    kigou+=getPieceName(piece);
    if(fPos.substr(1,1)=="*"){
        kigou+="打";
    }
    if(nari=="+"){
        kigou+="成";
    }
    return kigou;
}

function posToUsi(pos){
    if(pos.substr(1,1)=="*"){
        return pos;
    }

    var x=pos.substr(0,1);
    var y=pos.substr(1,1);
    x=10-x;
    var move=x+posy2usi[y];
    return move;
}