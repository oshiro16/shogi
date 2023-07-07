var turn="b";
var times=0;
var bholds=[0,0,0,0,0,0,0];
var wholds=[0,0,0,0,0,0,0];
var start=false;


function startShogi(){
    createTable();
    loadPiece(iniboard);
    start=true;

    var btn=document.querySelector("#btn");
    btn.innerHTML="投了";
    btn.setAttribute("onclick","endShogi()");
}
function endShogi(){
    start=false;
    
    var btn=document.querySelector("#btn");
    btn.innerHTML="開始";
    btn.setAttribute("onclick","startShogi()");
}




/****
 * 駒の操作
 */
function selectCell(e){
    if(start==false){
        return;
    }
    var piece=e.getAttribute('piece');
    var pos=e.getAttribute('pos');
    var tn=e.getAttribute('turn');
    var clss=e.getAttribute('class');
    var x=parseInt(pos.substr(0,1));
    var y=parseInt(pos.substr(1,1));
    var st=e.getAttribute('st');

    //駒を動かす
    if(st == 'movable'){
        movePiece(e);
        return;
    }

    //駒がないので、選択できない。
    if(piece=='non'){
        return;
    }

    //相手の駒は、動かせない
    if(tn != turn){
        return;
    }

    clearStatus();
    if(e.getAttribute('st')=='display'){
   
        e.setAttribute('st','selected');
    
        if(clss == "cell"){
            cellMovablityCheck(e);
        }
    
        if(clss == "stand"){
            standMovabilityCheck(e);
        }
    }else{
        e.setAttribute('st','display');
    }
}
/**
 * 持ち駒の置き場所チェック
 * @param {*} e 
 */
function standMovabilityCheck(e){
    var min=1;
    var max=10;

    var piece=e.getAttribute('piece');
    if(piece=="N"){
        min=3;
    }else if(piece=="L" || piece=="P"){
        min=2;
    }else if(piece=="n"){
        max=8;
    }else if(piece=="l" || piece=="p"){
        max=9;
    }

    for(let x=1;x<10;x++){
        //二歩のチェック
        var setP=false;
        if(piece=="P" || piece=="p"){
            for(let y=1;y<10;y++){
                var stand=document.querySelector("td[pos='"+x+y+"']");
                if(stand.getAttribute('piece') == piece){
                    setP=true;
                }
            }
        }
        if(!setP){
            for(let y=min;y<max;y++){
                var stand=document.querySelector("td[pos='"+x+y+"']");
                if(stand.getAttribute('piece') == "non"){
                    stand.setAttribute('st','movable');
                }
            }    
        }
    }

}
/**
 * 駒の移動可能先のチェック
 * @param {*} e 
 */
function cellMovablityCheck(e){
    var piece=e.getAttribute('piece');
    var pos=e.getAttribute('pos');
    var x=parseInt(pos.substr(0,1));
    var y=parseInt(pos.substr(1,1));

    if(piece=="K" || piece=="k"){
        ku(x,y);kd(x,y);kr(x,y);kl(x,y);
        kur(x,y);kul(x,y);kdr(x,y);kdl(x,y);
    }

    if(piece=="G" || piece=="+S" || piece=="+N" || piece=="+L" || piece=="+P"){
        ku(x,y);kd(x,y);kr(x,y);kl(x,y);
        kur(x,y);kul(x,y);
    }
    if(piece=="g" || piece=="+s" || piece=="+n" || piece=="+l" || piece=="+p"){
        ku(x,y);kd(x,y);kr(x,y);kl(x,y);
        kdr(x,y);kdl(x,y);
    }

    if(piece=="S"){
        kur(x,y);kul(x,y);kdr(x,y);kdl(x,y);
        ku(x,y);
    }
    if(piece=="s"){
        kur(x,y);kul(x,y);kdr(x,y);kdl(x,y);
        kd(x,y);
    }

    if(piece=="P"){
        ku(x,y);
    }
    if(piece=="p"){
        kd(x,y);
    }

    if(piece=="L"){
        var check="movable";
        var my=y;
        do{
            my=my-1;
            check=setMovable(x,my);
        }while(check == "movable");
    }
    if(piece=="l"){
        var check="movable";
        var my=y;
        do{
            my=my+1;
            check=setMovable(x,my);
        }while(check == "movable");
    }

    if(piece=="R" || piece=="r" || piece=="+R" || piece=="+r"){
        var check="movable";
        var my=y;
        do{
            my=my-1;
            check=setMovable(x,my);
        }while(check == "movable");
    
        my=y;
        do{
            my=my+1;
            check=setMovable(x,my);
        }while(check == "movable");

        var mx=x;
        do{
            mx=mx-1;
            check=setMovable(mx,y);
        }while(check == "movable");
    
        mx=x;			
        do{
            mx=mx+1;
            check=setMovable(mx,y);
        }while(check == "movable");
    }
    if(piece=="+R" || piece=="+r"){
        kur(x,y);kul(x,y);kdr(x,y);kdl(x,y);
    }

    if(piece=="B" || piece=="b" || piece=="+B" || piece=="+b"){
        var check="movable";
        var my=y;
        var mx=x;
        do{
            my=my-1;
            mx=mx-1
            check=setMovable(mx,my);
        }while(check == "movable");
        my=y;
        mx=x;
        do{
            my=my+1;
            mx=mx+1
            check=setMovable(mx,my);
        }while(check == "movable");
        my=y;
        mx=x;

        do{
            my=my+1;
            mx=mx-1
            check=setMovable(mx,my);
        }while(check == "movable");
        my=y;
        mx=x;
        do{
            my=my-1;
            mx=mx+1
            check=setMovable(mx,my);
        }while(check == "movable");    
    }
    if(piece=="+B" || piece=="+b"){
        ku(x,y);kd(x,y);kr(x,y);kl(x,y);
    }

    if(piece=="N"){
        setMovable(x+1,y-2);
        setMovable(x-1,y-2);
    }
    if(piece=="n"){
        setMovable(x-1,y+2);
        setMovable(x+1,y+2);
    }

}


function movePiece(e){
    var piece=e.getAttribute('piece');
    var pos=e.getAttribute('pos');
    var x=parseInt(pos.substr(0,1));
    var y=parseInt(pos.substr(1,1));

    var fm=document.querySelector("td[st='selected']")
    
    clearStatus();

    //移動元情報を取得
    var fmpiece=fm.getAttribute('piece');//駒の種類
    var fmpos=fm.getAttribute('pos');//場所
    var fmclass=fm.getAttribute('class');//置き駒　cell,持ち駒　stand
    var fmtn=fm.getAttribute('turn');
    var fmx=parseInt(fmpos.substr(0,1));
    var fmy=parseInt(fmpos.substr(1,1));
    var fmst=fm.getAttribute('st');

    //成るかどうかの判定
    var nari="";
    var Upiece=fmpiece.toUpperCase();
    if(fmclass=="cell" && (Upiece=="R" || Upiece=="B" || Upiece=="S" || Upiece=="N" || Upiece=="L" || Upiece=="P")){
        if((turn == "b" && y<4) || (turn =="w" && y>6)){
            var check=window.confirm("成りますか？");
            if(check){
                nari="+";
            }
        }
    }

    //相手の駒を取って、手持ちにする
    if(piece != "non"){
        if(turn=="b"){
            getHold(piece.toUpperCase());
        }else{
            getHold(piece.toLowerCase());
        }
    }

    //駒を移動先に置く
    e.setAttribute('piece',nari+fmpiece);
    e.innerHTML=getPieceName(nari+fmpiece);
    e.setAttribute('st','movedto');
    e.setAttribute('turn',turn);

    //移動元から、駒を削除する。
    if(fmclass == 'cell'){
        fm.setAttribute('piece','non');
        fm.innerHTML="&nbsp";
        fm.setAttribute('st','movedfm');
        fm.setAttribute('turn','n');
    }else{
        useHold(fmpiece);
    }

    if(fmclass == 'cell'){
        appendKifu(fmpos,pos,nari,fmpiece);
    }else{
        appendKifu(fmpiece.toUpperCase()+"*",pos,"",fmpiece);
    }

    if(turn=="b"){
        turn="w";
    } else {
        turn="b";
    }

}

/******************************************
 * 升目の作成
******************************************/
function createTable(){

    var boardHTML="";
    var tdHTMLs="<td st='display' piece='non' turn='n' ";
    var tdHTMLe=" onclick='selectCell(this)'>&nbsp</td>";
    //後手駒台
    boardHTML+="<tr>";
    for(let i=1;i<10;i++){
        boardHTML+=tdHTMLs+"class='stand'  cnt='0' pos='nw"+i+"'"+tdHTMLe;
    }
    boardHTML+="</tr>";
    boardHTML+="<tr>";
    for(let i=1;i<10;i++){
        boardHTML+=tdHTMLs+"class='stand'  cnt='0' pos='w"+i+"'"+tdHTMLe;
    }
    boardHTML+="</tr>";

    // 升
    for(let i=1;i<10;i++){
        boardHTML+="<tr>";
        for(let j=1;j<10;j++){
            boardHTML+=tdHTMLs+"class='cell' pos='"+j+i+"'"+tdHTMLe;
        }
        boardHTML+="</tr>";
    }

    //先手駒台
    boardHTML+="<tr>";
    for(let i=9;i>0;i--){
        boardHTML+=tdHTMLs+"class='stand'  cnt='0' pos='b"+i+"'"+tdHTMLe;
    }
    boardHTML+="</tr>";
    boardHTML+="<tr>";
    for(let i=9;i>0;i--){
        boardHTML+=tdHTMLs+"class='stand'  cnt='0' pos='nb"+i+"'"+tdHTMLe;
    }

var board=document.querySelector("#board");
board.innerHTML=boardHTML;

var kifu=document.querySelector('#kifu');
kifu.innerHTML="";


}

function loadPiece(inText){
    var strs  = inText.split(' ');

        turn  = strs[1]; //先手、後手
    var holds = strs[2]; //持ち駒
        times = strs[3]; //手数

    //駒の配置
    var lines=strs[0].split('/');
    for(let i=0;i<9;i++){
        var x=1;
        for(let j=0;j<lines[i].length;j++){
            var piece=lines[i].substr(j,1);
            //成り駒の処理
            if(piece=="+"){
                piece=lines[i].substr(j,2);
                j++
            }
            //駒のない枡はスキップ
            if(!isNaN(piece)){
                x=x+parseInt(piece);
            }else{
                var cell=document.querySelector("td[pos='"+x+(i+1)+"']");
                cell.innerHTML=getPieceName(piece);
                // cell.innerHTML=piece;
                //駒の配置
                cell.setAttribute('piece',piece);
            
                //先手、後手の設定
                if(piece == piece.toUpperCase()){
                    cell.setAttribute('turn','b');
                }else{
                    cell.setAttribute('turn','w');
                }            
                x=x+1;
            }
        }
    }
    loadHolds(holds);
}



//　持ち駒の処理
function loadHolds(holds){
    if(holds == "-"){
        return;
    }


    for(let i=0;i<holds.length;i++){
        var piece=holds.substr(i,1);
            count=1;
            if(!isNaN(piece)){
                count=parseInt(piece);
                piece=holds.substr(i+1,1);
                i++;
            }
            if(piece == "R"){bholds[0]=count}
            if(piece == "B"){bholds[1]=count}
            if(piece == "G"){bholds[2]=count}
            if(piece == "S"){bholds[3]=count}
            if(piece == "N"){bholds[4]=count}
            if(piece == "L"){bholds[5]=count}
            if(piece == "P"){bholds[6]=count}
            if(piece == "r"){wholds[0]=count}
            if(piece == "b"){wholds[1]=count}
            if(piece == "g"){wholds[2]=count}
            if(piece == "s"){wholds[3]=count}
            if(piece == "n"){wholds[4]=count}
            if(piece == "l"){wholds[5]=count}
            if(piece == "p"){wholds[6]=count}
    }
    setAllHolds();
}
function setAllHolds(){
    setHolds(bholds,"b");
    setHolds(wholds,"w");
}

function setHolds(holds,turn){
//持ち駒
    const holdName=["R","B","G","S","N","L","P"];

    pos=1;
    for(let i=0;i<7;i++){
        if(holds[i]>0){
            var tholdName=holdName[i];
            if(turn=="w"){
                tholdName=holdName[i].toLowerCase();
            }

            var stand = document.querySelector("td[pos='"+turn+pos+"']");
                stand.setAttribute('cnt',holds[i]);
                stand.setAttribute('piece',tholdName);
                stand.setAttribute('turn',turn);

                stand.innerHTML=getPieceName(tholdName);
            if(holds[i]>1){
                var nstand = document.querySelector("td[pos='n"+turn+pos+"']");
                nstand.setAttribute('turn',turn);
                nstand.innerHTML=holds[i];
            }
            pos++;
        }
    }
    for(let i=pos;i<7;i++){
        var stand = document.querySelector("td[pos='"+turn+pos+"']");
        stand.setAttribute('cnt',"0");
        stand.setAttribute('piece',"non");
        stand.setAttribute('turn',"n");
        stand.innerHTML=" ";
    }
    
}
