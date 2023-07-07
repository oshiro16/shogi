var iniboard="lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1";
const posy2usi=["","a","b","c","d","e","f","g","h","i"];
const posy2kigou=["","一","二","三","四","五","六","七","八","九"];
const holdName=["R","B","G","S","N","L","P"];


const kifuUSIList=[];
const kifuList=[];

/**
 * 棋譜の記録
 * 
 * 駒の動きを、usi表記にし、kifuTRに追加する
 * 
 * @param {*} fPos 　元の場所
 * @param {*} tPos 　先の場所
 * @param {*} nari 　成りの有無　+　-
 * @param {*} piece 駒の種類
 */
function appendKifu(fPos,tPos,nari,piece){
    //usi表記の棋号をkifuに追加する
    var move="";
    move=posToUsi(fPos)+posToUsi(tPos)+nari;
    kifuUSIList.push(move);

    
    //棋号を画面に表示
    var kigou=getKigou(fPos,tPos,nari,piece);
    kifuList.push(kigou);

    var kifuTD=document.createElement('span');
    kifuTD.innerHTML=(times+1)+" : "+kigou+"<br>";
    var kifuTR=document.getElementById('kifu');
    kifuTR.appendChild(kifuTD);
}

/**
 * 棋譜を一つ削除する
 */
function deleteKifu(){
    kifuUSIList.pop();
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

    if(kifuList.length>0){
        var lastPos=kifuList[kifuList.length-1].substr(1,2);
        if(x+posy2kigou[y] == lastPos){
            kigou=kigou+"同　";
        }else{
            kigou=kigou+x+posy2kigou[y];
        }
    }else{
        kigou=kigou+x+posy2kigou[y];
    }

    kigou+=getPieceName(piece);
    if(fPos.substr(1,1)=="*"){
        kigou+="打";
    }
    if(nari=="+"){
        kigou+="成";
    }
    if(nari=="-"){
        kigou+="不成";
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
function UsiToPos(usi){
    var x=usi.substr(0,1);
    var y=usi.substr(1,1);
    x=10-x;
    var pos=x+""+posy2usi.indexOf(y);
    return pos;
}



function getUSI(){
    var str="";
    var num=0;
    for(var i=0;i<9;i++){
        for(var j=0;j<9;j++){
            if(btable[i][j]==0){
                num++;
            }else{
                if(num>0){
                    str+=num;
                    num=0;
                }
                str+=btable[i][j];
            }
        }
        if(num>0){
            str+=num;
            num=0;
        }
        if(i<8){
            str+="/";
        }
    }

    strHold="";
    for(var i=0;i<bholds.length;i++){
        if(bholds[i]>0){
            if(bholds[i]>1){
                strHold+=bholds[i];
            }
            strHold+=holdName[i];
        }
    }
    for(var i=0;i<wholds.length;i++){
        if(wholds[i]>0){
            if(wholds[i]>1){
                strHold+=wholds[i];
            }
            strHold+=holdName[i].toLowerCase();
        }
    }
    if(strHold.length==0){
        strHold="-";
    }

    return str+" "+turn+" "+strHold+" "+(times+1);
}