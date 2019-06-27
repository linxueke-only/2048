function setCookie(cookieName,value,date){
	document.cookie = cookieName+"="+value+";expires="+date.toGMTString();
}
function getCookie(cookieName){
			//将document.cookie保存在变量cookie中
			var cookie = document.cookie;
			//在cookie中查找cookieName的位置保存在i中
			var i = cookie.indexOf(cookieName);
			//如果i等于-1
			if(i==-1){
				return null;//返回null
			}//fz
			else{
				//i+cookieName的长度+1，保存在starti中
				var starti = i+cookieName.length+1;
				//从starti开始，查找下一个;的位置endi
				var endi = cookie.indexOf(";",starti);
				//如果endi是-1
				if(endi==-1){
					//截取cookie中starti到结尾的剩余内容，返回
					return cookie.slice(starti);
				}//否则
				else{
					//截取cookie中starti到endi的内容，返回
					return cookie.slice(starti,endi);
				}
			}
		}	
var game = {
	RN:4,CN:4,//总行数总列数
	data:null,//保存游戏格子数据的二维数组
	score:0,//游戏得分
	state:1,//保存游戏状态----->起名
	GAMEOVER:0,//表示游戏结束状态
	RUNNING:1,//表示游戏运行中
	top:0,//保存游戏最该分
	/*强调1:方法中只要使用对象属性都加this
		  2:每个属性与方法用逗号分隔*/
	
	start:function(){//游戏启动
		//获得cookie中的top变量值，保存在top中(如果top变量的值无效，用0代替  ----用或做)
		this.top = getCookie("top")||0;
		this.state =this.RUNNING;//重置游戏状态为RUNNING
		this.score=0;//游戏重置的0
			//创建空数组，保存在data属性中
			//r从0开始到<RN结束
				//创建空数组保存在data中r中
				//c从0开始，到<CN结束
					//设置data中r行c列的值为0
					//鼠标放在data上,4行*4列的二维数组
		this.data = [];
		for(var r=0;r<this.RN;r++){
			this.data[r]=[];
			for(var c=0;c<this.CN;this.data[r][c]=0,c++);
		}
		//在二维数组中生成两个随机数
		this.randomNum();
		this.randomNum();
		this.updateView();//更新页面
		//console.log(this.data.join("\n"));
		//debugger;
		//为页面绑定键盘按下事件
		document.onkeydown = function(e){//回调函数
			//事件处理函数中，this默认事件绑定到的对象
			//alert(e.keyCode);
			switch(e.keyCode){
				case 37:this.moveLeft();break;//this指document
				case 38:this.moveUp();break;
				case 39:this.moveRight();break;
				case 40:this.moveDown();break;
			}
		}.bind(/*start方法的this*/this);
	},

	move:function(callback){
		//将data转为String，保存在before中
		var before = String(this.data);
		callback();
		//将data转为String，保存在after中
		//如果before不等于after
		  //随机生成一个数
		  //更新页面
		var after = String(this.data);
		if(before!=after){
			this.randomNum();
			//如果游戏结束
			if(this.isGAMEOVER()){
				//修改游戏状态为GAMEOVER 
				this.state = this.GAMEOVER;
				//判断：如果score>top 
				if(this.score>this.top){
					//获得当前时间，将now+1年
					var now =new Date();
					now.setFullYear(now.getFullYear()+1);
					//才将score写入cookie中的top变量，设置过期日期为我now--->调用set
					setCookie("top",this.score,now);
				}
			}
			this.updateView();
		}
	},
	isGAMEOVER:function(){
		//遍历data中每个元素
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
			  //如果当前元素是0，就返回false
			  if(this.data[r][c]==0){
				  return false;
			  }
			  //否则，如果c<CN-1&&当前元素等于右侧元素
			  else if(c<this.CN-1&&(this.data[r][c]==this.data[r][c+1])){			
				return false;//就返回false
			  }//否则，如果r<RN-1&&当前元素等于下方元素
			  else if(r<this.RN-1&&(this.data[r][c]==this.data[r+1][c])){
				return false;//就返回false
			  }
			}
		}//(遍历结束)
		return true;//返回true	
	},

	moveLeft:function(){//左移所有行
		//遍历data中每一行
		  //调用moveLeftInRow方法，传入r
		this.move(function(){
			for(var r=0;r<this.RN;r++){
				this.moveLeftInRow(r);
			}
		}.bind(/*moveLeft*/this));	
	},
	moveLeftInRow:function(r){//左移第r行
		//c从0开始，到<CN-1结束
		  //调用getNextInRow方法,传入参数r,c, 将返回值保存在变量nextc中
		  //如果nextc是-1,退出循环
		  //否则
			//如果r行c位置的值是0
			  //就将r行c位置的值替换为nextc位置的值
			  //将nextc位置的值置为0
			  //c留在原地
			//如果r行c位置的值等于r行nextc位置的值
			  //将r行c位置的值*2
			  //将nextc位置的值置为0
		for(var c=0;c<this.CN-1;c++){
			var nextc = this.getNextInRow(r,c);
			if(nextc == -1){
				break;
			}
			else{
				if(this.data[r][c]==0){
					this.data[r][c] = this.data[r][nextc];
					this.data[r][nextc]= 0;
					c--; 
				}
				else if(this.data[r][c] == this.data[r][nextc]){
					this.data[r][c]*=2;
					//将r行c列的新值累加到score的属性上
					this.score+=this.data[r][c];
					this.data[r][nextc] = 0;
				}
			}
		}
	},
	//获得r行c列右侧下一个不为0的位置
	getNextInRow:function(r,c){
		//c+1
		//c<CN结束,c++
		  //如果r行c位置不是0
			//返回c
		//(遍历结束)
		//返回-1
		c++;
		for(;c<this.CN;c++){
			if(this.data[r][c]!=0){
				return c;
			}
		}
		return -1;
	},
	moveRight:function(){//右移所有行
		//遍历data中每一行
		  //调用moveRightInRow右移第r行
		//(遍历后)
		this.move(function(){
			for(var r=0;r<this.RN;r++){
				this.moveRightInRow(r);
			}
		}.bind(/*moveRight*/this));	
	},
	moveRightInRow:function(r){//左移第r行
		//c从CN-1开始，到>0结束,c每次递减1
		  //调用getPrevInRow方法，查找r行c列前一个不为0的位置，保存在prevc中
		  //如果prevc等于-1，就退出循环
		  //否则
			//如果r行c位置的值为0
			  //将r行c位置的值替换为prevc位置的值
			  //将prevc位置的值置为0
			  //c留在原地
			//否则，如果r行c位置的值等于r行prevc位置的值
			  //将r行c位置的值*2
			  //将prevc位置的值置为0
		for(var c=this.CN-1;c>0;c--){
			var prevc = this.getPrevInRow(r,c);
			if(prevc == -1){
				break;
			}
			else{
				if(this.data[r][c]==0){
					this.data[r][c] = this.data[r][prevc];
					this.data[r][prevc]= 0;
					c++; 
				}
				else if(this.data[r][c] == this.data[r][prevc]){
					this.data[r][c]*=2;
					//将r行c列的新值累加到score的属性上
					this.score+=this.data[r][c];
					this.data[r][prevc] = 0;
				}
			}
		}
	},
	//查找r行c列右侧下一个不为0的位置
	getPrevInRow:function(r,c){
		//c-1
		//循环,c>=0,c每次递减1
		  //如果c位置的值不为0
			//返回c
		//(遍历结束)
		//返回-1
		c--;
		for(;c>=0;c--){
			if(this.data[r][c]!=0){
				return c;
			}
		}
		return -1;
	},
	moveUp:function(){//上移所有行
		//为data拍照保存在before中
		//遍历data中每一列
			//调用moveUpInCol上移第c列
	    //为data拍照保存在after中
		//如果before不等于after
			//随机生成数
			//更新页面
		this.move(function(){
			for(var c=0;c<this.CN;c++){
				this.moveUpInCol(c);
			}	
		}.bind(/*moveUp*/this));	
	},
	moveUpInCol:function(c){
		//r从0开始,到r<RN-1结束，r每次递增1
		  //查找r行c列下方下一个不为0的位置nextr
		  //如果没找到,就退出循环
		  //否则  
			//如果r位置c列的值为0
			  //将nextr位置c列的值赋值给r位置
			  //将nextr位置c列置为0
			  //r留在原地
			//否则，如果r位置c列的值等于nextr位置的值          
		  //将r位置c列的值*2
			  //将nextr位置c列的值置为0
		for(var r=0;r<this.RN-1;r++){
			var nextr = this.getNextInCol(r,c);
			if(nextr == -1){
				break;
			}
			else{
				if(this.data[r][c]==0){
					this.data[r][c] = this.data[nextr][c];
					this.data[nextr][c]= 0;
					r--; 
				}
				else if(this.data[r][c] == this.data[nextr][c]){
					this.data[r][c]*=2;
					//将r行c列的新值累加到score的属性上
					this.score+=this.data[r][c];
					this.data[nextr][c] = 0;
				}
			}
		}
	},
	getNextInCol:function(r,c){
		//r+1
		//循环，到<RN结束，r每次递增1
		  //如果r位置c列不等于0
			//返回r
		//(遍历结束)
		//返回-1
		r++;
		for(;r<this.RN;r++){
			if(this.data[r][c]!=0){
				return r;
			}
		}
		return -1;
	},

	moveDown:function(){
	  //为data拍照保存在before中
	  //遍历data中每一列
		//调用moveDownInCol下移第c列
	  //为data拍照保存在after中
	  //如果before不等于after
		//随机生成数
		//更新页面
		this.move(function(){
			for(var c=0;c<this.CN;c++){
				this.moveDownInCol(c);
			}	
		}.bind(/*moveDown*/this));	
	},
	moveDownInCol:function(c){
		//r从RN-1开始，到r>0结束，r每次递减1
		  //查找r位置c列上方前一个不为0的位置prevr
		  //如果没找到,就退出循环
		  //否则  
			//如果r位置c列的值为0
			  //将prevr位置c列的值赋值给r位置
			  //将prevr位置c列置为0
			  //r留在原地
			//否则，如果r位置c列的值等于prevr位置的值
			  //将r位置c列的值*2
			  //将prevr位置c列置为0
		for(var r=this.RN-1;r>0;r--){
			var prevr = this.getPrevInCol(r,c);
			if(prevr == -1){
				break;
			}
			else{
				if(this.data[r][c]==0){
					this.data[r][c] = this.data[prevr][c];
					this.data[prevr][c]= 0;
					r++; 
				}
				else if(this.data[r][c] == this.data[prevr][c]){
					this.data[r][c]*=2;
					//将r行c列的新值累加到score的属性上
					this.score+=this.data[r][c];
					this.data[prevr][c] = 0;
				}
			}
		}
	},
	getPrevInCol:function(r,c){
		//r-1
		//循环，r到>=0结束，每次递减1
		  //如果r位置c列不等于0
			//返回r
		//(遍历结束)
		//返回-1
		r--;
		for(;r>=0;r--){
			if(this.data[r][c]!=0){
				return r;
			}
		}
		return -1;
	},

	//将数组每个元素跟新到页面div中
	updateView:function(){
		//遍历data中每个元素
			//找到页面上id为"c"+r+c的div
			//如果当前元素不是0
				//设置div的内容为当前元素值
				//设置div的className 为“cell n”+当前元素
			//否则
				//设置div内容为""
				//设置div的className的值为cell
		for(var r=0;r<this.RN;r++ ){
			for(var c=0;c<this.CN;c++){
				var div = document.getElementById("c"+r+c);
				if(this.data[r][c]!=0){
					div.innerHTML = this.data[r][c];
					div.className = "cell n"+this.data[r][c];
				}else{
					div.innerHTML = "";
					div.className = "cell";
				}
			}
		}
		//找到id为score的元素，设置其内容为score属性  把分数显示到页面
		document.getElementById("score")
			    .innerHTML = this.score;
		//如果游戏状态为结束
		if(this.state==this.GAMEOVER){
		  //找到id为gameOver的元素，设置其显示
		  document.getElementById("gameOver")
				  .style.display="block";
		  //找到id为fScore的元素，设置其内容为score属性
		  document.getElementById("fScore")
				  .innerHTML=this.score;
		}else{//否则
		  //找到id为gameOver的元素，设置其隐藏
		  document.getElementById("gameOver")
				  .style.display="none";
		}
		//设置id为topScore的内容为top属性
		document.getElementById("topScore")
				.innerHTML = this.top;
		debugger;
	},
	//在一个随机位置生成一个2或4
	randomNum:function(){
		//反复
			//在0~RN-1之间生成一个随机整数r
			// Math.floor(Math.random()*(max+1))
			//在0~CN-1之间生成一个随机整数c
			//如果data中r行c列的值是0
				//设置data中r行c列的值为：
					//随机生成一个0-1的小数，如果<0.5，就赋值为2，否则赋值为4
					//退出循环
		while(true){			
			var r = Math.floor(Math.random()*((this.RN-1)+1));
			var c = Math.floor(Math.random()*((this.CN-1)+1));
			if(this.data[r][c]==0){
				this.data[r][c] = Math.random()<0.5?2:4;
				break;
			}
		}
	}
}
game.start();//启动游戏