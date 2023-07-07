var iniboard="lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1";
const posy2usi=["","a","b","c","d","e","f","g","h","i"];
const posy2kigou=["","一","二","三","四","五","六","七","八","九"];


const kifu=[];

/**
 * 棋譜の記録
 * 
 * 駒の動きを、usi表記にし、kifuTRに追加する
 * 
 * @param {*} fPos 　元の場所
 * @param {*} tPos 　先の場所
 * @param {*} nari 　成りの有無　+
 * @param {*} piece 駒の種類
 */
function appendKifu(fPos,tPos,nari,piece){
    //usi表記の棋号をkifuに追加する
    var move="";
    move=posToUsi(fPos)+posToUsi(tPos)+nari;
    kifu.push(move);

    //棋号を画面に表示
    var kigou=getKigou(fPos,tPos,nari,piece);
    var kifuTD=document.createElement('span');
    kifuTD.innerHTML=kigou+"<br>";
    var kifuTR=document.getElementById('kifu');
    kifuTR.appendChild(kifuTD);

}

/**
 * 棋譜を一つ削除する
 */
function deleteKifu(){
    kifu.pop();
}

/**
 * 棋号を作成して
 * @param {*} fPos 
 * @param {*} tPos 
 * @param {*} nari 
 * @param {*} piece 
 * @returns 
 */
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