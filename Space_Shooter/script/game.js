/***Game****/
	var gameManager={
		gameTime:0,
		lastTime:0,
		isGameOver:false,
		score:0,
		keyPressed:0,
		sceneTime:0,
		resetGame:function(){
			this.gameTime=0;
			this.lastTime=Date.now();
			this.isGameOver=false;
			this.score=0;
			enemies=[];
			entities=[];
			asteroids=[];
			soundManager.stopAll();
		},
		initGame:function(){
			createGameArea(gameField);
			player=createPlayer();
			screenManager.showScore(this.score);
			screenManager.showRockets(player.rockets);
			enemies=createEnemies(1,4);
			for(let i=0;i<enemies.length;i++){
					enemies[i].x=mainArea.canvas.width-5;
					enemies[i].y=mainArea.canvas.height/2+(enemies[i].height+10)*(i-2);
					enemies[i].angle=180;
					enemies[i].updatePath();
				}
			entities=entities.concat(enemies);
			asteroids=[];
			asteroids=createAsteroids(90,gameManager.gameTime);
			entities=entities.concat(asteroids);
			soundManager.repeat('bgSound');
			soundManager.play('bgSound');			
		},
		updateGame:function(){
			var currentTime=Math.round(this.gameTime*100)/100;
			enemies=[];
			asteroids=[];
			
			if(this.gameTime==0){
							
			}
			else if (currentTime==10.00){
				enemies=[];
				let count=3;
				for(let i=0;i<count;i++){
					enemies=createEnemies(2,count);
				}
				for(let i=0;i<enemies.length;i++){
					enemies[i].x=mainArea.canvas.width-5;
					enemies[i].y=mainArea.canvas.height/2+100*(i-2);
					enemies[i].angle=180;
					enemies[i].updatePath();
				}
				entities=entities.concat(enemies);
			}
			else if(currentTime==20.00){
				enemies=[];
				let count=2;
				for(let i=0;i<count;i++){
					enemies=createEnemies(3,count);
				}
				for(let i=0;i<enemies.length;i++){
					enemies[i].x=mainArea.canvas.width-5;
					enemies[i].y=mainArea.canvas.height/2+150*(2*i-1);
					enemies[i].angle=180;
					enemies[i].updatePath();
				}
				entities=entities.concat(enemies);
			}
			else if(currentTime==30.00){
				enemies=[];
				let count=1;
				for(let i=0;i<count;i++){
					enemies=createEnemies(4,count);
				}
				for(let i=0;i<enemies.length;i++){
					enemies[i].x=mainArea.canvas.width-5;
					enemies[i].y=mainArea.canvas.height/2-100;
					enemies[i].angle=180;
					enemies[i].updatePath();
				}
				entities=entities.concat(enemies);
			}
			else if( (currentTime==15.00) || (currentTime==30.00) || (currentTime==45.00) || (currentTime==60.00) ) {
				asteroids=[];
				asteroids=createAsteroids(90,currentTime);
				entities=entities.concat(asteroids);
			}
			this.sceneTime=this.gameTime;
			
		},
		renderGame:function(){
			mainArea.clear();
			player.draw(mainArea);
			for(let i=0;i<entities.length;i++){
				entities[i].draw(mainArea);
			}
			for(let i=0;i<explosions.length;i++){
				explosions[i].draw(mainArea);
				explosions[i].type++;
			}
		},
		startGame:function(){
			this.resetGame();
			this.initGame();
			this.updateGame();
			this.renderGame();
			this.handle=window.requestAnimationFrame(mainLoop);
		},
		pauseGame:function(){
			this.isGameOver=true;
			soundManager.pause('bgSound');	
			window.cancelAnimationFrame(this.handle);
		},
		continueGame:function(){
			this.isGameOver=false;
			this.lastTime=Date.now();
			soundManager.play('bgSound');	
			this.handle=window.requestAnimationFrame(mainLoop);
		},
		stopGame:function(result){
			this.isGameOver=true;
			window.cancelAnimationFrame(this.handle);
			screenManager.setActive(finishScreen,result);
			soundManager.stop('bgSound');	
			soundManager.play(result);
		}
	}
	
		
	/***Start Game***/

	function mainLoop(){
		if(gameManager.isGameOver){
			return;
		}
		var now = Date.now();
		var dt = (now - gameManager.lastTime) / 1000;
		
		/***Check bounds***/
		
		player.checkBounds(mainArea.gameField);
		for(let i=0;i<entities.length;i++){
			if (entities[i].checkBounds(mainArea.gameField)){
				entities.splice(i,1);
				i--;
			}
		}	
		
		/***Check Collisions***/
		
		/**Player with other***/
		for(let i=0;i<entities.length;i++){
			if(!entities[i].name.startsWith('rocket')){
				if(isCollision(entities[i], player)){
					createExplosion(player, entities[i]); //add explosions
					player.state='kill';
					entities[i].state='kill';
				}
			}
		}	
		
		/**Entities with each other***/
		
		for(let i=0;i<entities.length;i++){
			if(entities[i].state=='kill'){
				continue;
			}
			for(let j=0;j<entities.length;j++){
				if( (i==j) || (entities[j].state=='kill') ){
					continue;
				}
				if(isCollision(entities[i], entities[j])){
					if( (entities[i].name.startsWith('enemy') && entities[j].name.startsWith('rocket')) || (entities[j].name.startsWith('enemy') && entities[i].name.startsWith('rocket'))){
						gameManager.score++;
						screenManager.showScore(gameManager.score);
					}
					createExplosion(entities[i], entities[j]); //add explosions
					entities[i].state='kill';
					entities[j].state='kill';
				}	
			}	
		}	
		
		/*** Check Keydown***/
		if(gameManager.keyPressed){
			if(gameManager.keyPressed=='left'){
				player.rotate('left');
			}
			if(gameManager.keyPressed=='right'){
				player.rotate('right');
			}
			if(gameManager.keyPressed=='up'){
				player.move('up');
			}
			if(gameManager.keyPressed=='down'){
				player.move('down');
			}
			if(gameManager.keyPressed=='stop'){
				player.state='stop';
			}
			if(gameManager.keyPressed=='move'){
				player.state='move';
			}
			if(gameManager.keyPressed=='stop_move'){
				if (player.state=='move'){
					player.state='stop';
				}
				else if (player.state=='stop'){
					player.state='move';
				}
			}
			if(gameManager.keyPressed=='fire'){
				rocket=createRocket(player);
				entities.push(rocket);
				screenManager.showRockets(player.rockets);
			}
		}
		gameManager.keyPressed=false;
		
		/***Player state***/
		switch(player.state){
			case 'move':{
				player.update(dt);
				break;
			}
			case 'stop':{
				break;
			}
			case 'kill':{
				gameManager.stopGame('lose');
				break;
			}
		}
		
		/***Update All***/
			
		for(let i=0;i<entities.length;i++){
			if(entities[i].state=='kill'){
				entities.splice(i,1);
				i--;
			}
			else{
				entities[i].update(dt);	
			}
		}
		
		for(let i=0;i<explosions.length;i++){
			if(explosions[i].type>explosions[i].frames){
				explosions.splice(i,1);
				i--;
			}
		}
		
		gameManager.renderGame();
		gameManager.lastTime = now;
		gameManager.gameTime+=dt;
		gameManager.updateGame();		
		gameManager.handle=window.requestAnimationFrame(mainLoop);
	}
	