


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

function getHold(gpiece){
    var piece=gpiece.slice(-1);
    if(piece == "R"){bholds[0]=bholds[0]+1}
    if(piece == "B"){bholds[1]=bholds[1]+1}
    if(piece == "G"){bholds[2]=bholds[2]+1}
    if(piece == "S"){bholds[3]=bholds[3]+1}
    if(piece == "N"){bholds[4]=bholds[4]+1}
    if(piece == "L"){bholds[5]=bholds[5]+1}
    if(piece == "P"){bholds[6]=bholds[6]+1}
    if(piece == "r"){wholds[0]=wholds[0]+1}
    if(piece == "b"){wholds[1]=wholds[1]+1}
    if(piece == "g"){wholds[2]=wholds[2]+1}
    if(piece == "s"){wholds[3]=wholds[3]+1}
    if(piece == "n"){wholds[4]=wholds[4]+1}
    if(piece == "l"){wholds[5]=wholds[5]+1}
    if(piece == "p"){wholds[6]=wholds[6]+1}
    setAllHolds();
}
function useHold(gpiece){
    var piece=gpiece.slice(-1);
    if(piece == "R"){bholds[0]=bholds[0]-1}
    if(piece == "B"){bholds[1]=bholds[1]-1}
    if(piece == "G"){bholds[2]=bholds[2]-1}
    if(piece == "S"){bholds[3]=bholds[3]-1}
    if(piece == "N"){bholds[4]=bholds[4]-1}
    if(piece == "L"){bholds[5]=bholds[5]-1}
    if(piece == "P"){bholds[6]=bholds[6]-1}
    if(piece == "r"){wholds[0]=wholds[0]-1}
    if(piece == "b"){wholds[1]=wholds[1]-1}
    if(piece == "g"){wholds[2]=wholds[2]-1}
    if(piece == "s"){wholds[3]=wholds[3]-1}
    if(piece == "n"){wholds[4]=wholds[4]-1}
    if(piece == "l"){wholds[5]=wholds[5]-1}
    if(piece == "p"){wholds[6]=wholds[6]-1}
    setAllHolds();
}

function ku(x,y){
    setMovable(x,y-1);
}
function kd(x,y){
    setMovable(x,y+1);
}
function kr(x,y){
    setMovable(x+1,y);
}
function kl(x,y){
    setMovable(x-1,y);
}
function kur(x,y){
    setMovable(x+1,y-1);
}
function kul(x,y){
    setMovable(x-1,y-1);
}
function kdr(x,y){
    setMovable(x+1,y+1);
}
function kdl(x,y){
    setMovable(x-1,y+1);
}
function setMovable(x,y){
    var mc=document.querySelector("td[pos='"+x+y+"']");

    //升がない場所
    if(mc == null){
        return "no cell";
    }
    //味方の駒のため、動かせない
    if(mc.getAttribute('turn') ==turn){
        return "same turn";
    }
    //駒が置いていない
    if(mc.getAttribute('turn') == "n"){
        mc.setAttribute('st','movable');
        return "movable";
    
    //相手の駒
    }else{
        mc.setAttribute('st','movable');
        return "get piece";
    }
}

function getPieceName(str){
    if(str == "K" || str=="k"){
        return "玉";
    }
    if(str == "R" || str=="r"){
        return "飛";
    }
    if(str == "B" || str=="b"){
        return "角";
    }
    if(str == "G" || str=="g"){
        return "金";
    }
    if(str == "S" || str=="s"){
        return "銀";
    }
    if(str == "N" || str=="n"){
        return "桂";
    }
    if(str == "L" || str=="l"){
        return "香";
    }
    if(str == "P" || str=="p"){
        return "歩";
    }
    if(str == "+R" || str=="+r"){
        return "龍";
    }
    if(str == "+B" || str=="+b"){
        return "馬";
    }
    if(str == "+S" || str=="+s"){
        return "全";
    }
    if(str == "+N" || str=="+n"){
        return "圭";
    }
    if(str == "+L" || str=="+l"){
        return "杏";
    }
    if(str == "+P" || str=="+p"){
        return "と";
    }
    return "駒";
}
