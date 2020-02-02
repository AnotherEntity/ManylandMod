//Finds manyland player object in entity list
function isPlayer(entity){
    if(entity.screenName != undefined)return true
    else return false
}

var player = ig.game.entities.filter(isPlayer)[0]

//Sets up program to detect keypresses because manyland's system is weird...
var keysDown = {} //Detects which keys are held (continuous event)
var toggleCode = [] //Detects which keys were pushed (one time event)

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
  toggleCode.push(e.keyCode)
},false);
addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
},false);

var speed = 20 //amount of times per second main loop is run

var clipToggle = false
var flyToggle = false
var teleportToggle = false
var freecamToggle = false
var gravityToggle = false

var newGravity = 2400

var prevPos = player.pos

var code = {
	g:71, //g key
	h:72, //h key
	j:74, //j key
	k:75, //k key
	l:76, //l key
	up:38,  //up arrow key
	down:40, //down arrow key
	left:37, //left arrow key
	right:39 //right  arrow key
}

//For some reason if you just put it in body it turns the whole screen white or black
var gui = document.createElement("div");
gui.id = "manylandmodlist"
gui.style.position = "fixed"
gui.style.left = 10
gui.style.top = 10
gui.zIndex = 99999
document.body.appendChild(gui);


//Main loop
setInterval(function(){
	if(toggleCode.length > 0)
		switch(toggleCode.shift()){ //Determines what mods should be disabled or enabled
			case code.g:
				clipToggle = !clipToggle
			break;
			case code.h:
				flyToggle = !flyToggle
			break;
			case code.j:
				teleportToggle = !teleportToggle
			break;
			case code.k:
				freecamToggle = !freecamToggle
				prevPos = player.pos //Records location to lock player to
				ig.game.camera.offset.x = -304.75 //Resets camera position
				ig.game.camera.offset.y = -173
			break;
			case code.l:
				gravityToggle = !gravityToggle
			break;
		}
		
	//Perform acts of wizardry
	var modList = "" //Gui list of mods, not implemented yet
	
	if(gravityToggle){ 
		modList += "gravity \n"
		ig.game.gravity = newGravity
	} else newGravity = 800 //default gravity
	
	if(clipToggle){
		modList += "clip \n"
		
		player.vel = {x:0,y:0}
		if(code.up in keysDown)
			player.pos.y -= 16 //Manyland uses a coordinate system originating from the topleft so this is up
		if(code.down in keysDown)
			player.pos.y += 16
		if(code.left in keysDown)
			player.pos.x -= 16
		if(code.right in keysDown)
			player.pos.x += 16
	}
	
	if(flyToggle){
		ig.gravity = 0
		player.vel.y = -1
		
		modList += "fly \n"
		if(code.up in keysDown)
			player.pos.y -= 5
		if(code.down in keysDown){
			player.vel.y = -0.001 //Has to have a velocity moving upward otherwise it will kill you for falling
			player.pos.y += 5
		}
		if(code.left in keysDown)
			player.vel.x -= 2
		if(code.right in keysDown)
			player.vel.x += 2
		
	}
	
	if(teleportToggle){
		modList += "teleport \n"
		
		if(code.up in keysDown){
			player.vel = {x:0,y:0}
			player.pos.y -= 100
			teleportToggle = false
		}
		if(code.down in keysDown){
			player.vel = {x:0,y:0}
			player.pos.y += 100
			teleportToggle = false
		}
		if(code.left in keysDown){
			player.vel = {x:0,y:0}
			player.pos.x -= 100
			teleportToggle = false
		}
		if(code.right in keysDown){
			player.vel = {x:0,y:0}
			player.pos.x += 100
			teleportToggle = false
		}
		
		
	}
	
	if(freecamToggle){ //Moves camera around while keeping player in one position
		modList += "freecam \n"
	
		player.vel = {x:0,y:0}
		player.pos = prevPos
		
		if(code.up in keysDown)
			ig.game.camera.offset.y -= 10
		if(code.down in keysDown)
			ig.game.camera.offset.y += 10
		if(code.left in keysDown)
			ig.game.camera.offset.x -= 10
		if(code.right in keysDown)
			ig.game.camera.offset.x += 10
		
		prevPos = player.pos
	}
		modList += "gravity \n"
	
	
	document.getElementById("manylandmodlist").innerHTML = modList
	
},1000/speed)