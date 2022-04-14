
var IO = {
	init: function () {
		IO.socket = io(); //same as const socket = io(); for initializing the socket object
		IO.bindEvents();
	},

	bindEvents: function (){
		IO.socket.on('connected', IO.onConnected)
		IO.socket.on('newGameCreated', IO.onNewGameCreated)
		IO.socket.on('ghostJoinedRoom', IO.onGhostJoinedRoom)
		IO.socket.on('initGhostScreen', IO.onInitGhostScreen)
		IO.socket.on('updatePacmanMove', IO.updatePacmanMove)
		IO.socket.on('updateGhostMove', IO.updateGhostMove)
		IO.socket.on('showGameOver', IO.showGameOver)
		IO.socket.on('notifyRoomFull', IO.notifyRoomFull)
		//IO.socket.on('render', IO.onrender)
	
	},

	onConnected: function (){
		App.mySocketId = IO.socket.socket.sessionId;
	},

	onrender: function (pacman, enemies){
		App.initGhostScreen(pacman, enemies);
		//setInterval(function(){gameLoop(pacman, enemies)}, 1000 / 75);
		console.log("render");
	},
	

	onNewGameCreated: function(data){
		App.Pacman.initGame(data)
	},

	onGhostJoinedRoom: function(data){
		App.Pacman.updateWaitingScreen(data)
	},

	onInitGhostScreen: function(data){
		//App.Ghost.initGhostScreen(data); // go to line 144
		//App.Pacman.initGhostScreen(data);
			const canvas = document.getElementById("canvas");

			const tileSize = 32;
			const velocity = 2;
			
	
			const ctx = canvas.getContext("2d");
	
			const tileMap = new TileMap(tileSize);
			const pacman = tileMap.getPacman(velocity);
			const enemies = tileMap.getEnemies(velocity);
			
			let gameOver = false;
			let gameWin = false;
			const gameOverSound = new Audio('../sounds/gameOver.wav');
			const gameWinSound = new Audio('../sounds/gameWin.wav');
		App.initGhostScreen(pacman, enemies);

	},

	updatePacmanMove: function(data){
		App.Ghost.updatePacmanMove(data)
	},

	updateGhostMove: function(data){
		App.Pacman.updateGhostMove(data)
	},

	showGameOver: function(data){
		App.showGameOver(data)
	},

	notifyRoomFull: function(data){
		App.showRoomFull(data)
	}
}

var App = {
	mySocketId: '',

	gameId: 0,

	noPlayers: 0,

	init: function () {
		App.cacheElements();
		App.showInitScreen();
		App.bindEvents();
	},
	
	cacheElements: function (){
		App.$doc = $(document);

		// Templates
		App.$gameArea = $('#gameArea');
		App.$templateIntroScreen = $('#intro-screen-template').html();
		App.$templateNewGame = $('#create-game-template').html();
		App.$templateJoinGame = $('#join-game-template').html();
		App.$hostGame = $('#host-game-template').html();
		App.$templateGameOver = $('#game-over-template').html();
		App.$templateRoomFull = $('#room-full-template').html();
	},
	
	bindEvents: function () {
		// Pacman events
		App.$doc.on('click', '#btnCreateGame', App.Pacman.onCreateClick);

		// Ghost events
		App.$doc.on('click', '#btnJoinGame', App.Ghost.onJoinClick);
		App.$doc.on('click', '#btnStartGame', App.Ghost.onStartClick);
	},

	showInitScreen: function(){
		App.$gameArea.html(App.$templateIntroScreen)
	},

	displayNewGameScreen: function(){
		App.$gameArea.html(App.$templateNewGame)
		$('#gameId').html(App.gameId)
	},

	gameOver: function(winner){
		IO.socket.emit('gameOver', {winner: winner})
	},

	showGameOver: function(data){
		App.$gameArea.html(App.$templateGameOver)
		$('#winner').html(data.winner)
	},

	showRoomFull: function(data){
		App.$gameArea.html(App.$templateRoomFull)
	},

	initGhostScreen: function(pacman, enemies){
		//var canvas = document.getElementById('canvas-ghost');
		//var canvas = document.getElementById("canvas");
		//initGhostScreen(canvas); // go to function initGHostScreen in Ghost.js function 3
		//initCanvasGame(canvas ,pacman, enemies);
		//setInterval(gameLoop, 1000/75);
		//console.log("initcanvasgame");
		/*
		 canvas = document.getElementById("canvas");

			//const tileSize = 32;
			const velocity = 2;
			
	
			//const ctx = canvas.getContext("2d");
	
			const tileMap = new TileMap(tileSize);
			//const pacman = tileMap.getPacman(velocity);
			//const enemies = tileMap.getEnemies(velocity);
			
			let gameOver = false;
			let gameWin = false;
			const gameOverSound = new Audio('../sounds/gameOver.wav');
			const gameWinSound = new Audio('../sounds/gameWin.wav');
		*/
	

		IO.socket.emit('update', pacman, enemies);
		IO.socket.on('render', pacman, enemies)
		{
			/*
			const canvas = document.getElementById("canvas");

			const tileSize = 32;
			const velocity = 2;
			
	
			const ctx = canvas.getContext("2d");
	
			const tileMap = new TileMap(tileSize);
			const pacman = tileMap.getPacman(velocity);
			const enemies = tileMap.getEnemies(velocity);
			
			let gameOver = false;
			let gameWin = false;
			const gameOverSound = new Audio('../sounds/gameOver.wav');
			const gameWinSound = new Audio('../sounds/gameWin.wav');
			*/
			setInterval(function(){gameLoop(pacman, enemies)}, 1000 / 75);
			console.log("yes");
		}

	},

	UpdateScreen: function(a,b,c,d,e,f)
	{
		var canvas = document.getElementById("canvas");
		//initGhostScreen(canvas); // go to function initGHostScreen in Ghost.js function 3
		IO.socket.emit('updatecanvas', canvas);
	},

	Pacman:{
		onCreateClick: function () {
			IO.socket.emit('pacmanCreateNewGame');
		},

		initGame: function(data){
			App.gameId = data.gameId;
			App.displayNewGameScreen();
		},

		updateWaitingScreen: function(data){
			$('#waiting').html('Player joined!')
			//var canvas = document.getElementById('canvas')
			//const canvas = document.getElementById("gameCanvas");
			setInterval(gameLoop, 1000/75);
			//initCanvasGame(canvas, pacman, enemies);
		},

		pacmanMoved: function(state, keyCode, direction){
			IO.socket.emit('pacmanMoved', {X: state.X, Y: state.Y, keyCode: keyCode, direction: direction})
		},

		updateGhostMove: function(data){
			updateGhostInPacmanScreen(data);
		}
	},

	Ghost:{
		onJoinClick: function(){
			App.$gameArea.html(App.$templateJoinGame);
		},
		onStartClick: function(){
			data = {
				gameId: $('#inputGameId').val()
			}
			IO.socket.emit('ghostJoinedGame', data) //eto nagmessage sa server
		},
		initGhostScreen: function(data){
			var canvas = document.getElementById('canvas-ghost');
			//initGhostScreen(canvas); // go to function initGHostScreen in Ghost.js function 3
			initCanvasGame(canvas);
			//IO.socket.emit('multi', canvas);

		},
		updatePacmanMove: function(data){
			updatePacmanInGhostScreen(data);
		},

		ghostMoved: function(state, keyCode, direction){
			IO.socket.emit('ghostMoved', {X: state.X, Y: state.Y, keyCode: keyCode, direction: direction})
		}
	}
}

$(document).ready(function(){
	IO.init();
	App.init();
})