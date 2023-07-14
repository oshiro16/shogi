/**
 *  画面操作
 * 
 */


var boardDirection="sente";//sente or gote
var pieceChar=["玉","飛","角","金","銀","桂","香","歩","龍","馬","全","圭","杏","と","玉","飛","角","金","銀","桂","香","歩","龍","馬","全","圭","杏","と"];
var pieceCode=["K","R","B","G","S","N","L","P","+R","+B","+S","+N","+L","+P","k","r","b","g","s","n","l","p","+r","+b","+s","+n","+l","+p"];

/******************************************
 * 升目の作成
******************************************/
function createTable(direction){
    boardDirection=direction;
    var standUpTurn="w";
    var standDownTurn="b";
    if(direction=="gote"){
        standUpTurn="b";
        standDownTurn="w";
    }

    var boardHTML="";
    //後手駒台
    boardHTML+="<tr>";
    for(let i=1;i<10;i++){
        boardHTML+=setCell("stand","display","n"+standUpTurn+i,"non","0");
    }
    boardHTML+="</tr>";
    boardHTML+="<tr>";
    for(let i=1;i<10;i++){
        boardHTML+=setCell("stand","display",standUpTurn+i,"non","0");
    }
    boardHTML+="</tr>";

    // 升
    if(boardDirection=="sente"){
        for(let i=1;i<10;i++){
            boardHTML+="<tr>";
            for(let j=1;j<10;j++){
                boardHTML+=setCell("cell","display",j+""+i,"non","0");
            }
            boardHTML+="</tr>";
        }
        }else{
            for(let i=9;i>0;i--){
                boardHTML+="<tr>";
                for(let j=9;j>0;j--){
                    boardHTML+=setCell("cell","display",j+""+i,"non","0");
                }
                boardHTML+="</tr>";
            }
            }

    //先手駒台
    boardHTML+="<tr>";
    for(let i=9;i>0;i--){
        boardHTML+=setCell("stand","display",standDownTurn+i,"non","0");
    }
    boardHTML+="</tr>";
    boardHTML+="<tr>";
    for(let i=9;i>0;i--){
        boardHTML+=setCell("stand","display","n"+standDownTurn+i,"non","0");
    }
    
    var board=document.querySelector("#board");
    board.innerHTML=boardHTML;

    var kifu=document.querySelector('#kifu');
    kifu.innerHTML="";
}

function loadPiece(){
    //駒の配置
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            var piece=table[i][j];
            //成り駒の処理
            //駒のない枡はスキップ
            if(piece != 0){
                setPiece(i,j,piece);
            }
        }
    }
}

//　持ち駒の処理
function loadHolds(){
//持ち駒
    var pos=1;
    var turn="b";
    var hPiece="";
    var cnt=0;
    for(let i=0;i<7;i++){
        if(holds[i]>0){
            hPiece=holdsName[i].toUpperCase();
            cnt=holds[i];
            setPieceOnStand(hPiece,turn,pos,cnt);
            pos++;
        }
    }
    for(let i=pos;i<7;i++){
        setPieceOnStand("non",turn,pos,0);
    }
        pos=1;
        turn="w";
    for(let i=7;i<14;i++){
        if(holds[i]>0){
            hPiece=holdsName[i].toLowerCase();
            cnt=holds[i];
            setPieceOnStand(hPiece,turn,pos,cnt);
            pos++;
        }
    }
    for(let i=pos;i<7;i++){
        setPieceOnStand("non",turn,pos,0);
    }
    
}

/****
 * 駒の操作
 */
function selectCell(e){
    //始まっているかチェック
    if(start==false){
        return;
    }
    if(!(myTurn == turn)){
        return;
    }
    //駒を動かす
    var st=e.getAttribute('st');
    if(st == 'movable'){
        movePiece(e);
        return;
    }

    ////////////////
    //動かす駒を選択
    ///////////////
    var piece=e.getAttribute('piece');
    //駒がないので、選択できない。
    if(piece=='non'){
        return;
    }

    //相手の駒なので、選択できない。
    var tn=e.getAttribute('turn');
    if(tn != turn){
        return;
    }

    //選択可能の時の処理
    var clss=e.getAttribute('class');
    clearStatus();
    var res=false;
    if(e.getAttribute('st')=='display'){
        if(clss == "cell"){
            var res=cellMovablityCheck(e);
        }
        if(clss == "stand"){
            var res=standMovabilityCheck(e);
        }

        if(res){
            e.setAttribute('st','selected');
        }
    }else{
        e.setAttribute('st','display');
    }
}

function movePiece(e){
    var moveUSI=getClickMoveUSI(e);
    kifuUSIList.push(moveUSI);
    moveByUSI(moveUSI);
    wsSend("position moves "+moveUSI);
}

/**
 * 駒をクリックした際に、USIの値を返し、記録する。
 * @param {*} toCell 
 * @returns 
 */
function getClickMoveUSI(toCell){
    var toPos=toCell.getAttribute('pos');
    var y=parseInt(toPos.substr(1,1));

    //移動元情報を取得
    var fmCell=document.querySelector("td[st='selected']");
    var piece=fmCell.getAttribute('piece');//駒の種類
    var fmpos=fmCell.getAttribute('pos');//場所
    var fmclass=fmCell.getAttribute('class');//置き駒　cell,持ち駒　stand

    //成るかどうかの判定
    var nari="";
    var Upiece=piece.toUpperCase();
    //成らないといけない場合
    if(fmclass=="cell" && (Upiece=="N" || Upiece=="L" || Upiece=="P")){
        if((turn == "b" && y == 1) || (turn =="w" && y==9)){
            nari="+";
        }
    }else if(fmclass=="cell" && Upiece=="N"){
        if((turn == "b" && y == 2) || (turn =="w" && y==8)){
            nari="+";
        }
    }
    //成れる場合
    else if(fmclass=="cell" && (Upiece=="R" || Upiece=="B" || Upiece=="S" || Upiece=="N" || Upiece=="L" || Upiece=="P")){
        if((turn == "b" && y<4) || (turn =="w" && y>6)){
            var check=window.confirm("成りますか？");
            if(check){
                nari="+";
            }else{
                nari="-";
            }
        }
    }

    var usiMove="";
    if(fmclass == 'cell'){
        usiMove=posToUsi(fmpos)+posToUsi(toPos)+nari;
    }else{
        usiMove=piece.toUpperCase()+"*"+posToUsi(toPos);
    }

    //usi表記の棋号をkifuに追加する
    if(fmclass == 'cell'){
        appendKifu(fmpos,toPos,nari,piece);
    }else{
        appendKifu(piece.toUpperCase()+"*",toPos,"",piece);
    }
    return usiMove;
}


function moveByUSI(moveUSI){
    var piece="";
    var nari="";

    clearStatus();

    if(moveUSI.length==5){
        nari="+";
    }

    //移動元情報
    
    //持ち駒の場合
    if(moveUSI.substr(1,1)=="*"){
        piece=moveUSI.substr(0,1);
    }else{
    //置き駒の場合
        var fmPos=UsiToPos(moveUSI.substr(0,2));
        var fmCell=document.querySelector("td[pos='"+fmPos+"']");
        piece=fmCell.getAttribute('piece');

    //駒を削除
        fmCell.setAttribute('piece','non');
        fmCell.innerHTML="&nbsp";
        fmCell.setAttribute('st','movedfm');
        fmCell.setAttribute('turn','n');
    }

    //移動先
    var toPos=UsiToPos(moveUSI.substr(2,2));
    var toCell=document.querySelector("td[pos='"+toPos+"']");
    //駒を移動先に置く
        toCell.setAttribute('piece',nari+piece);
        toCell.innerHTML=pieceChar[pieceCode.indexOf(nari+piece)];
        toCell.setAttribute('st','movedto');
        toCell.setAttribute('turn',turn);

    usiMove(moveUSI);
    loadHolds();

    setInfo();

}




/**
 * 駒の移動可能先のチェック
 * @param {*} e 
 */
function cellMovablityCheck(e){
    var pos=e.getAttribute('pos');
    var x=parseInt(pos.substr(0,1));
    var y=parseInt(pos.substr(1,1));
    var posList=movableCells(x-1,y-1);

    if(posList.length>0){
        for(var i=0;i<posList.length;i++){
            setCellMovable(posList[i]);
        }
        return true;
    }else{
        return false;
    }
}

function setCellMovable(pos){
    var x=parseInt(pos.substr(0,1))+1;
    var y=parseInt(pos.substr(1,1))+1;

    var cell=document.querySelector("td[pos='"+x+""+y+"']");
    cell.setAttribute('st','movable');
}


/**
 * 持ち駒の置き場所チェック
 * @param {*} e 
 */
function standMovabilityCheck(e){
    var piece=e.getAttribute('piece');
    var posList=standMovableCells(piece);

    if(posList.length>0){
        for(var i=0;i<posList.length;i++){
            setCellMovable(posList[i]);
        }
        return true;
    }else{
        return false;
    }
}

function  setPiece(x,y,piece){
    var cell=document.querySelector("td[pos='"+(x+1)+""+(y+1)+"']");
    //駒の配置
    cell.setAttribute('piece',piece);
    cell.innerHTML=pieceChar[pieceCode.indexOf(piece)];
    //先手、後手の設定
    if(piece == piece.toUpperCase()){
        cell.setAttribute('turn','b');
    }else{
        cell.setAttribute('turn','w');
    }
}

function setCell(clss,st,pos,piece,cnt){
    var pieceStr="&nbsp";
    if(pieceCode.indexOf(piece)>-1){
        pieceStr=pieceChar[pieceCode.indexOf(piece)];
    }
    strHTML="<td class='"+clss+"' "
                +"st='"+st+"' "
                +"pos='"+pos+"' "
                +"piece='"+piece+"' "
                +"cnt='"+cnt+"' "
                +"turn='n' "
                +"data-dir='"+boardDirection+"' "
                +"onclick='selectCell(this)'>"+pieceStr+"</td>";
    return strHTML;
}
function setPieceOnStand(piece,turn,pos,cnt){
    var stand = document.querySelector("td[pos='"+turn+pos+"']");
        stand.setAttribute('piece',piece);
        stand.setAttribute('turn',turn);
        stand.setAttribute('cnt',cnt);

    if(piece=="non"){
        stand.innerHTML=" ";
    }else{
        stand.innerHTML=pieceChar[pieceCode.indexOf(piece)];
    }

    var nstand = document.querySelector("td[pos='n"+turn+pos+"']");
        nstand.setAttribute('turn',turn);
    if(cnt>1){
        nstand.innerHTML=holds[i];
    }else{
        nstand.innerHTML=" ";
    }
}

function clearStatus(){
    var selectedCell=document.querySelector("td[st='selected']")
    if(selectedCell != null){
        selectedCell.setAttribute('st','display');
    }
    var movableCells=document.querySelectorAll("td[st='movable']")
    if(movableCells != null || movableCells.length>0){
        for(let i=0;i<movableCells.length;i++){
            movableCells[i].setAttribute('st','display');
        }
    }
    var selectedCell=document.querySelector("td[st='movedto']")
    if(selectedCell != null){
        selectedCell.setAttribute('st','display');
    }
    var selectedCell=document.querySelector("td[st='movedfm']")
    if(selectedCell != null){
        selectedCell.setAttribute('st','display');
    }
}



function setInfo(){
    var tturn="先手"
    if(turn=="w"){
        tturn="後手"
    }
    var info=document.querySelector("#info");
    info.innerHTML=tturn+" "+(times+1)+"手目";
}


