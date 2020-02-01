//Finds manyland player object in entity list
function isPlayer(entity){
    if(entity.screenName != undefined)return true
    else return false
}

var player = ig.game.entities.filter(isPlayer)[0]

//Sets up program to detect keypresses because manyland's system is weird...
var keysDown = {}
var toggleCode = []

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
  toggleCode.push(e.keyCode)
},false);
addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
},false);

var speed = 20 //amount of times per second main loop is run

var cliptoggle = false
var flytoggle = false
var speedtoggle = false
var freecamtoggle = false
var gravitytoggle = false

var newgravity = 200

//Main loop
setInterval(function(){
	if(toggleCode.length > 0)
		switch(toggleCode.shift()){
			case 71://g
				cliptoggle = !cliptoggle
			break;
			case 72://h
				flytoggle = !flytoggle
			break;
			case 74://j
				speedtoggle = !speedtoggle
			break;
			case 75://k
				freecamtoggle = !freecamtoggle
			break;
			case 76: //l
				gravitytoggle = !gravitytoggle
			break;
		}
		
	//Perform acts of wizardry
	if(cliptoggle){
		if(38 in keysDown)//up
			player.pos.y -= 16 //Manyland uses a coordinate system originating from the topleft so this is up
		if(40 in keysDown)//down
			player.pos.y += 16
		if(37 in keysDown)//left
			player.pos.x -= 16
		if(39 in keysDown)//right
			player.pos.x += 16
	}
	
	if(flytoggle){
		if(38 in keysDown)//up
			player.vel.y -= 1 
		if(40 in keysDown){//down
			player.vel.y = 0.001 //Has to work this way to prevent fall death
			player.pos.y += 1
		}
		if(37 in keysDown)//left
			player.vel.x -= 1
		if(39 in keysDown)//right
			player.vel.x += 1
		
	}
	
	if(freecamtoggle){
		if(38 in keysDown)//up
			ig.game.camera.offset.y -= 5
		if(40 in keysDown)//down
			ig.game.camera.offset.y += 5
		if(37 in keysDown)//left
			ig.game.camera.offset.x -= 5
		if(39 in keysDown)//right
			ig.game.camera.offset.x += 5
	}
	
	if(speedtoggle){
		if(38 in keysDown)//up
			player.vel.y -= 0.5
		if(40 in keysDown)//down
			player.vel.y += 0.5
		if(37 in keysDown)//left
			player.vel.x -= 0.5
		if(39 in keysDown)//right
			player.vel.x += 0.5
	}
	
	if(gravitytoggle) ig.game.gravity = newgravity
	else gravitytoggle = 800 //default gravity
	
	
	
},1000/speed)