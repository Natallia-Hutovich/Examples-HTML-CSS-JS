  
 var soundManager={
	 repeat:function(name){
		audioCache[name].addEventListener('ended', ()=>{
			this.play(name);
		});	
	 },
	 play:function(name){
		audioCache[name].play(); 
	 },
	 pause:function(name){
		 audioCache[name].pause(); 
	 },
	 stop:function(name){
		 let sound=audioCache[name];
		 sound.pause(); 
		 sound.currentTime = 0;
	 },
	 stopAll:function(){
		 for(let key in audioCache){
			 this.stop(key);
		 }
	 }
 }

 