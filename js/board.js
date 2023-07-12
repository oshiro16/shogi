/**
 * USIによる、盤面の操作
 * 
 */
const startpos="lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL";

var table=[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];
var holds=[0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var holdsName=["R","B","G","S","N","L","P","r","b","g","s","n","l","p"];
var turn="s"; //s b w e
var times=0;
var usiMoveName=["a","b","c","d","e","f","g","h","i"];


function resetBoard(){
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            table[i][j]=0;
        }
    }
    for(let i=0;i<14;i++){
        holds[i]=0;
        turn="b";
        times=0;
    }
}

/**
 * USI ex.
 *  position sfen xxx/xxxx/xxxx w - 1 moves yyyy yyyy
 *  position startpos moves xx
 * @param {*} usi 
 */
function loadUSI(usi){
    var strs=usi.split(' ');
    
    var dBoard="";
    if(strs[1] == "startpos"){
        dBoard=startpos;
        turn="b";
        times=0;
    }else{
        dBoard=strs[2];
        turn = parts[3]; //手番（b/w）
        times = parseInt(strs[5])-1; //手数
        setHolds(strs[4]); //持ち駒
    }
    setBoard(dBoard);

    //「moves」
    var movesPos=strs.indexOf("moves");
    if(strs.length>movesPos+1){
        for(var i=movesPos+1;i<strs.length;i++){
            usiMove(strs[i]);
        }
    }
}

/**
 * USIにより、盤面の駒を動かす。
 * 
 * USIの移動
 * 移動元
 * 　打ちは、駒＊ 先手も後手も大文字
 * 　ex. 2f
 * 移動先
 * 　成りは、最後に＋
 * @param  usiMove 
 */
function usiMove(usiMove){
    var piece="";


    //持ち駒の場合
    if(usiMove.substr(1,1)=="*"){
        piece=usiMove.substr(0,1);
        if(turn == "w"){
            piece=piece.toLowerCase();
        }
        holds[holdsName.indexOf(piece)]--;
    }else{
    //置き駒の場合
        var str=usiMove.substr(0,2);
        var fmPos=convUSIPos(str);
        piece=table[fmPos[0]][fmPos[1]];
        //駒を削除
        table[fmPos[0]][fmPos[1]]=0;
    }

    //移動先
    var toPos=convUSIPos(usiMove.substr(2,2));
    var getPiece=table[toPos[0]][toPos[1]];

    //相手の駒を取って、手持ちにする
    if(getPiece!=0){
        //敵の駒を味方に変え、「成り」から戻す
        getPiece=changePiece(getPiece).slice(-1);
        holds[holdsName.indexOf(getPiece)]++;
    }

    //駒を移動先に置く
    if(usiMove.length==5){
        table[toPos[0]][toPos[1]]="+"+piece;
    }else{
        table[toPos[0]][toPos[1]]=piece;
    }

    if(turn=="b"){
        turn="w";
    } else {
        turn="b";
    }
    times++;
}


function setBoard(sfen){
    //駒の配置
    var lines=sfen.split('/');
    for(let i=0;i<9;i++){
        var x=1;
        for(let j=0;j<lines[i].length;j++){

            var piece=lines[i].substr(j,1);

            //駒のある時の処理
            if(isNaN(piece)){
            //成り駒の処理
                if(piece=="+"){
                    piece=lines[i].substr(j,2);
                    j++
                }
                table[x-1][i]=piece;
                x++;
            }else{
            //駒のない時の処理
                var n=parseInt(piece);
                for(let k=0;k<n;k++){
                    table[x-1][i]=0;
                    x++;
                }
            }
        }
    }
}
function setHolds(sfen){
    if(sfen == "-"){
        return;
    }

    for(let i=0;i<sfen.length;i++){
        var piece=sfen.substr(i,1);

            //持ち駒の数の計算
            count=1;
            if(!isNaN(piece)){
                count=parseInt(piece);
                piece=sfen.substr(i+1,1);
                i++;
            }
            //持ち駒数をセット
            sfen[holdsName.indexOf(piece)]=count;
    }
}


function convUSIPos(usiPos){
    var xstr=usiPos.substr(0,1);
    var ystr=usiPos.substr(1,1);
    var x=9-parseInt(xstr);
    var y=usiMoveName.indexOf(ystr);
    pos=[x,y];
    return pos;
}
function changePiece(piece){
    if(piece == piece.toUpperCase()){
        return piece.toLowerCase();
    }else{
        return piece.toUpperCase();
    }
}


function movableCells(x,y){
    var pos=[];
    var piece=table[x][y];
    if(piece == 0){
        return pos;
    }
    if(piece=="K" || piece=="k"){
        pos=pos.concat(mvrlud(x,y));
        pos=pos.concat(mvurdl(x,y));
    }

    if(piece=="G" || piece=="+S" || piece=="+N" || piece=="+L" || piece=="+P"
     || piece=="g" || piece=="+s" || piece=="+n" || piece=="+l" || piece=="+p"){
        pos=pos.concat(mvrlud(x,y));
    }
    if(piece=="G" || piece=="+S" || piece=="+N" || piece=="+L" || piece=="+P"){
        var result=mvur(x,y);
        if(result!=""){
            pos.push(result);
        }
            result=mvul(x,y);
        if(result!=""){
            pos.push(result);
        }
    }
    if(piece=="g" || piece=="+s" || piece=="+n" || piece=="+l" || piece=="+p"){
        var result=mvdr(x,y);
        if(result!=""){
            pos.push(result);
        }
            result=mvdl(x,y);
        if(result!=""){
            pos.push(result);
        }
    }

    if(piece=="S" || piece=="s"){
        pos=pos.concat(mvurdl(x,y));
    }
    if(piece=="S"){
        var result=mvu(x,y);
        if(result!=""){
            pos.push(result);
        }
    }
    if(piece=="s"){
        var result=mvd(x,y);
        if(result!=""){
            pos.push(result);
        }
    }

    if(piece=="P"){
        var result=mvu(x,y);
        if(result!=""){
            pos.push(result);
        }
    }
    if(piece=="p"){
        var result=mvd(x,y);
        if(result!=""){
            pos.push(result);
        }
    }

    if(piece=="L"){
        pos=pos.concat(mvup(x,y));
    }
    if(piece=="l"){
        pos=pos.concat(mvdown(x,y));
    }

    if(piece=="R" || piece=="r" || piece=="+R" || piece=="+r"){
        pos=pos.concat(mvtateyoko(x,y));
    }

    if(piece=="+R" || piece=="+r"){
        pos=pos.concat(mvurdl(x,y));
    }

    if(piece=="B" || piece=="b" || piece=="+B" || piece=="+b"){
        pos=pos.concat(mvnaname(x,y));
    }
    if(piece=="+B" || piece=="+b"){
        pos=pos.concat(mvrlud(x,y));
    }

    if(piece=="N"){
        pos=pos.concat(mvkeiUp(x,y));
    }
    if(piece=="n"){
        pos=pos.concat(mvkeiDown(x,y));
    }

    return pos;

}
function mvu(x,y){
    var result=mvdir(x,y-1);
    if(result=="no piece" || result=="enemy piece"){
        return x+""+(y-1);
    }else{
        return "";
    }
}
function mvd(x,y){
    var result=mvdir(x,y+1);
    if(result=="no piece" || result=="enemy piece"){
        return x+""+(y+1);
    }else{
        return "";
    }
}
function mvr(x,y){
    var result=mvdir(x+1,y);
    if(result=="no piece" || result=="enemy piece"){
        return (x+1)+""+y;
    }else{
        return "";
    }
}
function mvl(x,y){
    var result=mvdir(x-1,y);
    if(result=="no piece" || result=="enemy piece"){
        return (x-1)+""+y;
    }else{
        return "";
    }
}
function mvur(x,y){
    var result=mvdir(x+1,y-1);
    if(result=="no piece" || result=="enemy piece"){
        return (x+1)+""+(y-1);
    }else{
        return "";
    }
}
function mvul(x,y){
    var result=mvdir(x-1,y-1);
    if(result=="no piece" || result=="enemy piece"){
        return (x-1)+""+(y-1);
    }else{
        return "";
    }
}
function mvdr(x,y){
    var result=mvdir(x+1,y+1);
    if(result=="no piece" || result=="enemy piece"){
        return (x+1)+""+(y+1);
    }else{
        return "";
    }
}
function mvdl(x,y){
    var result=mvdir(x-1,y+1);
    if(result=="no piece" || result=="enemy piece"){
        return (x-1)+""+(y+1);
    }else{
        return "";
    }
}

function mvup(x,y){
    return mvline(x,y,0,-1);
}
function mvdown(x,y){
    return mvline(x,y,0,1);
}
function mvrlud(x,y){
    var pos=[];
    var result=mvu(x,y);
    if(result!=""){
        pos.push(result);
    }
        result=mvd(x,y);
    if(result!=""){
        pos.push(result);
    }
        result=mvr(x,y);
    if(result!=""){
        pos.push(result);
    }
    var result=mvl(x,y);
    if(result!=""){
        pos.push(result);
    }
    return pos;
}
function mvurdl(x,y){
    var pos=[];
    var result=mvur(x,y);
    if(result!=""){
        pos.push(result);
    }
        result=mvul(x,y);
    if(result!=""){
        pos.push(result);
    }
        result=mvdr(x,y);
    if(result!=""){
        pos.push(result);
    }
    var result=mvdl(x,y);
    if(result!=""){
        pos.push(result);
    }
    return pos;
}

function mvtateyoko(x,y){
    var pos1=mvline(x,y,0,-1);
    var pos2=mvline(x,y,0,1);
    var pos3=mvline(x,y,1,0);
    var pos4=mvline(x,y,-1,0);
    pos1=pos1.concat(pos2,pos3,pos4);
    return pos1;
}
function mvnaname(x,y){
    var pos1=mvline(x,y,1,1);
    var pos2=mvline(x,y,1,-1);
    var pos3=mvline(x,y,-1,1);
    var pos4=mvline(x,y,-1,-1);
    pos1=pos1.concat(pos2,pos3,pos4);
    return pos1;
}
function mvkeiUp(x,y){
    var pos=[];
    var result=mvdir(x+1,y-2);
    if(result=="no piece" || result=="enemy piece"){
        pos.push((x+1)+""+(y-2));
    }
        result=mvdir(x-1,y-2);
    if(result=="no piece" || result=="enemy piece"){
        pos.push((x-1)+""+(y-2));
    }
    return pos;
}
function mvkeiDown(x,y){
    var pos=[];
    var result=mvdir(x+1,y+2);
    if(result=="no piece" || result=="enemy piece"){
        pos.push((x+1)+""+(y+2));
    }
        result=mvdir(x-1,y+2);
    if(result=="no piece" || result=="enemy piece"){
        pos.push((x-1)+""+(y+2));
    }
    return pos;
}


function mvline(x,y,px,py){
    var pos=[];
    var result="";
    do{
        x=x+px;
        y=y+py;
        result=mvdir(x,y);
        if(result=="no piece" || result=="enemy piece"){
            pos.push(x+""+y);
        }
    }while(result=="no piece");
    return pos;
}
function mvdir(x,y){
    if(x>8 || x<0 || y>8 || y<0 ){
        return "out of bounds";
    }
    var piece=table[x][y];
    if(piece==0){
        return "no piece";
    }
    var tturn="";
    if(piece==piece.toUpperCase()){
        tturn="b";
    }else{
        tturn="w";
    }
    if(turn==tturn){
        return "same piece";
    }else{
        return "enemy piece";
    }
}

/**
 * 持ち駒の置き場所チェック
 * @param {*} e 
 */
function standMovableCells(piece){
    var pos=[];
    var min=0;
    var max=8;

    if(piece=="N"){
        min=2;
    }else if(piece=="L" || piece=="P"){
        min=1;
    }else if(piece=="n"){
        max=6;
    }else if(piece=="l" || piece=="p"){
        max=7;
    }

    for(let x=0;x<=8;x++){
        //二歩のチェック
        var nifuCheck=false;
        if(piece=="P" || piece=="p"){
            for(let y=0;y<9;y++){
                if(table[x][y]==piece){
                    nifuCheck=true;
                }
            }
        }
        if(nifuCheck==false){
            for(let y=min;y<=max;y++){
                if(table[x][y] == 0){
                    pos.push(x+""+y);
                }
            }    
        }
    }
    return pos;
}
