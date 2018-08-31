//Code By: Akash Kulkarni (SkylordAK)
//GitHub: github.com/SkylordAK
let pattern = []
let blocks = []
let block_size = 40
let moves = 0
let pressed = false
let slide_sound, winner1_sound, winner2_sound;
let woc = 1
let gotwin = 0
let getColor = ['R', 'R', 'R', 'R','N',
				'G', 'G', 'G', 'G',
				'B', 'B', 'B', 'B', 
				'Y', 'Y', 'Y', 'Y', 
				'O', 'O', 'O', 'O',
				'W', 'W', 'W', 'W']
let winner = false

function preload() {
	slide_sound = loadSound('Sounds/slide.mp3')
	winner1_sound = loadSound('Sounds/winner1.mp3')
	winner2_sound = loadSound('Sounds/winner2.mp3')
}
function setup() {
	createCanvas(800, 400)
	makePattern()
	for (let i = 0;i < 5; i++) {
		blocks[i] = []
		for (let j = 0;j < 5; j++) {
			let x = i*40
			let y = j*40
			blocks[i][j] = new playerTile(x, y, block_size, getColor.splice(0, 1)[0])
		}
	}
}

function makePattern() {
	for (let i = 0;i < 3; i++) {
		pattern[i] = []
		for (let j = 0;j < 3; j++) {
			let x = i*40
			let y = j*40
			pattern[i][j] = new patternMaker(x, y, block_size)
		}
	}
}
function draw() {
	let d = new Date()
	background(112, 44, 123)
	push()
	textSize(20)
	text('Moves: '+moves, width/2-34, 53)
	pop()
	push()
	stroke(255, 0, 0)
	strokeWeight(4)
	line(width/2, 0, width/2, 30)
	line(width/2, 60, width/2, height)
	pop()
	for (let i = 0;i < pattern.length; i++) {
		for (let j = 0;j < pattern.length; j++) {
			pattern[i][j].show()
		}
	}	
	for (let i = 0;i < blocks.length; i++) {
		for (let j = 0;j < blocks.length; j++) {
			blocks[i][j].show()
			fill(255)
		}
	}
	push()
	noFill()
	strokeWeight(4)
	rect(140, 120, 120, 120)
	pop()
	checkWinner()
	if (winner) {
		pressed = false
		push()
		textSize(40)
		fill(0, 50, 150)
		text("Completed in "+moves+" Moves", 200, 200)
		text("Winner!!! Press Space to Play Again!!", 50, 250)
		pop()
		playSounds(1, 'play')
		playSounds(2, 'play')
	}
}
function getCol(col) {
		switch(col) {
			case 'R':
				return fill(255, 0, 0) //red
				break
			case 'G':
				return fill(0, 255, 0) //green
				break
			case 'B':
				return fill(0, 0, 255) //blue
				break
			case 'Y':
				return fill(255, 255, 0) //yellow
				break
			case 'O':
				return fill(255, 165, 0) //orange
				break
			case 'W':
				return fill(255, 255, 255) //white
				break
			default:
				fill(0)
				break
			
		}
}
function patternMaker(x, y, w) {
	this.x = x
	this.y = y
	this.w = w
	this.col = random(['R', 'G', 'B', 'W', 'O', 'Y'])
	this.show = function() {
		getCol(this.col)
		rect((this.x+width/2)+width/5, this.y+height/3-10, this.w, this.w)
		fill(0)
		text(this.col, (this.x+width/2)+width/5+15, this.y+height/3+15)
	}
}
function playerTile(x, y, w, col) {
	this.x = x
	this.y = y
	this.w = w
	this.col = col
	this.mover = false
	this.swap = function(x, y) {
		x.mover = false
		let temp = x.col
		x.col = y.col
		y.col = temp
		y.mover = true
	}
	this.show = function() {
		if (this.col == 'N') {
			this.mover = true
		}
		getCol(this.col)
		rect(this.x+width/8, this.y+height/5, this.w, this.w)
		fill(0)
		text(this.col, this.x+width/7, this.y+height/4)
	}
}
function checkWinner() {
	for(let i = 1;i < 4; i++) {
		for (let j = 1;j < 4; j++) {
			if (blocks[j][i].col == pattern[j-1][i-1].col) {
				gotwin = 0
			} else {
				gotwin = 1
				break
			}
		}
		if (gotwin == 1) {
			break
		}
	}
	if (gotwin == 0) {
		winner = true
	} if (gotwin == 1) {
		winner = false
	}
}

function playSounds(pick, operation, count) {
	if (operation == 'play') {
		if (pick == 0) {
			slide_sound.play()
		} if (pick == 1 && (!winner1_sound.isPlaying()) && woc == 1) {
			winner1_sound.play()
			woc = 2;
		} if (pick == 2 && (!winner2_sound.isPlaying())) {
			winner2_sound.play()
		}
	}
}
function keyPressed() {
	if (winner && key == ' ') {
			makePattern()
			winner = false
			woc = 1
			moves = 0
	}
	for (let i = 0;i < blocks.length; i++) {
		for (let j = 0;j < blocks.length; j++) {
			if (keyCode == RIGHT_ARROW) {
				if (blocks[i][j].mover) {
					if (blocks[i-1][j].col != 'N') {
						blocks[i][j].swap(blocks[i][j], blocks[--i][j])
						playSounds(0, 'play')
						if (!winner) {
							moves++
						}
						pressed = true
					}
				}
			} if (keyCode == LEFT_ARROW) {
				if (blocks[i][j].mover) {
					if (blocks[i+1][j].col != 'N') {
						blocks[i][j].swap(blocks[i][j], blocks[++i][j])
						playSounds(0, 'play')
						if (!winner) {
							moves++
						}
						pressed = true
					}
				}
			} if (keyCode == UP_ARROW) {
				if (blocks[i][j].mover) {
					if (blocks[i][j+1].col != 'N') {
						blocks[i][j].swap(blocks[i][j], blocks[i][++j])
						playSounds(0, 'play')
						if (!winner) {
							moves++
						}
						pressed = true
					}
				}
			} if (keyCode == DOWN_ARROW) {
				if (blocks[i][j].mover) {
					if (blocks[i][j-1].col != 'N') {
						blocks[i][j].swap(blocks[i][j], blocks[i][--j])
						playSounds(0, 'play')
						if (!winner) {
							moves++
						}
						pressed = true
					}
				}
			}			
		}
	}
}