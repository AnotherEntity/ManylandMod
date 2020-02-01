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

var cliptoggle = false
var flytoggle = false
var teleporttoggle = false
var freecamtoggle = false
var gravitytoggle = false

var newgravity = 2400

var prevpos = player.pos

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
//document.getElementById("canvas").innerHTML += `<div id="manylandmodlist" style="position:fixed;left:5px;top:5px;z-index:99999;opacity:1;"></div>`

//Main loop
setInterval(function(){
	if(toggleCode.length > 0)
		switch(toggleCode.shift()){ //Determines what mods should be disabled or enabled
			case code.g:
				cliptoggle = !cliptoggle
			break;
			case code.h:
				flytoggle = !flytoggle
			break;
			case code.j:
				teleporttoggle = !teleporttoggle
			break;
			case code.k:
				freecamtoggle = !freecamtoggle
				prevpos = player.pos
				ig.game.camera.offset.x = -304.75 //Resets camera position
				ig.game.camera.offset.y = -173
			break;
			case code.l:
				gravitytoggle = !gravitytoggle
			break;
		}
		
	//Perform acts of wizardry
	var modlist = "" //Gui list of mods
	
	if(cliptoggle){
		modlist += "clip \n"
		
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
	
	if(flytoggle){
		player.vel.y = -1
		modlist += "fly \n"
		if(code.up in keysDown)
			player.pos.y -= 3
		
		if(code.down in keysDown){
			player.vel.y = -0.001 //Has to work this way to prevent fall death
			player.pos.y += 3
		}
		if(code.left in keysDown)
			player.vel.x -= 2
		if(code.right in keysDown)
			player.vel.x += 2
		
	}
	
	if(teleporttoggle){
		modlist += "teleport \n"
		
		if(code.up in keysDown){
			player.vel = {x:0,y:0}
			player.pos.y -= 100
			teleporttoggle = false
		}
		if(code.down in keysDown){
			player.vel = {x:0,y:0}
			player.pos.y += 100
			teleporttoggle = false
		}
		if(code.left in keysDown){
			player.vel = {x:0,y:0}
			player.pos.x -= 100
			teleporttoggle = false
		}
		if(code.right in keysDown){
			player.vel = {x:0,y:0}
			player.pos.x += 100
			teleporttoggle = false
		}
		
		
	}
	
	if(freecamtoggle){ //Moves camera around
		modlist += "freecam \n"
	
		player.vel = {x:0,y:0}
		player.pos = prevpos
		
		if(code.up in keysDown)
			ig.game.camera.offset.y -= 10
		if(code.down in keysDown)
			ig.game.camera.offset.y += 10
		if(code.left in keysDown)
			ig.game.camera.offset.x -= 10
		if(code.right in keysDown)
			ig.game.camera.offset.x += 10
		
		prevpos = player.pos
	}
		
	if(gravitytoggle){ 
		modlist += "gravity \n"
		ig.game.gravity = newgravity
	} else gravitytoggle = 800 //default gravity
	
	
	//document.getElementById("manylandmodlist").innerHTML = modlist
	
},1000/speed)