var sceneManager={
	lastRandomTime:0,
	resetScenes:function(){
		for(let i=0;i<gameScenes.length;i++){
			gameScenes[i].done=false;
		};
		this.lastRandomTime=0;
	},
	checkScene:function(scene,sceneTime,area){
		if(scene<gameScenes.length){
			var currentScene=gameScenes[scene];
			if ( (!currentScene.done) && (sceneTime>currentScene.time) ){
				this.runScene(currentScene,area);
				return true;
			}
		}
		return false;
	},
	checkRandomScene:function(sceneTime,area){
		let dt=randomInt(15,20);
		if((sceneTime-this.lastRandomTime)>dt){
			setAsteroids(sceneTime, area, ASTEROID_SETTINGS.height);
			this.lastRandomTime=sceneTime;
		}
	},
	isFinishScene:function(scene){
		return (scene>=gameScenes.length);
	},
	runScene:function(scene, area){
		if(scene.enemy_type){
			setEnemies(scene.enemy_type, area, 15);
			scene.done=true;
		}
	}
}

function countShips(area, type, shiftY){
	var shipHeight;
	for(let i=0;i<ENEMIES_SHIP_SETTINGS.length;i++){
		if (ENEMIES_SHIP_SETTINGS[i].type==type){
			shipHeight=ENEMIES_SHIP_SETTINGS[i].height;
			break;
		}
	}
	return Math.floor((area.canvas.height-shiftY*2)/(shipHeight+shiftY));
}

function setEnemiesPosition(area,enemies,shiftY){
	let count=enemies.length;
	let startY=(area.canvas.height/2+shiftY/2)-(enemies[0].height+shiftY)*count/2;
	for(let i=0;i<count;i++){
		enemies[i].x=area.canvas.width-5;	
		enemies[i].y=startY+(enemies[i].height+shiftY)*i;
		enemies[i].angle=180;
		enemies[i].updatePath();
	}	
}

function setAsteroids(time, area, shiftX){
	var asteroid;
	var type=randomInt(1,ASTEROID_SETTINGS.types);
	var name='asteroid'+'_'+time;
	asteroid=createAsteroids(type, name);
	asteroid.x=shiftX+Math.random()*(area.canvas.width-2*shiftX);
	asteroid.angle=90;
	asteroid.updatePath();
	entities.push(asteroid);
}

function setEnemies(type, area, shiftY){
	let enemies=[];
	let maxCount=countShips(area, type, shiftY);
	let minCount=Math.ceil(maxCount/2);
	let count=randomInt(minCount,maxCount);
	enemies=createEnemies(type,count);	
	setEnemiesPosition(area, enemies, shiftY);
	entities=entities.concat(enemies);
}

function randomInt(min,max){
	return Math.floor(min + Math.random() * (max-min));
}
