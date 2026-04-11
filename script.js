const canvas = document.querySelector(".game")
const ctx = canvas.getContext("2d") //configurando o canvas

const cenas = ["level_1"]
let cena_atu = cenas[0]

const direita_button = document.querySelector(".direita")
const esquerda_button = document.querySelector(".esquerda")
const action_button = document.querySelector(".action")

let version = window.confirm("você está jogando num pc?")

//texturas

let player_skin_1 = new Image
player_skin_1.src = "static/player_1.png"

let yellow_orb_skin_1 = new Image
yellow_orb_skin_1.src = "static/yellow_orb.png"

let pink_orb_skin_1 = new Image
pink_orb_skin_1.src = "static/pink_orb.png"

let orange_orb_skin_1 = new Image
orange_orb_skin_1.src = "static/orange_orb.png"

let spike_skin_1 = new Image
spike_skin_1.src = "static/spike_1.png"

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

function draw_image(image, x, y, width, height, alpha) {

	ctx.globalAlpha = alpha
	ctx.drawImage(image, x, y, width, height)

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

function colisao_adv(obj1_x, obj1_y, obj1_width, obj1_height,obj2_x, obj2_y, obj2_width, obj2_height, funcao1, funcao2) {

	if (obj1_x < obj2_x + obj2_width &&
		obj1_x + obj1_width > obj2_x &&
		obj1_y < obj2_y + obj2_height &&
		obj1_y + obj1_height > obj2_y
		) {

		funcao1()

	}else{

		funcao2()

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

// verifica se há colisão

let player
let blocos
let objetos
let spikes

const teclas = {}
let inputs = ["d", "a", "w"]

if (version == false) {

	canvas.style.width = "100vw"
	canvas.style.height = "auto"
	canvas.style.maxHeight = "100vh"

	direita_button.addEventListener("touchstart", function() {teclas[inputs[1]] = true})
	direita_button.addEventListener("touchend", function() {teclas[inputs[1]] = false})

	esquerda_button.addEventListener("touchstart", function() {teclas[inputs[0]] = true})
	esquerda_button.addEventListener("touchend", function() {teclas[inputs[0]] = false})

	action_button.addEventListener("touchstart", function() {teclas[inputs[2]] = true})
	action_button.addEventListener("touchend", function() {teclas[inputs[2]] = false})

}else{

	document.addEventListener("keydown", e => teclas[e.key] = true)
	document.addEventListener("keyup", e => teclas[e.key] = false)

	direita_button.style.opacity = 0
	esquerda_button.style.opacity = 0
	action_button.style.opacity = 0

}

function level_1() {
	
	player = {

		x:150,
		y:150,
		prevX:250,
		prevY:350,
		width:65,
		height:65,
		alpha:1,
		spd:4,
		hspd:0,
		acc:0.25,
		dcc:0.125,
		vspd:0,
		grav:8,
		kilos:0.8,
		jump_force:-15

	}

	blocos = [

		{x:0, y:550, width:1000, height:50, color:"black", alpha:1}, //chão
		{x:0, y:300, width:250, height:250, color:"black", alpha:1},
		{x:800, y:350, width:200, height:200, color:"black", alpha:1}

	]

	objetos = [

		{x:700, y:320, width:60, height:60, color:"green", alpha:1, orb_force:-15, type:"orb"},
		{x:300, y:250, width:60, height:60, color:"green", alpha:1, orb_force:-10, type:"orb"},
		{x:500, y:380, width:60, height:60, color:"green", alpha:1, orb_force:-20, type:"orb"},
		{x:260, y:490, width:530, height:40, color:"red", alpha:1, type:"spike"}

	]

}

function draw() {

	ctx.clearRect(0,0, canvas.width, canvas.height)

	if (cena_atu == cenas[0]) {

		for (let i = 0; i <= blocos.length-1; i++) {

			draw_cube(blocos[i].x, blocos[i].y, blocos[i].width, blocos[i].height, blocos[i].color, blocos[i].alpha, false, 0, 0)

		}

		for (let i = 0; i <= objetos.length-1; i++) {

			draw_cube(objetos[i].x, objetos[i].y, objetos[i].width, objetos[i].height, objetos[i].color, 0, false, 0, 0)

		}

		draw_cube(player.x, player.y, player.width, player.height, "orange", 0, false,0,0)

		draw_image(yellow_orb_skin_1, objetos[0].x, objetos[0].y, objetos[0].width, objetos[0].height, objetos[0].alpha)
		draw_image(pink_orb_skin_1, objetos[1].x, objetos[1].y, objetos[1].width, objetos[1].height, objetos[1].alpha)
		draw_image(orange_orb_skin_1, objetos[2].x, objetos[2].y, objetos[2].width, objetos[2].height, objetos[2].alpha)

		draw_alto_x_img(spike_skin_1, 251, 475, 75, 75, 1, 79, 7)

		draw_image(player_skin_1, player.x, player.y, player.width, player.height, player.alpha)

	}

}

function update() {

	if (cena_atu == cenas[0]) {

		player.prevX = player.x
		player.prevY = player.y

		player.x += player.hspd
		player.y += player.vspd

		if (teclas[inputs[0]] == true) {

			if (player.hspd != player.spd) {

				player.hspd+=player.acc




			}

		}else if (teclas[inputs[1]] == true) {

			if (player.hspd != -player.spd) {

				player.hspd-=player.acc

			}

		}else{

			if (player.hspd > 0) {

				player.hspd-=player.dcc

			}else if(player.hspd < 0) {

				player.hspd+=player.dcc

			}

		}

		if (player.vspd != player.grav) {

			player.vspd += player.kilos

		}

		for (let i = 0; i < objetos.length; i++) {

			colisao(player.x, player.y, player.width, player.height, objetos[i].x, objetos[i].y, objetos[i].width, objetos[i].height, function() {

				if (objetos[i].type == "spike") {

					player.spd = 0
					player.hspd = 0
					player.vspd = 0
					teclas[inputs[0]] = false
					teclas[inputs[1]] = false
					teclas[inputs[2]] = false
					for (let i = 0; i <= objetos.length-1; i++) {

						draw_cube(objetos[i].x, objetos[i].y, objetos[i].width, objetos[i].height, objetos[i].color, 0.5, false, 0, 0)

					}

				}

			})

		}

		for (let i = 0; i < objetos.length; i++) {

			colisao(player.x, player.y, player.width, player.height, objetos[i].x, objetos[i].y, objetos[i].width, objetos[i].height, function() {

				if (teclas[inputs[2]] && objetos[i].type == "orb") {

					player.vspd = objetos[i].orb_force

				}

			})

		}

		for (let i = 0; i < blocos.length; ++i) {

			colisao(player.x, player.y, player.width, player.height, blocos[i].x, blocos[i].y, blocos[i].width, blocos[i].height, function () {

				if (player.prevX + player.width <= blocos[i].x) {

					player.x = blocos[i].x - player.width
					player.hspd = 0

				}else if (player.prevX >= blocos[i].x + blocos[i].width) {

					player.x = blocos[i].x + blocos[i].width
					player.hspd = 0

				}

				if (player.prevY + player.height <= blocos[i].y) {

					player.y = blocos[i].y - player.height
					player.vspd = 0

					if (teclas[inputs[2]]) {

						player.vspd = player.jump_force

					}


				}else if (player.prevY >= blocos[i].y + blocos[i].height) {

					player.y = blocos[i].y + blocos[i].height
					player.vspd = 0

				}

			})

		}
		
	}

}

function loop() {
	
	draw()
	update()
	requestAnimationFrame(loop)

}

level_1()
loop()

alert("funcionou")
