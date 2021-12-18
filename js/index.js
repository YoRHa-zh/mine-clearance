function Mine(tr,td,mineNum){
    this.tr=tr;
    this.td=td;
    this.mineNum=mineNum;


    this.squares=[];
    this.tds=[];
    this.surplusMine=mineNum;
    this.allRight=false;
    this.parent=document.querySelector('.gameBox');

}
Mine.prototype.randomNum=function(){
var square=new Array(this.tr*this.td);
for(var i=0;i<square.length;i++){
    square[i]=i;
}
square.sort(function(){return 0.5-Math.random()})
// console.log(square)
return square.slice(0,this.mineNum)
}

Mine.prototype.init=function(){
    var rn=this.randomNum();   //雷在格子里的位置
    var n=0;//找到格子对应的索引
// this.randomNum();
for(var i=0;i<this.tr;i++){
    this.squares[i]=[];
    for(var j=0;j<this.td;j++){
        // this.squares[i][j]=;
      
        if(rn.indexOf(++n)!=-1){
            this.squares[i][j]={type:'mine',x:j,y:i};
        }else{
            this.squares[i][j]={type:'number',x:j,y:i,value:0};
            
        }
    }
}

// console.log(this.squares)
this.updateNum();
this.createDom();

this.parent.oncontextmenu=function(){
    return false;
}
}
Mine.prototype.createDom=function(){
    var This = this;
    var table=document.createElement('table');
    for(var i=0;i<this.tr;i++){
        var domTr=document.createElement('tr');
        this.tds[i]=[];
        for(var j=0;j<this.td;j++){
            var domTd=document.createElement('td');
            // domTd.innerHTML=null;
           


            domTd.pos=[i,j];
            // if(this.squares[i][j].type=='mine'){
            //     domTd.className='mine'
            // }
            // if(this.squares[i][j].type=='number'){
            //     domTd.innerHTML=this.squares[i][j].value;
            // }
            domTd.onmousedown=function(){
                This.play(event,this)
            }
            this.tds[i][j]=domTd;
           

            domTr.appendChild(domTd);
        }
        table.appendChild(domTr);
    }
    this.parent.appendChild(table);
}

//找某个方格周围的八个方格
Mine.prototype.getAround=function(square){
    var x=square.x;
    var y=square.y;
    var result=[];//把找到格子的坐标返回出去（二维数组）

/*
x-1,y-1 x,y-1 x+1,y-1    
x-1,y   x,y   x+1,y
x-1,y-1 x,y+1 x+1,y+1
*/
//通过坐标循环九宫格
for(var i=x-1;i<=x+1;i++){
    for(var j=y-1;j<=y+1;j++){
        if(
            i<0||
            j<0||
            i>this.td-1 ||
            j>this.tr-1 ||
            (i==x && j==y) ||
            this.squares[j][i].type=='mine'
        ){
            continue;
        }
        result.push([j,i]);//要以行与列的形式返回出去，因为到时候需要用它去取数组里的数据
    }
}
    return result;
}
//更新所有的数字

Mine.prototype.updateNum=function(){
    for(var i=0;i<this.tr;i++){
        for(var j=0;j<this.td;j++){
            //只更新的是雷周围的数字
            if(this.squares[i][j].type=='number'){
                continue;
            }
            var num=this.getAround(this.squares[i][j]);//获取到每一个雷周围的数字
            // console.log(num);
            for(var k=0;k<num.length;k++){
                this.squares[num[k][0]][num[k][1]].value+=1;
            }
        }
    }
    
}
Mine.prototype.play=function(ev,obj){
    var This=this;
    if(ev.which==1){
        // console.log(obj);

        var curSquare=this.squares[obj.pos[0]][obj.pos[1]];
        var cl=['zero','one','two','three','four','five','six','seven','eight']

        if(curSquare.type=='number'){
           
            obj.innerHTML=curSquare.value;
            obj.className=cl[curSquare.value];
            if(curSquare.value==0){
                obj.innerHTML='';

                function getAllZero(square){
                    var around=This.getAround(square);
                    for(var i=0;i<around.length;i++){
                        var x=around[i][0];
                        var y=around[i][1];

                        This.tds[x][y].className=cl[This.squares[x][y].value];

                        if(This.squares[x][y].value==0){
                           if(!This.tds[x][x].check){
                            This.tds[x][y].check=true;
                            getAllZero(This.squares[x][y]);

                           }

                        }
                        else{

                            This.tds[x][y].innerHTML=This.squares[x][y].value;
                        }
                    }
                }
                getAllZero(curSquare);

            }
            // console.log('数字')

        }else{


            // console.log('雷')
        }
        
    }
// console.log(obj);
}


var mine = new Mine(28,28,99);
mine.init();
// console.log(mine.getAround(mine.squares[0][0]))
