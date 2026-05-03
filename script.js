const canvas = document.querySelector(".game")
const ctx = canvas.getContext("2d") //configurando o canvas

const cenas = ["level_teste_1", "level_teste_2"]
let cena_atu = cenas[0]

const direita_button = document.querySelector(".direita")
const esquerda_button = document.querySelector(".esquerda")
const action_button = document.querySelector(".action")

let version = window.confirm("você está jogando num pc?")

//texturas

const player_skin_1 = new Image
player_skin_1.src = "static/cube_skin_1.png"

const wave_skin_1 = new Image
wave_skin_1.src = "static/wave_skin_1.png"

const yellow_orb_skin_1 = new Image
yellow_orb_skin_1.src = "static/yellow_orb.png"

const pink_orb_skin_1 = new Image
pink_orb_skin_1.src = "static/pink_orb.png"

const orange_orb_skin_1 = new Image
orange_orb_skin_1.src = "static/orange_orb.png"

const spike_skin_1 = new Image
spike_skin_1.src = "static/spike_1.png"

const end_skin_1 = new Image
end_skin_1.src = "static/end_skin_1.png"

const speed_portal_skin_1 = new Image
speed_portal_skin_1.src = "static/speed_portal_1.png"

const speed_portal_skin_2 = new Image
speed_portal_skin_2.src = "static/speed_portal_2.png"

const speed_portal_skin_3 = new Image
speed_portal_skin_3.src = "static/speed_portal_3.png"

const wave_portal_1 = new Image
wave_portal_1.src = "static/wave_portal.png"

function draw_cube(x, y, width, height, color, alpha, contorno, stroke_color, stroke_size) {

	if (contorno == false) {

		ctx.globalAlpha = alpha
		ctx.fillStyle = color
		ctx.fillRect(x, y, width, height)	

	}else{

		ctx.globalAlpha = alpha
		ctx.fillStyle = color
		ctx.fillRect(x, y, width, height)
		ctx.strokeStyle = stroke_color
		ctx.lineWidth = stroke_size
		ctx.lineJoin = 'round';

	}

}

function draw_image(image, x, y, width, height, alpha, algle, eixoX, eixoY) {

	if (algle != undefined || eixoX != undefined || eixoY != undefined) {

		ctx.save();

		ctx.translate(eixoX, eixoY);

		ctx.rotate(algle * Math.PI / 180);

		ctx.globalAlpha = alpha

		ctx.drawImage(image, -width/2, -height/2, width, height);

		ctx.restore()

	}else{

		ctx.globalAlpha = alpha

		ctx.drawImage(image, x, y, width, height);

	}

}

function colisao(obj1_x, obj1_y, obj1_width, obj1_height,obj2_x, obj2_y, obj2_width, obj2_height, funcao) {

	if (obj1_x < obj2_x + obj2_width &&
		obj1_x + obj1_width > obj2_x &&
		obj1_y < obj2_y + obj2_height &&
		obj1_y + obj1_height > obj2_y
		) {

		funcao()

	}

}

function draw_alto_x_img(image, x, y, width, height, alpha, intervalo, number) {

	let inter = intervalo
	intervalo = 0

	for (let num = 0; num < number; ++num) {

		draw_image(image, x+intervalo, y, width, height, alpha)

		intervalo += inter

	}

}

function draw_alto_y_img(image, x, y, width, height, alpha, intervalo, number) {

	let inter = intervalo
	intervalo = 0

	for (let num = 0; num < number; ++num) {

		draw_image(image, x, y+intervalo, width, height, alpha)

		intervalo += inter

	}

}

function draw_alto_cube(x, y, width, height, color, alpha, intervalo, number, dir, intervalo_2) {

	let inter = intervalo
	let inter_2 = intervalo_2
	intervalo = 0
	intervalo_2 = 0

	for (let num = 0; num < number; ++num) {

		if (dir == "x") {

			draw_cube(x+intervalo, y, width, height, color, alpha)

		}else if (dir == "y") {

			draw_cube(x, y+intervalo, width, height, color, alpha)

		}else if (dir == "xy") {

			draw_cube(x+intervalo, y, width, height, color, alpha)
			draw_cube(x, y+intervalo, width, height, color, alpha)

		}else if (dir == "XY") {

			draw_cube(x+intervalo, y, width, height, color, alpha)
			draw_cube(x, y+intervalo_2, width, height, color, alpha)

		}

		intervalo += inter
		intervalo_2 += inter_2

	}

}

// verifica se há colisão

let transicao = {

	x:0,
	y:0,
	width:canvas.width,
	height:canvas.height,
	alpha:10,
	color:"black",
	transi_num:2,
	funcao:null,
	vel:1,
	fede_in() {

		teclas[""] = false

		if (transicao.alpha < 10) {

			transicao.alpha+=transicao.vel

		}else if (transicao.alpha == 10) {

			if (transicao.funcao != null) {

				transicao.funcao()

			}

			transicao.transi_num = 0
			transicao.funcao = null

		}
	
	},
	fede_out() {

		teclas[""] = false

		if (transicao.alpha > 0) {

			transicao.alpha-=transicao.vel

		}else if (transicao.alpha == 0) {

			if (transicao.funcao != null) {

				transicao.funcao()

			}

			transicao.transi_num = 0
			transicao.funcao = null

		}

	}

}

let player
let blocos
let objetos
let camera
let estados
let frames = {atual:1, prev:1}
let background

const teclas = {}
let inputs = ["d", "a", "w", " "]

canvas.style.width = "85vw"
canvas.style.height = "auto"
canvas.style.maxHeight = "100vh"

if (version == false) {

	direita_button.addEventListener("touchstart", function() {teclas[inputs[1]] = true})
	direita_button.addEventListener("touchend", function() {teclas[inputs[1]] = false})

	esquerda_button.addEventListener("touchstart", function() {teclas[inputs[0]] = true})
	esquerda_button.addEventListener("touchend", function() {teclas[inputs[0]] = false})

	action_button.addEventListener("touchstart", function() {teclas[inputs[2]] = true})
	action_button.addEventListener("touchend", function() {teclas[inputs[2]] = false})

}else if (version == true) {

	document.addEventListener("keydown", e => teclas[e.key] = true)
	document.addEventListener("keyup", e => teclas[e.key] = false)

	direita_button.style.opacity = 0
	esquerda_button.style.opacity = 0
	action_button.style.opacity = 0

}else{

	location.reload()

}

function level_1() {

	estados = {

		gravity:1,
		speed:5,
		prev:[1,5]

	}
	
	camera = {

		x:0,
		y:-100,
		spd:5,
		acc:0.5,
		prevX:0,
		prevY:0,
		hspd:0,
		vspd:0,
		grav:8,
		kilos:0.8,
		canmove:[true, true]

	}

	player = {

		x:500,
		y:300,
		width:65,
		height:65,
		alpha:1,
		jump_force:-15 * estados.gravity,
		dead:false,
		morrer() {

			if (player.dead == false) {

				player.dead = true

				setTimeout(function() {level_1()}, 3000);

				camera.spd = 0
				camera.grav = 0
				camera.kilos = 0
				camera.hspd = 0
				camera.vspd = 0
						
				for (let i = 0; i < objetos.length; i++) {

					objetos[i].hitalpha = 0.5

				}

			}

		}

	}

	blocos = [

		{inicial:[-500, 550],x:-500, y:550, width:2800, height:500, color:"black", alpha:1}, //chão
		{inicial:[310, 300],x:310, y:300, width:250, height:250, color:"black", alpha:1},
		{inicial:[1110, 350],x:1110, y:350, width:350, height:200, color:"black", alpha:1},
		{inicial:[1460, -200],x:1460, y:-150, width:300, height:800, color:"black", alpha:1},
		{select:0}

	]

	objetos = [

		{inicial:[1010, 320],x:1010, y:320, width:60, height:60, color:"green", alpha:1, orb_force:-15*estados.gravity, type:"orb", hitalpha:0}, //0
		{inicial:[610, 250],x:610, y:250, width:60, height:60, color:"green", alpha:1, orb_force:-10*estados.gravity, type:"orb", hitalpha:0}, //1
		{inicial:[810, 380],x:810, y:380, width:60, height:60, color:"green", alpha:1, orb_force:-20*estados.gravity, type:"orb", hitalpha:0}, //2
		{inicial:[570, 490],x:570, y:490, width:530, height:40, color:"red", alpha:1, type:"spike", hitalpha:0},               //3
		{inicial:[1300, 220],x:1300, y:220, width:70, height:95, color:"black", alpha:1, destino_cena:1, type:"end", hitalpha:0}, //4
		{inicial:[-500, 490],x:-500, y:490, width:800, height:40, color:"red", alpha:1, type:"spike", hitalpha:0},               //5

	]

}

function level_2() {

	cena_atu = cenas[1]

	estados = {

		gravity:1,
		speed:1,
		prev:[1,1]

	}
	
	camera = {

		x:0,
		y:0,
		spd:8 * estados.speed,
		acc:0.5,
		prevX:0,
		prevY:0,
		hspd:0,
		vspd:0,
		grav:8 * estados.gravity,
		kilos:0.8 * estados.gravity,
		canmoveX:true,
		canmoveY:false

	}

	player = {

		x:300,
		y:400,
		width:65,
		height:65,
		hspd:0,
		vspd:0,
		prevX:300,
		prevY:400,
		alpha:1,
		hitalpha:0,
		jump_force:-15 * estados.gravity,
		dead:false,
		gamemode:1,
		algle:0,
		algle_add:45,
		chao:true,
		skin:player_skin_1,
		morrer() {

			if (player.dead == false) {

				player.dead = true

				setTimeout(function() {level_2()}, 3000);

				camera.spd = 0
				camera.grav = 0
				camera.kilos = 0
				camera.hspd = 0
				camera.vspd = 0
				player.hspd = 0
				player.vspd = 0
				player.hitalpha = 0.5
						
				for (let i = 0; i < objetos.length; i++) {

					objetos[i].hitalpha = 0.5

				}

			}

		}

	}

	blocos = [

		{inicial:[null, 500] ,x:0, y:500, width:1000, height:500, color:"black", alpha:1}, //chão
		{inicial:[1800, 440],x:1800, y:440, width:500, height:60, color:"black", alpha:1},
		{inicial:[2300, 440],x:2300, y:380, width:700, height:120, color:"black", alpha:1},
		//{inicial:[3800, 460],x:3800, y:460, width:70, height:100, color:"black", alpha:1},
		{select:0}

	]

	objetos = [

		{inicial:[900, 443],x:900, y:443, width:32, height:45, skin_size:75, color:"red", alpha:1, type:"spike", hitalpha:0},
		{inicial:[975, 443],x:990, y:443, width:32, height:45, skin_size:75, color:"red", alpha:1, type:"spike", hitalpha:0},
		{inicial:[2245, 383],x:2245, y:383, width:32, height:45, skin_size:75, color:"red", alpha:1, type:"spike", hitalpha:0},
		{inicial:[2555, 323],x:2555, y:323, width:32, height:45, skin_size:75, color:"red", alpha:1, type:"spike", hitalpha:0},
		{inicial:[2555, 323],x:2555, y:323, width:32, height:45, skin_size:75, color:"red", alpha:1, type:"spike", hitalpha:0},
		{inicial:[3030, 440],x:3030, y:440, width:400, height:45, skin_size:75, color:"red", alpha:1, number:6, space:75,type:"mult-spike", hitalpha:0},
		{inicial:[3150, 240],x:3150, y:240, width:60, height:60, color:"green", alpha:1, orb_force:-15 * estados.gravity, type:"orb", skin:yellow_orb_skin_1, hitalpha:0},
		{inicial:[3600, 360],x:3600, y:360, width:60, height:140, color:"green", alpha:1, speed:12*estados.speed,type:"speed-portal", skin:speed_portal_skin_2, hitalpha:0},
		{inicial:[4000, 440],x:4000, y:440, width:180, height:45, skin_size:75, color:"red", alpha:1, number:3, space:75,type:"mult-spike", hitalpha:0},
		{inicial:[4300, 360],x:4300, y:360, width:60, height:140, color:"green", alpha:1, speed:8*estados.speed,type:"speed-portal", skin:speed_portal_skin_1, hitalpha:0}

	]

	background = {

		inicial:[50,50],
		x:50,
		y:50,
		width:100,
		height:100,
		color:{c1:[130, 130, 255], c2:[60, 60, 200], c3:[0, 0, 255], all:["", ""]},
		alpha:0.5,
		space:200,
		number:7

	}

}

function draw() {

	ctx.clearRect(0,0, canvas.width, canvas.height)

	if (cena_atu == cenas[0]) {

		for (let i = 0; i <= blocos.length-1; i++) {

			draw_cube(blocos[i].x, blocos[i].y, blocos[i].width, blocos[i].height, blocos[i].color, blocos[i].alpha, false, 0, 0)

		}

		for (let i = 0; i <= objetos.length-1; i++) {

			draw_cube(objetos[i].x, objetos[i].y, objetos[i].width, objetos[i].height, objetos[i].color, objetos[i].hitalpha, false, 0, 0)

		}

		draw_cube(player.x, player.y, player.width, player.height, "orange", 0, false,0,0)

		draw_image(yellow_orb_skin_1, objetos[0].x, objetos[0].y, objetos[0].width, objetos[0].height, objetos[0].alpha)
		draw_image(pink_orb_skin_1, objetos[1].x, objetos[1].y, objetos[1].width, objetos[1].height, objetos[1].alpha)
		draw_image(orange_orb_skin_1, objetos[2].x, objetos[2].y, objetos[2].width, objetos[2].height, objetos[2].alpha)

		draw_image(end_skin_1, objetos[4].x, objetos[4].y, objetos[4].width, objetos[4].height, objetos[4].alpha)

		draw_alto_x_img(spike_skin_1, 561  - camera.x, 475  - camera.y, 75, 75, 1, 79, 7)

		draw_alto_x_img(spike_skin_1, -475  - camera.x, 475  - camera.y, 75, 75, 1, 79, 10)

		draw_image(player_skin_1, player.x, player.y, player.width, player.height, player.alpha)

	}else if (cena_atu == cenas[1]) {

		background.color.all[0] = `${background.color.c1[0]}, ${background.color.c1[1]}, ${background.color.c1[2]}`
		background.color.all[1] = `${background.color.c2[0]}, ${background.color.c2[1]}, ${background.color.c2[2]}`
		background.color.all[2] = `rgb(${background.color.c3[0]}, ${background.color.c3[1]}, ${background.color.c3[2]})`

		canvas.style.background = `linear-gradient(to bottom, rgb(${background.color.all[0]}), rgb(${background.color.all[1]}))`

		draw_alto_cube(background.x, background.y, background.width, background.height, background.color.all[2], background.alpha, background.space, background.number, "x")
		draw_alto_cube(background.x, background.y+background.space, background.width, background.height, background.color.all[2], background.alpha, background.space, background.number, "x")
		draw_alto_cube(background.x, background.y+background.space*2, background.width, background.height, background.color.all[2], background.alpha, background.space, background.number, "x")

		for (let i = 0; i <= blocos.length-1; i++) {

			draw_cube(blocos[i].x, blocos[i].y, blocos[i].width, blocos[i].height, blocos[i].color, blocos[i].alpha, false, 0, 0)

		}

		for (let i = 0; i <= objetos.length-1; i++) {

			if (objetos[i].type == "spike") {

				draw_image(spike_skin_1 , objetos[i].x-23, objetos[i].y-18, objetos[i].skin_size, objetos[i].skin_size, objetos[i].alpha)

			}else if (objetos[i].type == "mult-spike") {

				draw_alto_x_img(spike_skin_1 , objetos[i].x-20, objetos[i].y-15, objetos[i].skin_size, objetos[i].skin_size, objetos[i].alpha, objetos[i].space, objetos[i].number)

			}else if (objetos[i].type == "orb") {

				draw_image(objetos[i].skin, objetos[i].x, objetos[i].y, objetos[i].width, objetos[i].height, objetos[i].alpha)

			}else if (objetos[i].type == "speed-portal") {

				draw_image(objetos[i].skin, objetos[i].x, objetos[i].y, objetos[i].width, objetos[i].height, objetos[i].alpha)

			}

			draw_cube(objetos[i].x, objetos[i].y, objetos[i].width, objetos[i].height, objetos[i].color, objetos[i].hitalpha, false,0,0)

		}

		draw_image(player.skin, player.x, player.y, player.width, player.height, player.alpha, player.algle, player.x + player.width/2, player.y + player.height/2)

		draw_cube(player.x, player.y, player.width, player.height, "orange", player.hitalpha, false,0,0)

	}

	draw_cube(transicao.x, transicao.y, transicao.width, transicao.height, transicao.color, transicao.alpha/10,false,0,0)

}

function update() {

	/*console.clear()
	console.log(camera.x)
	console.log(camera.y)
	console.log(camera.hspd)
	console.log(camera.vspd)
	console.log(frames)
	console.log(cena_atu)
	console.log(camera.canmoveX)
	console.log(camera.canmoveY)*/

	if (transicao.transi_num == 1) {transicao.fede_in()}
	else if (transicao.transi_num == 2) {transicao.fede_out()}

	if (cena_atu == cenas[0]) {

		frames.prev = frames.atual		

		camera.prevX = camera.x
		camera.prevY = camera.y

		if (camera.canmove[0] == true) {

			camera.x = Math.floor(camera.x) + camera.hspd

		}else{

			player.x = Math.floor(player.x) + player.hspd

		}

		if (camera.canmove[1] == true) {

			camera.y = Math.floor(camera.y) + camera.vspd

		}else{

			player.y = Math.floor(player.y) + player.vspd

		}

		if (player.x >= canvas.width) {player.morrer()}
		else if (player.x <= -player.width){player.morrer()}

		if (player.y >= canvas.height) {player.morrer()}
		else if (player.y <= -player.height){player.morrer()}

		if (teclas[inputs[0]] == true) {

			if (camera.hspd != camera.spd) {

				camera.hspd+=camera.acc

			}

		}else if (teclas[inputs[1]] == true) {

			if (camera.hspd != -camera.spd) {

				camera.hspd-=camera.acc

			}

		}else if (teclas[inputs[0]] == false && teclas[inputs[0]] == false) {

			if (camera.hspd > 0) { camera.hspd -= camera.acc }
			else if (camera.hspd < 0) { camera.hspd += camera.acc }

		}

		if (camera.canmove[1] = true) {

			if (camera.vspd != camera.grav) {

				camera.vspd += camera.kilos

			}

		}else{

			if (player.vspd != camera.grav) {

				player.vspd += camera.kilos

			}

		}

		for (let i = 0; i < objetos.length; i++) {

			if (objetos[i].inicial != undefined) {

				objetos[i].x = objetos[i].inicial[0] - camera.x
				objetos[i].y = objetos[i].inicial[1] - camera.y	

			}

			colisao(player.x, player.y, player.width, player.height, objetos[i].x, objetos[i].y, objetos[i].width, objetos[i].height, function() {

				if (objetos[i].type == "spike" || objetos[i].type == "mult-spike" && player.dead == false) {

					player.morrer()

				}

				if (teclas[inputs[2]] && objetos[i].type == "orb") {

					camera.vspd = objetos[i].orb_force

				}

				if (objetos[i].type == "speed-portal") {

					camera.spd = objetos[i].speed

				}

				/*if (objetos[i].type == "end") {

					transicao.funcao = function () {

						frames.atual = 1
						level_2()

					}

					transicao.transi_num = 1

				}*/

			})

		}

		for (let i = 0; i < blocos.length; ++i) {

			if (blocos[i].inicial != undefined) {

				blocos[i].x = blocos[i].inicial[0] - camera.x
				blocos[i].y = blocos[i].inicial[1] - camera.y

			}

			if (blocos[i].select != undefined) {

				blocos[i].select = i

			}

			colisao(player.x, player.y, player.width, player.height, blocos[i].x, blocos[i].y, blocos[i].width, blocos[i].height, function () {

				console.log("colidiu")

				if (player.x + player.width <= blocos[i].inicial[0] - camera.prevX) {

					camera.x -= Math.floor((player.x + player.width) - blocos[i].x)
					camera.hspd = 0

				}else if (player.x >= (blocos[i].inicial[0] - camera.prevX) + blocos[i].width) {

					camera.x += Math.floor((blocos[i].x + blocos[i].width) - player.x)
					camera.hspd = 0

				}

				if (player.y + player.height <= blocos[i].inicial[1] - camera.prevY) {

					camera.y -= Math.floor((player.y + player.height) - blocos[i].y)

					camera.vspd = 0

					if (teclas[inputs[2]]) {

						camera.vspd = player.jump_force

					}


				}else if (player.y >= (blocos[i].inicial[1] - camera.prevY) + blocos[i].height) {

					camera.y += Math.floor(player.y - (blocos[i].y + blocos.height))
					camera.vspd = 0

				}

			})

		}

		frames.atual++
		
	}else if (cena_atu == cenas[1]) {

		background.x -= camera.hspd/8

		if (background.x <= -100) { background.x += 200 }

		frames.prev = frames.atual

		if (frames.atual == 1) {

			transicao.transi_num = 2

		}

		if (player.gamemode == 0) {

			player.grav = 8*estados.gravity
			player.skin = player_skin_1
			player.width = 65
			player.height = 65
			player.algle_add = 15

		}else if (player.gamemode == 1) {

			player.grav = 3*estados.gravity
			player.skin = wave_skin_1
			player.width = 60
			player.height = 60
			player.algle_add = 45/2

		}

		if (camera.canmoveX == true) {

			camera.prevX = camera.x
			camera.x = Math.floor(camera.x) + camera.hspd
			camera.hspd = camera.spd

		}else{

			player.prevX = player.x
			player.x = Math.floor(player.x) + player.hspd
			player.hspd = player.spd

		}

		if (camera.canmoveY == true) {

			camera.prevY = camera.y
			camera.y = Math.floor(camera.y) + camera.vspd

		}else{

			player.prevY = player.y
			player.y = Math.floor(player.y) + player.vspd

		}

		if (player.x >= canvas.width) {player.morrer()}
		else if (player.x <= -player.width){player.morrer()}

		if (player.y >= canvas.height) {player.morrer()}
		else if (player.y <= -player.height){player.morrer()}

		if (camera.canmoveY == true) {

			if (player.gamemode == 0) {

				if (camera.vspd != camera.grav) {

					camera.vspd += camera.kilos

				}

			}

		}else{

			if (player.gamemode == 0) {

				if (player.vspd != camera.grav) {

					player.vspd += camera.kilos

					console.log(player.chao)

					if (player.chao == false) {

						player.algle += player.algle_add

					}else{

						/*if (player.algle > 45 && player.algle < 180) {

							player.algle = 90

						}*/

						player.algle = 0

					}
				}

			}else if (player.gamemode == 1) {

				if (teclas[inputs[3]]) {

					player.vspd = -camera.grav

					if (player.algle != -45) {

						player.algle-=45/2

					}

				}else{

					player.vspd = camera.grav

					if (player.algle != 45) {

						player.algle+=45/2

					}

				}

			}

		}

		for (let i = 0; i < objetos.length; i++) {

			if (objetos[i].inicial != undefined) {

				objetos[i].x = objetos[i].inicial[0] - camera.x
				objetos[i].y = objetos[i].inicial[1] - camera.y	

			}

			colisao(player.x, player.y, player.width, player.height, objetos[i].x, objetos[i].y, objetos[i].width, objetos[i].height, function() {

				if (objetos[i].type == "spike" || objetos[i].type == "mult-spike" && player.dead == false) {

					player.morrer()

				}

				if (teclas[inputs[3]] && objetos[i].type == "orb") {

					if (player.gamemode == 0) {

						if (camera.canmoveY == true) {camera.vspd = objetos[i].orb_force}
						else {player.vspd = objetos[i].orb_force}

					}

				}

				if (objetos[i].type == "speed-portal") {

					camera.spd = objetos[i].speed

				}

				/*if (objetos[i].type == "end") {

					transicao.funcao = function () {

						cena_atu = cenas[1]

					}

					transicao.transi_num = 1

				}*/

			})

		}

		for (let i = 0; i < blocos.length; ++i) {

			if (blocos[i].inicial != undefined) {

				if (blocos[i].inicial[0] != null) {blocos[i].x = blocos[i].inicial[0] - camera.x}
				else if (blocos[i].inicial[1] != null) {blocos[i].y = blocos[i].inicial[1] - camera.y}

			}

			if (blocos[i].select != undefined) {

				blocos[i].select = i

			}

			colisao(player.x, player.y, player.width, player.height, blocos[i].x, blocos[i].y, blocos[i].width, blocos[i].height, function () {

					if (camera.canmoveX == true) {

						if (player.x + player.width <= blocos[i].inicial[0] - camera.prevX) {

							/*camera.x -= Math.floor((player.x + player.width) - blocos[i].x)
							camera.hspd = 0*/
							if (player.gamemode == 0 && player.gamemode == 1) {

								player.morrer()

							}

						}else if (player.x >= (blocos[i].inicial[0] - camera.prevX) + blocos[i].width) {

							/*camera.x += Math.floor((blocos[i].x + blocos[i].width) - player.x)
							camera.hspd = 0

							if (player.gamemode == 1) {

								player.morrer()

							}*/

						}

					}

					if (camera.canmoveY == true) {

						if (player.y + player.height <= blocos[i].inicial[1] - camera.prevY) {

							camera.y -= Math.floor((player.y + player.height) - blocos[i].y)

							camera.vspd = 0

							player.chao = true

							if (teclas[inputs[3]]) {

								camera.vspd = player.jump_force

							}


						}else if (player.y >= (blocos[i].inicial[1] - camera.prevY) + blocos[i].height) {

							camera.y += Math.floor(player.y - (blocos[i].y + blocos.height))
							camera.vspd = 0

						}

					}else{

						if (player.prevY + player.height <= blocos[i].inicial[1]) {

							if (player.gamemode == 0) {

								player.y -= Math.floor((player.y + player.height) - blocos[i].y)

								player.vspd = 0

								if (teclas[inputs[3]]) {

									player.vspd = player.jump_force

								}

							}else if (player.gamemode == 1) {

								player.morrer()

							}


						}else if (player.prevY >= blocos[i].inicial[1] + blocos[i].height) {

							/*player.y += Math.floor((blocos[i].y + blocos.height) - player.y)
							player.vspd = 0*/
							player.morrer()

						}

					}

			})

			if (player.y + player.height >= blocos[i].y && player.gamemode == 0) {

				player.chao = true

			}else if (player.y + player.height < blocos[i].y && player.gamemode == 0) {

				player.chao = false

			}

		}

		frames.atual++

	}

}

function loop() {
	
	draw()
	update()
	requestAnimationFrame(loop)

}

level_2()
loop()

alert("funcionou")
